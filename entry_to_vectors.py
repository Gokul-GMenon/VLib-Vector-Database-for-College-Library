"""
Processing input data to create vectors
"""

import tiktoken
import pandas as pd
from sentence_transformers import SentenceTransformer

class Vectorize:

    def __init__(self):
        
        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')  # Example model
        
    def get_embeddings(self, data):
        return self.model.encode(data)



    def num_tokens_from_string(self, string: str, encoding_name = "cl100k_base") -> int:
        if not string:
            return 0
        # Returns the number of tokens in a text string
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens


    def token_limited_data(self, data):

        new_list = []

        text = data['content']
        token_len = self.num_tokens_from_string(text)
        if token_len <= 512:
            new_list.append([data['title'], data['content'], data['author'], data['year'], data['type'], data['path'], token_len, data['genre']])
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
                    new_list.append([data['title'], new_content_string, data['author'], data['year'], data['type'], data['path'], new_content_token_len, data['genre']])
                start += ideal_size
                end += ideal_size
        
        return new_list
    
    """
    Testing code
    """
    def token_limited_data_testing(self, data, full_transcript):

        new_list = []

        text = full_transcript
        token_len = self.num_tokens_from_string(text)
        if token_len <= 512:
            new_list.append([data['title'], text, data['author'], data['year'], data['type'], data['path'], token_len, data['genre']])
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
                    new_list.append([data['title'], new_content_string, data['author'], data['year'], data['type'], data['path'], new_content_token_len, data['genre']])
                start += ideal_size
                end += ideal_size
        
        return new_list
    

    def add_embeddings(self, new_list):
    
        for i in range(len(new_list)):
            new_list[i].append(self.get_embeddings(new_list[i][1]))
            new_list[i].append(self.get_embeddings(new_list[i][-2]))

        return new_list