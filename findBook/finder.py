from sentence_transformers import SentenceTransformer
from pgvector.psycopg2 import register_vector
from django.db import connection
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

            print('docid list - ',doc_id_list, '\n\n')
            
            # Looking for the most similar books

            if len(doc_id_list) > 1:
                query = f"""SELECT DISTINCT doc_id from (SELECT doc_id from (
                                                
                                                                SELECT * from doc_embeddings where doc_id IN {str(tuple(doc_id_list))}) as subset 
                                                    ORDER BY subset.doc_summary_vectors <-> %s LIMIT 3)"""
            else:
                query = f"""SELECT DISTINCT doc_id from (SELECT doc_id from (
                                                
                                                                SELECT * from doc_embeddings where doc_id = {str(doc_id_list[0])}) as subset 
                                                    ORDER BY subset.doc_summary_vectors <-> %s LIMIT 3)"""
            
            cursor.execute(query, (vector,))

            doc_ids = [entry[0] for entry in cursor.fetchall()]

            # Fetching book data
            print('docids - ',doc_ids, '\n\n')
            if len(doc_ids) > 1:
                cursor.execute("""select doc_name, doc_author, doc_publish_year, doc_type, doc_path from document where doc_id in """ + str(tuple(doc_ids)))
            else:
                cursor.execute("""select doc_name, doc_author, doc_publish_year, doc_type, doc_path from document where doc_id = """ + str(doc_ids[0]))

            book_details = [entry for entry in cursor.fetchall()]

            return book_details
        
        return 0