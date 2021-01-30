from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie


from rest_framework import status
from rest_framework import generics

from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CommentSerializer, ArticleSerializer, LikeSerializer

from .models import Article, User, Project, Comment
from .forms import CommentForm

from datetime import datetime
# from .forms import CommentForm
# Create your views here.




class ArticlesListView(ListView):
    model = Article
    template_name = "articles/index.html"
    context_object_name = "articles_list"





class CommentList(generics.ListCreateAPIView):
    """
    List all comments for a specified article, or create
    a new comment
    """

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    def get_queryset(self):
        """
        We only want the comments for the specified article, so we have to
        override this lol
        """

        article_id = self.kwargs['article_id']
        article = Article.objects.get(id=article_id)
        if self.request.user.is_authenticated:
            user_comments = Comment.objects.filter(article=article).filter(user=self.request.user).order_by('-date')
            rest_of_comments = Comment.objects.filter(article=article).exclude(user=self.request.user).order_by('-date')
            return user_comments | rest_of_comments
        else:
            return Comment.objects.filter(article=article).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, date=datetime.now())






class ArticleDetail(DetailView):
    model = Article
    context_object_name = "article"
    template_name = "articles/article.html"

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context['form'] = CommentForm()
        return context

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)











class ProjectsListView(ListView):
    model = Project
    template_name = "articles/projects.html"
    context_object_name = "projects"


@login_required
def profile_view(request):
    return render(request, "articles/profile.html")

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

@api_view(['GET'])
def get_article_likes(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except article.DoesNotExist:
        return Response({'Error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'likes': article.get_likes}, status=status.HTTP_200_OK)



@login_required
@api_view(['GET', 'PUT'])
def like_article(request, pk):
    """Like an article"""
    try:
        article = Article.objects.get(pk=pk)
    except article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method=='GET':
        """ Returns whether an article is liked by the user """

        return Response({'liked': article.likes.filter(id=request.user.id).exists()}, status=status.HTTP_200_OK)

    elif request.method=='PUT':
        try:
            liked = article.likes.filter(id=request.user.id).exists()
            if liked:
                article.likes.remove(request.user)
            else:
                article.likes.add(request.user)
            return Response({'liked': liked}, status=status.HTTP_200_OK)
        except:

            return Response(status=status.HTTP_400_BAD_REQUEST)


