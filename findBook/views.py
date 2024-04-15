from rest_framework.response import Response
from rest_framework.decorators import api_view
from pgvector.psycopg2 import register_vector
from django.db import connection
from django.http import JsonResponse, HttpResponse
from findBook.finder import FindBook

@api_view(['POST'])
def searchBook(request):
	
    print("testing here")
    
    if request.method == 'POST':
        print(request.data)
        
        query = request.POST['query']

        search = FindBook()

        bookList = search.searchBook(query)

        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select distinct doc_genre_name from doc_genre""")
            genre_list = [entry[0] for entry in cursor.fetchall()][0]
            cursor.execute("""select distinct doc_type from document""")
            type_of_doc = [entry[0] for entry in cursor.fetchall()][0]

        response = {
            'result': bookList,
            'genre': genre_list,
            'type': type_of_doc
        }

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

        print(request.data)

        book_id = int(request.POST['id'])
        pdfpath = ''
        with connection.cursor() as cursor:
            # Identify the genre ids for the given genre
            cursor.execute("""select doc_path from document 
                           where doc_id = """+str(book_id))


            pdfpath = [entry[0] for entry in cursor.fetchall()][0]
        
        print('\nPath - ', pdfpath)
    
    pdfFile = open(pdfpath, 'rb')

    print("\nBinary - ", pdfFile)
    file_name = pdfpath[pdfpath.rfind('/')+1:]
    print("\n\nFile name - ", file_name)
    response = HttpResponse(pdfFile, content_type = 'application/pdf')
    response['Content-Disposition'] = 'attachment; filename='+file_name  # Optional: Set filename
    return response

