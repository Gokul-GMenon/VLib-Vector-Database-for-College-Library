from django import forms

class PdfUploadForm(forms.ModelForm):
    class Meta:
        fields = ['title', 'pdf_file']
