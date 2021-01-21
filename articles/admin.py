from django.contrib import admin
from .models import Article, Comment, Project, User

# Register your models here.

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    filter_horizontal = ("likes",)



admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Project)