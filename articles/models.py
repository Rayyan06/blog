from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse

from markdown2 import Markdown
from datetime import datetime as dt
from datetime import date


class User(AbstractUser):
    pass


class Project(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=200)

    created_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=20)
    project = models.ForeignKey(Project, blank=True, null=True, related_name="articles", on_delete=models.CASCADE)
    content = models.TextField()
    published_date = models.DateField(auto_now=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    
    # Returns age of article in minutes
    def get_age(self):
       
        difference = date.today()-self.published_date

        if difference.days == 0:
            return 'today'
        elif difference.days == 1:
            return 'yesterday'
        else:
            return f'{difference.days} days ago'
        
    

    def display_content(self):
        """
        Converts md to HTML
        """
        markdowner = Markdown()
        return markdowner.convert(self.content)
    



class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    text = models.CharField(max_length=20)
    
    def __str__(self):
        return self.text

    def get_absolute_url(self):
        return reverse('article', kwargs={'pk': self.article.pk})
    
