from django.urls import path
from .views import ArticlesListView

urlpatterns = [
    path('', ArticlesListView.as_view(), name="home")
]