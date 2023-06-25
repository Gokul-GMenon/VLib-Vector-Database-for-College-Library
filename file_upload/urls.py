from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [

    path('', views.upload_file, name='upload'),
    path('success', views.success, name='success'),
]
urlpatterns += staticfiles_urlpatterns()