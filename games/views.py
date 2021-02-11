from django.shortcuts import render
from django.views.generic import ListView, DetailView

from .models import Game

# Create your views here.

class GamesListView(ListView):
    model = Game
    template_name = "games/index.html"
    context_object_name = "games"

class GameView(DetailView):
    model = Game
    context_object_name = "game"
    template_name = "games/game.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['game_js'] = f"js/snake/frontend/{self.get_object().name}.js"
        return context


