from findBook.queryToAnswer import QuerytoAnswer
from rest_framework.response import Response
from cache_manage import Manager
from rest_framework.decorators import api_view
from pgvector.psycopg2 import register_vector
from django.db import connection
from django.http import JsonResponse, HttpResponse
from findBook.finder import FindBook
import PyPDF2, json, numpy as np

@api_view(['POST'])
def searchBook(request):
	
    
    if request.method == 'POST':
        print(request.data)
        
        query = request.POST['query']

        search = FindBook()

        json_flag, query_vector, bookList, keywords_query, flag_for_size_check = search.searchBook(query)
        # Return cache entry incase of cache hit
        if json_flag == True:  
            return JsonResponse(bookList)

        if flag_for_size_check == True:
            #  Swapping books in result if the size of the book in second result is less than 60% of the first book
             
            if len((PyPDF2.PdfReader(open(bookList[1][-2], 'rb'))).pages) < 0.60*int(len((PyPDF2.PdfReader(open(bookList[0][-2], 'rb'))).pages)):
                print('\nSwapping results!!!\n')
                temp = bookList[0]
                bookList[0] = bookList[1]
                bookList[1] = temp
            else:
                print('\nResults not eligible for swap!!!\n')

        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select distinct doc_genre_name from doc_genre""")
            genre_list = [entry[0] for entry in cursor.fetchall()]
            cursor.execute("""select distinct doc_type from document""")
            type_of_doc = [entry[0] for entry in cursor.fetchall()][0]

        response = {
            'result': bookList,
            'genre': genre_list,
            'type': type_of_doc,
            'keywords_query': keywords_query,
            'query': query
        }
        
        # Add to temp cache

        with connection.cursor() as cursor:

            # Creating json of result
            temp_cache_json_store = "cache_file/cache_entry_temporary.json"
            with open(temp_cache_json_store, 'w') as f:
                json_data = json.dumps(response)
                f.write(json_data)

            # Writing to temporary cache to be written to main cache after generation is done
            cursor.execute(f"INSERT into cache_adder values %s", (query_vector,))


        return JsonResponse(response)

@api_view(['GET'])
def getAllBooks(request):

        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select doc_id, doc_name, doc_author, doc_publish_year, 
                           doc_type, doc_path from document ORDER BY doc_name""")


            booklist = [entry for entry in cursor.fetchall()]
        
        response = {
             'result': booklist
        }

        return JsonResponse(response)

            

@api_view(['GET'])
def getTenBooks(request):
        
        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select doc_id, doc_name, doc_author, doc_publish_year, 
                           doc_type, doc_path from document ORDER BY doc_id DESC LIMIT 10""")


            booklist = [entry for entry in cursor.fetchall()]
        
        response = {
             'result': booklist
        }

        return JsonResponse(response)

@api_view(['POST'])
def getPDF(request):
     
    if request.method == 'POST':

        # print(request.data)

        book_id = int(request.POST['id'])
        pdfpath = ''
        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select doc_path from document 
                           where doc_id = """+str(book_id))


            pdfpath = [entry[0] for entry in cursor.fetchall()][0]
        
        print('\nPath - ', pdfpath)
    
    pdfFile = open(pdfpath, 'rb')

    # print("\nBinary - ", pdfFile)
    file_name = pdfpath[pdfpath.rfind('/')+1:]
    # print("\n\nFile name - ", file_name)
    response = HttpResponse(pdfFile, content_type = 'application/pdf')
    response['Content-Disposition'] = 'attachment; filename='+file_name  # Optional: Set filename
    return response

@api_view(['POST'])
def getSummary(request):
     
     if request.method == 'POST':
          

        query = request.POST['query']
        book_id = int(request.POST['id'])
        keywords_query = request.POST['keywords_query']
        
        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select doc_path from document 
                           where doc_id = """+str(book_id))


            pdfpath = [entry[0] for entry in cursor.fetchall()][0]
        dir = pdfpath[:pdfpath.rfind('/')]
        filename = pdfpath[pdfpath.rfind('/')+1:]

        q2a = QuerytoAnswer()
        best_pages, answer = q2a.generate_answer(dir, filename, keywords_query, query)


        response = {
             'pages': best_pages,
             'answer': answer
        }

        with connection.cursor() as cursor:
            
            # Checking temp cache is empty
            cursor.execute("select count(*) from cache_adder");
            no_of_entries = cursor.fetchone()[0]

            if no_of_entries != 0:

                # If not add the entry into permanent cache and make it empty
                cursor.execute("select * from cache_adder");
                query_vector = (np.array(cursor.fetchone()[0]),)
                print('\n\nType of query - ', type(query_vector))
                temp_cache_json_store = "cache_file/cache_entry_temporary.json"
    
                with open(temp_cache_json_store, "r") as f:
                # Load the JSON data from the file
                    data = json.load(f)
                    data['answer'] = answer
    
                cache = Manager()
                # print(response)
                cache.add_remove_cache(query_vector, data)

                # Remove from temporary cache
                cursor.execute("delete from cache_adder")

        # If the 
        return JsonResponse(response)