from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse

from markdown2 import Markdown
from embed_video.fields import EmbedVideoField
from datetime import datetime as dt
from datetime import date


class User(AbstractUser):
    profile_pic = models.ImageField(upload_to="users/profile_pics", blank=True, null=True)


class Project(models.Model):
    name = models.CharField(max_length=40)
    description = models.TextField()

    created_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=40)
    project = models.ForeignKey(Project, blank=True, null=True, related_name="articles", on_delete=models.CASCADE)
    content = models.TextField()
    published_date = models.DateField(auto_now=True)
    likes = models.ManyToManyField(User, related_name="likes", blank=True)
    video = EmbedVideoField(blank=True)



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

    @property
    def get_likes(self):
        return self.likes.count()



# User-interaction related models.

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    upVotes = models.ManyToManyField(User, blank=True, related_name="up_votes")
    downVotes = models.ManyToManyField(User, blank=True, related_name="down_votes")
    text = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey("self", null=True, blank=True, related_name="replies", on_delete=models.SET_NULL)

    @property
    def get_formatted_date(self):
        return self.date.strftime("%b %d, %Y at %-I:%-M %p")

    def __str__(self):
        return self.text

    def get_absolute_url(self):
        return reverse('article', kwargs={'pk': self.article.pk})













