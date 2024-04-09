from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from findBook.finder import FindBook

@api_view(['GET'])
def hello(request):
    return Response("Working!")

@api_view(['POST'])
def searchBook(request):
	
    print("testing here")
    
    if request.method == 'POST':
        print("Hi\n\n")
        print(request.data)
        
        query = request.POST['query']

        search = FindBook()

        bookList = search.searchBook(query)

        response = {
            'result': bookList
        }

        print(response)

        return JsonResponse(response)
