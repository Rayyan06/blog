from django.db import models
from markdown2 import Markdown

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=20)
    content = models.FileField(upload_to="articles/%Y/%m/%d")
    published_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    def display_content(self):
        """
        Converts txt or md to HTML
        """
        markdowner = Markdown()
        with open(self.content.path) as fp:
            print(fp)
            if fp.name.endswith('.txt'):
                return fp.read().replace('\n', '<br>')
            elif fp.name.endswith('.md'):
                markdowner = Markdown()
                return markdowner.convert(fp.read())


class Comment(models.Model):
    text = models.CharField(max_length=20)