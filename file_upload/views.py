from django.shortcuts import render, redirect
from .forms import FileForm
from .models import File
from pdf_to_text import convert
import os
import shutil

new_pdf = ''
summary = ''

def upload_file(request):
    global new_pdf, summary
    if request.method == 'POST':
        form = FileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            obj = File.objects.all().last()
            # file_path = obj.objec
            file_name = obj.pdf.name
            file_name = file_name[file_name.rfind('/')+1:]
            print('\n', file_name, '\n')
            summary, new_pdf = convert(file_name)
            print('Summary - ', convert(file_name))
            return redirect('success')  # Redirect to a success page after successful upload
    else:
        form = FileForm()
    return render(request, 'upload.html', {'form': form})


def success(request):
    global new_pdf
    print('\n', new_pdf, '\n')
    name = new_pdf[new_pdf.rfind('\\')+1:]
    # print(name)

    # Get the paths of the source file and the destination folder.
    # source_file_path = 'media\\' + name
    # name = name[name.rfind('/')+1:]
    # name = '/file_upload/static/pdfs/'+name
    dir = 'file_upload\static\pdfs\\' + name
    # print('\n\n',name)
    
    # Copy the file.
    shutil.copy(new_pdf, dir)
    fin_summary = ''
    for summ in summary:
        fin_summary += summ
        fin_summary += '\n'
        
    print('\n',fin_summary, '\n')
    # name = os.path.abspath('media/' + name)

    return render(request,'success.html', {'file': dir[dir.find('\\')+1:], 'summary': fin_summary})