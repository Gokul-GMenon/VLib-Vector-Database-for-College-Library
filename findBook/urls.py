from django.urls import path
from . import views

urlpatterns = [
    path('querySearch', views.searchBook),
    path('getAllBooks', views.getAllBooks),
    path('getTenBooks', views.getTenBooks),
    path('getPDF', views.getPDF),
    path('getSummary', views.getSummary),
]
