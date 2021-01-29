from rest_framework import serializers
from .models import Comment, Article, User

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Comment
        fields = ['id', 'text', 'user', 'article']




class ArticleSerializer(serializers.ModelSerializer):
    likes = serializers.PrimaryKeyRelatedField(many=True)
    class Meta:
        model = Article
        fields = ['id', 'likes']

class LikeSerializer(serializers.ModelSerializer):
    articles_liked = ArticleSerializer(many=True)
    class Meta:
        model = User
        fields = ['id', 'articles_liked']
