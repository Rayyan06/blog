from django.urls import path
from .views import GamesListView, GameView

app_name = "games"

urlpatterns = [
    path('', GamesListView.as_view(), name="index"),
    path('game/<int:pk>', GameView.as_view(), name="game")
]