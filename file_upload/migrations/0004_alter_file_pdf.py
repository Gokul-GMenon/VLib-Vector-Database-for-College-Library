# Generated by Django 4.2.2 on 2023-06-25 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file_upload', '0003_alter_file_pdf'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='pdf',
            field=models.FileField(upload_to='pdfs/'),
        ),
    ]
