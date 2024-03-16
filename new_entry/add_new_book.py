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

        # Create a new pandas dataframe with the new list where the column names are the same as the original dataframe w   ith an additional column named "embeddings"
        df_new = pd.DataFrame(new_list, columns=['name', 'summary', 'author', 'year', 'type', 'token_len', 'genre', 'embeddings', 'genre_embeddings'])

        row = df_new.iloc[0].to_dict()
        

        """
        Insertion into document table
        """
        
        conn = psycopg2.connect(connection_string)
        register_vector(conn)

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

            data_list = [[row['name'], id, row['author'], str(row['year']), row['type'], data_upload['content']]]
                        #  int(row['token_len']), np.array(row['embeddings'])]
        
            execute_values(cursor, "INSERT INTO document (doc_name, doc_id, doc_author, doc_publish_year, doc_type, doc_summary) VALUES %s", data_list)


            """
            Insert vectors
            """
            print(len(new_list))
            data_list = []
            for data in new_list:
                data_list.append([id, np.array(data[-2])])

            execute_values(cursor, "INSERT INTO doc_embeddings (doc_id, doc_summary_vectors) VALUES %s", data_list)

            """
            Insert Genre
            """

            data_list = [[id, row['genre'] , np.array(row['genre_embeddings'])]]

            execute_values(cursor, "INSERT INTO doc_genre (doc_genre_id, doc_genre_name, doc_genre_vector) VALUES %s", data_list)

            data_list = [[id, id]]

            execute_values(cursor, "INSERT INTO id_genre (doc_id, doc_genre_id) VALUES %s", data_list)

        conn.close()