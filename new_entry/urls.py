from django.urls import path
from . import views

urlpatterns = [
    # path('', views.getData),
    path('addBook', views.addBook),
    # path('addBook', views.RequestCenter.as_view()),
    # path('post/', views.postData),
]