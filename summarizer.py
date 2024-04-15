from transformers import pipeline
import together
import tiktoken, requests

class Summarizer:

    def __init__(self):
        
        # Give it 20000 as 20000/2 + 20000 < 32000 (input_token_len + max_new_token_len < total_tokens)
        self.token_limit = 9000

    def generator(self, query, input_token_len):

        together.api_key = "API KEY HERE"

        
        n_tokens_gen = 0
        generatedText = ''

        # Loop until the generated summary is greater than 1/3 the length of the input text
        while n_tokens_gen < (1/3)*(input_token_len):
            
            print("Looping...")
            output = together.Complete.create(
            prompt=query,
            model="codellama/CodeLlama-34b-Instruct-hf",
            max_tokens = input_token_len//2,
            temperature = 0.8,
            )
            generatedText = output['choices'][0]['text']
            n_tokens_gen = self.num_tokens_from_string(generatedText)

        return generatedText, n_tokens_gen

    def num_tokens_from_string(self, string: str, encoding_name = "cl100k_base") -> int:
        if not string:
            return 0
        # Returns the number of tokens in a text string
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens


    def token_limited_data(self, data, query):

        new_list = []
        basic_len = self.num_tokens_from_string(query)
        token_len = self.num_tokens_from_string(data)

        if token_len < self.token_limit - basic_len:
            new_list.append((data, token_len))
        else:
            # add content to the new list in chunks
            start = 0
            ideal_token_size = self.token_limit - basic_len

            # 1 token ~ 3/4 of a word
            ideal_size = int(ideal_token_size // (5/3))
            end = ideal_size
            #split text by spaces into words
            words = data.split()

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
                    new_list.append((new_content_string, new_content_token_len))
                start += ideal_size
                end += ideal_size
        
        return new_list


    def generate(self, full_transcript):

        mainQuery = """ The following transcript is a small part of the full transcript of a book/article/research paper/journal. Summarize this data enclosed in double 
                    quotes to atleast more than one thirds of its length while retaining all the important meanings (and most of the important keywords that's been used) and removing all non 
                    alpha numeric characters. The output should contain only the summary and no other words. Data: " """

        token_limited_transcripts = self.token_limited_data(full_transcript, mainQuery)

        final_transcript = ""

        for page, token_len in token_limited_transcripts:
            
            query = mainQuery + page + """ "."""
            if final_transcript != '':
                final_transcript += '\n'
            
            # print('Token length for this query - ',token_len)
            new_transcript, new_token_len = self.generator(query, token_len)
            final_transcript +=  new_transcript
            # final_transcript += self.generator(query)[0]['generated_text']

            print('\n\nToken length for this query - ',token_len, ',\tSummary token length', new_token_len)
            print('Oldddd - \n', page,'\n\n\n\nNewwww - ', new_transcript,'\n\n')

        return final_transcript
