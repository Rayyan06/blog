from django.shortcuts import render, redirect, reverse
from django.views.generic import ListView, DetailView, FormView
from django.views.generic.edit import CreateView
from django.views.generic.detail import SingleObjectMixin
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseForbidden
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Article, User, Project, Comment
from .forms import CommentForm
# from .forms import CommentForm
# Create your views here.




class ArticlesListView(ListView):
    model = Article
    template_name = "articles/index.html"
    context_object_name = "articles_list"



class CommentCreate(CreateView):
    model = Comment
    fields = ['text']

    def form_valid(self, form):
        form.instance.user = self.request.user
        article = Article.objects.get(pk=self.kwargs['pk'])
        form.instance.article = article
        return super().form_valid(form)



    


class ArticleDetail(DetailView):
    model = Article
    context_object_name = "article"
    template_name = "articles/article.html"

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context['form'] = CommentForm()
        return context


    

    
    

    



    
class ProjectsListView(ListView):
    model = Project
    template_name = "articles/projects.html"
    context_object_name = "projects"
    

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "articles/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "articles/login.html")


def logout_view(request):
    logout(request)
    return redirect("home")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "articles/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "articles/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect("home")
    else:
        return render(request, "articles/register.html")
