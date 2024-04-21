from cache_manage import Manager
from django.shortcuts import render
from django.db import connection
from rest_framework.response import Response
from rest_framework.decorators import api_view
from pdf_trimmer import PDFtoText
from new_entry.add_new_book import NewBook
from rest_framework.views import APIView
import numpy as npx
import os
import json
from api import settings

# Create your views here.

def save_uploaded_file(path,f):
    with open(path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    # Get Data
@api_view(['POST'])
def addBook(request):   
    # def post(self, request):


    if request.method == 'POST':

        # Empty cache before updating the database
        cache_manager = Manager()
        cache_manager.empty_cache()


        pdf2txt = PDFtoText();
        data_upload = {}
        data_upload['title'] = request.POST['title']


        with connection.cursor() as cursor:
            query = "SELECT COUNT(*) from document where doc_name = %s"
            cursor.execute(query, [data_upload['title']])
            count = cursor.fetchall()
            if count[0][0] != 0:
                return Response(data_upload['title'] + " is already present!!")
            
        data_upload['author'] = request.POST['author']
        data_upload['year'] = request.POST['year']
        data_upload['type'] = request.POST['type']
        data_upload['genre'] = request.POST['genre']
        
        # Root directory where pdf is saved
        path = os.path.join(settings.MEDIA_ROOT, "uploads")
        os.makedirs(path, exist_ok=True)
        
        file_name = request.POST['title']+'.pdf'
        save_dir = os.path.join(path,file_name)
        data_upload['path'] = save_dir
        
        print('\nNew book title - ',data_upload['title'], '\nPath - ', save_dir)
        if not os.path.exists(save_dir):
            # if data_upload['title'] == 'DATABASE MANAGEMENT SYSTEMS':
            save_uploaded_file(save_dir, request.FILES['file'])
        print(request.FILES['file'])
        
        # Trimming pdf and using ocr to exract teh remaining content
        data_upload['content'], _ = pdf2txt.convert(file_name=file_name, path=path, data=data_upload)
        newBookEntry = NewBook()
        newBookEntry.addBook(data_upload)#, final_full_transcript)

        return Response(data_upload['title']+'  ADDED')