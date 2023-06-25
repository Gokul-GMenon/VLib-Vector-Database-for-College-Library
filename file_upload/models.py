from django.db import models

# Create your models here.

class File(models.Model):
    # title = models.CharField(max_length=100)
    pdf=models.FileField(upload_to='pdfs/')
    # uploaded_at=models.DateTimeField(auto_now_add=True)