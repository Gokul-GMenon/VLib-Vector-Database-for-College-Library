from sentence_transformers import SentenceTransformer
from pgvector.psycopg2 import register_vector
from django.db import connection
from collections import OrderedDict
import numpy as np

class FindBook:

    def __init__(self):

        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')  # Example model


    def queryToVec(self, query):
        
        return self.model.encode(query)
    
    def searchBook(self, query):


        # Connect to and configure vector database
        register_vector(connection)

        with connection.cursor() as cursor:

            vector = self.queryToVec(query)
            # print('vector - ', vector)

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

            # List of all doc_ids that matches
            doc_id_list = [entry[0] for entry in cursor.fetchall()]
            # print(doc_id_list)

            print('docid list - ',str(tuple(doc_id_list)), '\n\n')
            
            # Looking for the most similar books

            if len(doc_id_list) > 1:
                query = f"""SELECT doc_id, subset.doc_summary_vectors <=> %s as similarity from (
                                                SELECT * from doc_embeddings where doc_id IN {str(tuple(doc_id_list))}) as subset
                                                where subset.doc_summary_vectors <=> %s <0.6
                                                ORDER BY subset.doc_summary_vectors <=> %s"""
            else:
                query = f"""SELECT doc_id, subset.doc_summary_vectors <=> %s as similarity from (
                                                SELECT * from doc_embeddings where doc_id = {str(doc_id_list[0])}) as subset 
                                                where subset.doc_summary_vectors <=> %s <0.6
                                                ORDER BY subset.doc_summary_vectors <=> %s"""
            cursor.execute(query, (vector, vector, vector))
            
            # similarity = [entry[0] for entry in cursor.fetchall()]
            # print('Similarity - ', similarity)
            doc_ids = [entry[0] for entry in cursor.fetchall()]
            print('docids - ',doc_ids, '\n\n')
            doc_ids = list(OrderedDict.fromkeys(doc_ids).keys())

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

            return result