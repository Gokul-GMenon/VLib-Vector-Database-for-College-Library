from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
from django.db import connection
import json, os

class Manager:

    def __init__(self):

        # cache maximum size
        # self.threshold = 10
        pass

    # To increment the no of searches encountered for a particular cache entry
    def update_search_count(self):

        with connection.cursor() as cursor:
            # Update the number of cache access for that cache entry
            cursor.execute(f"""UPDATE doc_search_cache SET no_of_encountered_search = no_of_encountered_search + 1""")

    
    # To update the access count for the cache entry
    def update_access_count(self, cache_id):

        with connection.cursor() as cursor:
            # Update the number of cache access for that cache entry
            cursor.execute(f"""UPDATE doc_search_cache SET no_of_cache_access = no_of_cache_access + 1 where id = {str(cache_id)}""")

    # To add to new entry/replacement to cache incase of absence
    def add_remove_cache(self, query, json_to_save, threshold):

        with connection.cursor() as cursor:
            # Update the number of cache access for that cache entry
            cursor.execute(f"""select COUNT(*) from doc_search_cache""")
        
            # Collect the count
            count_of_entries = cursor.fetchone()[0]

            if count_of_entries == None:
                count_of_entries = 0

        cache_entry_path = f"cache_file/cache_entry_{count_of_entries+1}.json"
        with open(cache_entry_path, 'w') as f:
             json_data = json.dumps(json_to_save)
             f.write(json_data)

        # Add if no.of.entries < threshold (cache maximum size)
        if count_of_entries < threshold:
            print("\nCache not full...adding to cache")
            with connection.cursor() as cursor:
                data_list = [[count_of_entries+1, query[0].tolist(), cache_entry_path, 0, 0]]
                execute_values(cursor, "INSERT INTO doc_search_cache (id, query, path, no_of_cache_access, no_of_encountered_search) values %s", data_list)

        # Else use algo to add effectively
        else:

            # Calculating minimum eligibility for replacement based on cache size
            threshold_search = int(0.25*threshold)

            with connection.cursor() as cursor:

                # Retrieving cache data
                cursor.execute("""select id, no_of_cache_access, no_of_encountered_search, path from doc_search_cache order by added_at""")

                lowest_access = { 'index': -1, 'value': -1, 'path': ''}

                results = [entry for entry in cursor.fetchall()]

                # Searching through cache for replacement
                for index, result in enumerate(results):

                    # For entries that are eligible for replacement
                    if result[2] >= threshold_search:
                        
                        # If updated
                        if lowest_access['value'] != -1:
                            
                            # If access is even lower
                            if lowest_access['value'] > result[1]:

                                lowest_access['value'] = result[1]
                                lowest_access['index'] = index
                                lowest_access['path'] = result[3]

                        # if only initialized
                        else:

                            lowest_access['value'] = result[1]
                            lowest_access['index'] = index
                            lowest_access['path'] = result[3]
            
                # Removing entry from cache
                # print(lowest_access)
                removal_id = results[lowest_access['index']][0]
                cursor.execute(f"""delete from doc_search_cache where id = {removal_id}""")
                os.remove(lowest_access['path'])
                print(f"\n{lowest_access['index']} removed from cache")

                cache_entry_path = f"cache_file/cache_entry_{removal_id}.json"
                with open(cache_entry_path, 'w') as f:
                    json_data = json.dumps(json_to_save)
                    f.write(json_data)


                data_list = [[removal_id, query[0].tolist(), cache_entry_path, 0, 0]]
                execute_values(cursor, "INSERT INTO doc_search_cache (id, query, path, no_of_cache_access, no_of_encountered_search) values %s", data_list)

            # Adding the new cache entry
            # cursor.execute(f"""INSERT INTO doc_search_cache (id, query, path, no_of_cache_access, no_of_encountered_search) values 
            #                 ({new_entry_id}, {query.tolist()}, {path}, 0, 0)""")
            print(f"cache entry - {removal_id} added to the cache")

    # To check presence of query in the cache and access info
    def check_cache(self, query_vector):

        # Check for presence of query with over 80% similarity
        register_vector(connection)

        with connection.cursor() as cursor:

            # Update the total encountered search
            self.update_search_count()

            # Entry with 90% similarity should be present in the cache
            cursor.execute("""SELECT id, path from 
                           doc_search_cache where query <=> %s <0.10 ORDER BY query <=> %s LIMIT 1""", (query_vector, query_vector))

            result = cursor.fetchone()

            # If not found in cache
            if result == None:
                # Collect actual output and add to cache
                print("\nCache miss!!")
                return -1

            else:

                print("\nCache hit!!")
                cache_id = result[0]

                # Update the cache hit count
                self.update_access_count(cache_id)

                # Read the search result as JSON
                with open(result[1]) as f:
                    data = f.read()
                
                data = json.loads(data)

                return data
    
    def empty_cache(self):

        with connection.cursor() as cursor:
            cursor.execute("delete from doc_search_cache")