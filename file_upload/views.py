from django.shortcuts import render, redirect
from .forms import FileForm
from .models import File

def upload_file(request):
    if request.method == 'POST':
        form = FileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            obj = File.objects.all().last()
            # file_path = obj.objec
            print('file name - ',obj.pdf.name)
            return redirect('success')  # Redirect to a success page after successful upload
    else:
        form = FileForm()
    return render(request, 'upload.html', {'form': form})


def success(request):
    name = File.objects.all().last().pdf.name
    print(name)
    import os
    import shutil

    # Get the paths of the source file and the destination folder.
    source_file_path = 'media\\' + name
    name = name[name.rfind('/')+1:]
    # name = '/file_upload/static/pdfs/'+name
    dir = 'file_upload\static\pdfs\\' + name
    print('\n\n',name)
    
    # Copy the file.
    shutil.copy(source_file_path, dir)
    # name = os.path.abspath('media/' + name)

    return render(request,'success.html', {'file': dir[dir.find('\\')+1:]})