from rest_framework.response import Response
from rest_framework.decorators import api_view
from findBook.finder import FindBook

@api_view(['POST'])
def searchBook(request):
    
    if request.method == 'POST':
        
        query = request.POST['query']

        search = FindBook()

        vals = search.searchBook(query)

        return Response(vals)