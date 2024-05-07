from together import Together
from pgvector.psycopg2 import register_vector
from django.db import connection
import tiktoken
import os, PyPDF2
from psycopg2.extras import execute_values
import psycopg2, numpy as np
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTPage
from sentence_transformers import SentenceTransformer, CrossEncoder
from keybert import KeyBERT


class QuerytoAnswer:

    def __init__(self) -> None:
        self.bi_encoder = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')  # Example model        
        self.top_k = 32
        #The bi-encoder will retrieve 100 documents. We use a cross-encoder, to re-rank the results list to improve the quality
        self.cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

    def get_embeddings(self, data):
        return self.bi_encoder.encode(data)

    def num_tokens_from_string(self, string: str, encoding_name = "cl100k_base") -> int:
        if not string:
            return 0
        # Returns the number of tokens in a text string
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    def token_limited_data_testing(self, full_transcript):

        new_list = []

        text = full_transcript
        token_len = self.num_tokens_from_string(text)
        if token_len <= 512:
            new_list.append([text])
        else:
            # add content to the new list in chunks
            start = 0
            ideal_token_size = 512
            # 1 token ~ 3/4 of a word
            ideal_size = int(ideal_token_size // (4/3))
            end = ideal_size
            #split text by spaces into words
            words = text.split()

            #remove empty spaces
            words = [x for x in words if x != ' ']

            total_words = len(words)
            
            #calculate iterations
            chunks = total_words // ideal_size
            if total_words % ideal_size != 0:
                chunks += 1
            
            new_content = []
            for j in range(chunks):
                if end > total_words:
                    end = total_words
                new_content = words[start:end]
                new_content_string = ' '.join(new_content)
                new_content_token_len = self.num_tokens_from_string(new_content_string)
                if new_content_token_len > 0:
                    new_list.append([new_content_string])
                start += ideal_size
                end += ideal_size
        
        return new_list


    def add_table_and_search(self, title, pagewise_transcript, query):


        register_vector(connection)
        with connection.cursor() as cur:

            # Create a table for the book
            table_create_command = f"""
            CREATE TABLE {title} (
                        id integer, 
                        transcript text,
                        embedding vector(384)
                        );
                        """

            try:
                cur.execute(table_create_command)
            except:
                cur.execute(f"drop table {title}")
                cur.execute(table_create_command)

            print("\nTable created!")

            # Add pagewise transcript to the table of the book
            values = []
            for i, page in enumerate(pagewise_transcript):
                # print(i, end=' ')
                data = self.token_limited_data_testing(page)
                # for sets in data:
                values += [[i]+ sets + [np.array(self.get_embeddings(sets[0]))] for sets in data]
            execute_values(cur, f"INSERT INTO {title} (id, transcript, embedding) VALUES %s", values)
            print("Table filled!")

            """
            Initiating cross encoder matching
            """

            embedding_array = np.array(self.get_embeddings(query))

            cur.execute(f"SELECT id, transcript FROM {title} ORDER BY embedding <=> %s LIMIT %s", (embedding_array, self.top_k))
            result = cur.fetchall()
            final_result = []
            for val in result:
                final_result.append({'id': val[0], 'text': val[1]})

            cross_inp = [[query, hit['text']] for hit in final_result]
            cross_scores = self.cross_encoder.predict(cross_inp)
            # Sort results by the cross-encoder scores
            for idx in range(len(cross_scores)):
                final_result[idx]['cross-score'] = cross_scores[idx]
            print("\n-------------------------\n")
            print("Top-3 Cross-Encoder Re-ranker hits")
            hits = sorted(final_result, key=lambda x: x['cross-score'], reverse=True)
            for i, hit in enumerate(hits):
                hits[i]['cross-score'] +=20

            for hit in hits[0:3]:
                print("\t{:.3f}\t{}".format(hit['cross-score'], hit['id']))

            max_score = hits[0]['cross-score']
            # if max_score > threshold:
            threshold_score = max_score*0.93
            best_pages_set = set()
            best_pages = []
            for hit in hits:
                if hit['cross-score']>=threshold_score:
                    if hit['id'] not in best_pages_set:
                        best_pages_set.add(hit['id'])
                        best_pages.append(hit['id']+1)
                else:
                    break
            
            cur.execute(f"drop table {title}")

            print("\bBest pages - ", best_pages)
        
        return best_pages

    def get_transcript_and_add (self, dir, file_name, query):

        # path = self.page_selector(dir, file_name)
        path = os.path.join(dir, file_name)
        # Intitial details as first page
        pagewise_transcript = []
        # pagewise_transcript_non_lemmatised = pagewise_transcript


        with open(path, 'rb') as pdf_file:
            for page_layout in extract_pages(pdf_file):
                # Check if it's a page object (not all layouts are pages)
                if isinstance(page_layout, LTPage):
                    page_text = ""
                    for element in page_layout:
                        # Extract text from different layout elements (text lines, characters, etc.)
                        if hasattr(element, 'get_text'):
                            page_text += element.get_text() + '\n'  # Add newline for readability

                    pagewise_transcript.append(page_text)
        print("Transcript recieved!")
        # os.remove(path)
        best_pages = self.add_table_and_search('dummy_table', pagewise_transcript, query)
        
        transcript = '   '.join([pagewise_transcript[element-1] for element in best_pages])

        return best_pages, transcript

    def generate_answer(self, dir, file_name, keyword_query, actual_query):

        best_pages, transcript = self.get_transcript_and_add(dir, file_name, keyword_query)

        print("\nSending LLM query")

        query = f"""Based on the context of the following page from a book (Just mention the answer and not about the source) enclosed in double quotes here - "{transcript}" and general knowledge, answer the 
            user query in 80 words- {actual_query}"""

        client = Together(api_key=open('together_api_key.txt', 'r').readline().rstrip('\n'))

        response = client.chat.completions.create(
            model="mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages=[{"role": "user", "content": query}],
        )

        print("\nRecieved LLM response")
        
        return best_pages, response.choices[0].message.content