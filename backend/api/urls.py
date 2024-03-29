from django.urls import path
from api import views
from api.models import Match
from api.watcher import MatchWatcherService

urlpatterns = [
    # Start match watcher
    path("startservice", views.start_watcher),
    path("endservice", views.end_watcher),

    # Matches
    path("matches/", views.MatchesView.as_view()),
    path("matches/create", views.MatchCreateView.as_view()),
    path("matches/<int:pk>", views.MatchDetailView.as_view()),

    # Active Matches
    path("matches/active", views.ActiveMatchesView.as_view()),

    # Inactive matches
    path("matches/archive", views.InactiveMatchesView.as_view()),

    # Players
    path("players/", views.PlayersView.as_view()),
    path("players/create", views.PlayerCreateView.as_view()),
    path("players/<str:pk>", views.PlayerDetailView.as_view()),
]
