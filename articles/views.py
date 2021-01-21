from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie



from .models import Article, User, Project, Comment
from .forms import CommentForm
# from .forms import CommentForm
# Create your views here.




class ArticlesListView(ListView):
    model = Article
    template_name = "articles/index.html"
    context_object_name = "articles_list"


class JsonableResponseMixin:
    """
    Mixin to add JSON support to a form.
    Must be used with an object-based FormView (e.g. CreateView)
    """
    def form_invalid(self, form):
        response = super().form_invalid(form)
        if self.request.accepts('text/html'):
            return response
        else:
            return JsonResponse(form.errors, status=400)

    def form_valid(self, form):
        # We make sure to call the parent's form_valid() method because
        # it might do some processing (in the case of CreateView, it will
        # call form.save() for example).
        form.instance.user = self.request.user
        article = Article.objects.get(pk=self.object.pk)
        form.instance.article = article
        response = super().form_valid(form)

        if self.request.accepts('text/html'):
            return response
        else:
            data = {
                'pk': self.object.pk,
            }
            return JsonResponse(data)


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
        context['is_liked'] = self.object.likes.filter(id=self.request.user.id).exists()
        return context

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)











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


@login_required
def like_article(request, pk):
    article = Article.objects.get(pk=pk)
    print(article.get_likes)
    if article.likes.filter(id=request.user.id).exists():
        article.likes.remove(request.user)
    else:
        article.likes.add(request.user)

    print(article.get_likes)

    return JsonResponse({'likes': article.get_likes})


