from django.shortcuts import render
from django.views.generic import ListView

from .models import Article
# Create your views here.

class ArticlesListView(ListView):
    model = Article
    template_name = "articles/index.html"
    context_object_name = "articles_list"

