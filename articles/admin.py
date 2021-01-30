from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from embed_video.admin import AdminVideoMixin
from .models import Article, Comment, Project, User

# Register your models here.

@admin.register(Article)
class ArticleAdmin(AdminVideoMixin, admin.ModelAdmin):
    filter_horizontal = ("likes",)


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,  # original form fieldsets, expanded
        (                      # new fieldset added on to the bottom
            'Profile Picture',  # group heading of your choice; set to None for a blank space instead of a header
            {
                'fields': (
                    'profile_pic',
                ),
            },
        ),
    )


class CommentAdmin(admin.ModelAdmin):
    list_display = ('text', 'article', 'user', 'date')


admin.site.register(User, CustomUserAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Project)