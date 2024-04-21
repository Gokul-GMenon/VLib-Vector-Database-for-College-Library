from pgvector.psycopg2 import register_vector
from django.db import connection
from psycopg2.extras import execute_values
from entry_to_vectors import Vectorize
import pandas as pd
import numpy as np
import psycopg2

class NewBook():

    def __init__(self):
        pass

    
    def addBook(self, data_upload):
    
        # psql connection string
        connection_string  = "postgresql://postgres:gokul@localhost:5432/postgres"
    
        # Get embeddings
        vectorize = Vectorize()
        new_list = vectorize.token_limited_data(data_upload)
        new_list = vectorize.add_embeddings(new_list)

        # """Testing code"""
        # # Get embeddings
        # vectorize = Vectorize()
        # new_list_full_transcript = vectorize.token_limited_data_testing(data_upload)
        # new_list_full_transcript = vectorize.add_embeddings(new_list_full_transcript)



        # Create a new pandas dataframe with the new list where the column names are the same as the original dataframe w   ith an additional column named "embeddings"
        df_new = pd.DataFrame(new_list, columns=['name', 'summary', 'author', 'year', 'type', 'path', 'token_len', 'genre', 'embeddings', 'genre_embeddings'])

        row = df_new.iloc[0].to_dict()
        

        """
        Insertion into document table
        """
        
        # Creating the connection and inserting into the database
        with connection.cursor() as cursor:

            # Identify the next id
            cursor.execute("SELECT MAX(doc_id) from document")
            result = cursor.fetchall()
            
            if(result[0][0] != None):
                
                id = int(result[0][0])+1

            else:

                # Empty table
                id=0

            data_list = [[row['name'], id, row['author'], str(row['year']), row['type'], data_upload['content'], row['path']]]
                        #  int(row['token_len']), np.array(row['embeddings'])]
        
            execute_values(cursor, "INSERT INTO document (doc_name, doc_id, doc_author, doc_publish_year, doc_type, doc_summary, doc_path) VALUES %s", data_list)


            # """
            # Testing code
            # """
            # data_list = []
            # for data in new_list_full_transcript:
            #     data_list.append([row['name'], data[-2].tolist()])
            
            # # data_list = [[row['name'], id, row['author'], str(row['year']), row['type'], data_upload['content'], row['path']]]
            # execute_values(cursor, "INSERT INTO document_testing (doc_name, doc_vector) VALUES %s", data_list)
            # print("\nadded to doc testing\n\n")
            """
            Insert vectors
            """
            print(len(new_list))
            data_list = []
            for data in new_list:
                data_list.append([id, data[-2].tolist()])
            execute_values(cursor, "INSERT INTO doc_embeddings (doc_id, doc_summary_vectors) VALUES %s", data_list)
            print("added")



            """
            Check if genre already present. If not add genre
            """

            query = """SELECT doc_genre_id from doc_genre where doc_genre_name = %s"""

            cursor.execute(query, [row['genre']])

            genre_id = cursor.fetchone()
            
            """
            Not present -> add new genre
            """
            if not genre_id:

                cursor.execute("SELECT MAX(doc_genre_id) from doc_genre")
                result = cursor.fetchall()
                
                if(result[0][0] != None):
                    
                    genre_id = int(result[0][0])+1

                else:

                    # Empty table
                    genre_id=0

                data_list = [[genre_id, row['genre'] , row['genre_embeddings'].tolist()]]

                execute_values(cursor, "INSERT INTO doc_genre (doc_genre_id, doc_genre_name, doc_genre_vector) VALUES %s", data_list)
                print("Added to doc_genre")

        
        # Creating the connection and inserting into the database
        with connection.cursor() as cursor:
            data_list = [[id, genre_id]]

            execute_values(cursor, "INSERT INTO id_genre (doc_id, doc_genre_id) VALUES %s", data_list)
            print("Added to id_genre")
