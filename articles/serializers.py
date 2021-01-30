from rest_framework import serializers
from .models import Comment, Article, User

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    date = serializers.DateTimeField(format="%b %d, %Y at %-I:%M %p", required=False)

    class Meta:
        model = Comment
        fields = ['id', 'text', 'user', 'article', 'date']




class ArticleSerializer(serializers.ModelSerializer):
    likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Article
        fields = ['id', 'likes']

class LikeSerializer(serializers.ModelSerializer):
    articles_liked = ArticleSerializer(many=True)
    class Meta:
        model = User
        fields = ['id', 'articles_liked']
