from sentence_transformers import SentenceTransformer, CrossEncoder
from keybert import KeyBERT
from pgvector.psycopg2 import register_vector
from django.db import connection
from collections import OrderedDict
from cache_manage import Manager

import numpy as np

class FindBook:

    def __init__(self):

        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')  # Example model
        self.cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')


    def queryToVec(self, query):
        
        return self.model.encode(query),
    
    def query_to_keyword_string(self, question):
        kw_model = KeyBERT()

        og_words = question.split()

        # keywords = kw_model.extract_keywords(question)

        items = kw_model.extract_keywords(question, keyphrase_ngram_range=(1, 1), stop_words=None)
        high_score = items[0][1]
        threshold = 0.60*high_score
        print(items)
        words = []
        
        for i, item in enumerate(items):
            words.append(item[0])
            if item[1] < threshold:
                break

        words = " ".join(words[::-1])

        print("\nKeywords only query - ", words)

        return words


    def searcher_cross_embedding(self, cursor, vector, doc_id_list, top_k=10):

        if len(doc_id_list) > 1:
            query = f"""SELECT doc_id, doc_summary from (
                                            SELECT * from doc_embeddings where doc_id IN {str(tuple(doc_id_list))}) as subset
                                            ORDER BY subset.doc_summary_vectors <=> %s LIMIT {top_k}"""
            cursor.execute(query, (vector,))
        else:
            query = f"""SELECT doc_id, doc_summary from (
                                            SELECT * from doc_embeddings where doc_id = {str(doc_id_list[0])}) as subset 
                                            ORDER BY subset.doc_summary_vectors <=> %s LIMIT {top_k}"""
            cursor.execute(query, (vector,))
        return cursor

    def searchBook(self, query):

        # Connect to and configure vector database
        raw_query = query
        query = self.query_to_keyword_string(query)
        vector = self.queryToVec(query)

        cache = Manager()
        result = cache.check_cache(vector)

        # Its a cache miss
        if result == -1:

            register_vector(connection)
            with connection.cursor() as cursor:

                # Identify the genre ids for the given genre
                cursor.execute("""SELECT doc_genre_id from 
                            doc_genre ORDER BY doc_genre_vector
                            <-> %s LIMIT 3""", (vector,))
                
                # List of all genre_ids that matches
                genre_list = [entry[0] for entry in cursor.fetchall()]
                print('genre list - ', genre_list)

                # Obtaining the corresponding books
                if len(genre_list) >1:
                    cursor.execute("""SELECT doc_id from 
                                id_genre where doc_genre_id in """+ str(tuple(genre_list)))
                else:
                    cursor.execute("""SELECT doc_id from 
                                id_genre where doc_genre_id = """+ str(genre_list[0]))

                # List of all doc_ids that matches the required genre
                doc_id_list = [entry[0] for entry in cursor.fetchall()]
                
                # Collecting most similar results limited to 32
                cursor = self.searcher_cross_embedding(cursor, vector, doc_id_list)
                # print('cursor result - ', cursor.fetchall()[0])
                results = cursor.fetchall()
                doc_ids = [entry[0] for entry in results]
                doc_summaries = [entry[1] for entry in results]
                cross_inp = [[raw_query, hit] for hit in doc_summaries]
                cross_scores = self.cross_encoder.predict(cross_inp)
                final_result = []

                # Sort results by the cross-encoder scores
                for idx in range(len(cross_scores)):
                    final_result.append({'id': doc_ids[idx], 'cross-score': cross_scores[idx]})
                print("\n-------------------------\n")
                print("Top-3 Cross-Encoder Re-ranker hits")
                hits = sorted(final_result, key=lambda x: x['cross-score'], reverse=True)
                id_and_cross_score = {}
                
                for i, _ in enumerate(hits):
                    hits[i]['cross-score'] +=20

                    # Noting down highes cross score for each id
                    if hits[i]['id'] not in id_and_cross_score.keys():
                        id_and_cross_score[hits[i]['id']] = hits[i]['cross-score']

                for hit in hits[0:3]:
                    print("\t{:.3f}\t{}".format(hit['cross-score'], hit['id']))
                
                max_score = hits[0]['cross-score']
                
                threshold_score = max_score*0.65
                doc_id_set = set()
                doc_ids = []
                for hit in hits:
                    if hit['cross-score']>=threshold_score:
                        if hit['id'] not in doc_id_set:
                            doc_id_set.add(hit['id'])
                            doc_ids.append(hit['id'])
                    else:
                        break

                # checking if highest cross score and second highest cross score are at 20% difference. 
                # If yes, a flag is passed to compare the length of the pdf and the smallest pdf is kept higher.
                flag_for_size_check = False
                if len(doc_ids) > 1:
                    if id_and_cross_score[doc_ids[0]]*0.90 <= id_and_cross_score[doc_ids[1]]:
                        flag_for_size_check = True


                # Fetching book data
                print('docids - ',doc_ids, '\n\n')


                # Collecting genres of each result
                if len(doc_ids) > 1:
                    cursor.execute(f"""select sub.doc_id, genres.doc_genre_name from (select doc_id, doc_genre_id from id_genre where doc_id in {str(tuple(doc_ids))}) 
                                as sub, doc_genre as genres where sub.doc_genre_id = genres.doc_genre_id""")
                else:
                    cursor.execute(f"""select sub.doc_id, genres.doc_genre_name from (select doc_id, doc_genre_id from id_genre where doc_id = {str(doc_ids[0])}) 
                                as sub, doc_genre as genres where sub.doc_genre_id = genres.doc_genre_id""")
                    
                dict_of_genres = {}

                for entry in cursor.fetchall():
                    dict_of_genres[int(entry[0])] = entry[1]

                if len(doc_ids) > 1:
                    cursor.execute("""select doc_id, doc_name, doc_author, doc_publish_year, doc_type, doc_path from document where doc_id in """ + str(tuple(doc_ids)))
                else:
                    cursor.execute("""select doc_id, doc_name, doc_author, doc_publish_year, doc_type, doc_path from document where doc_id = """ + str(doc_ids[0]))

                # Book details as dictionaries (indexed by bookids)
                book_details = {}
                for entry in cursor.fetchall():
                    book_details[entry[0]] = entry + (dict_of_genres[int(entry[0])],)
                    # print(entry[1], '\t', )
                
                result = []

                for id in doc_ids:

                    result.append(book_details[id])

                return False, vector, result, query, flag_for_size_check
        else:

            # Its a cache hit
            return True, -1, result, False, False