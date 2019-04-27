from django.urls import path
from api import views

urlpatterns = [
    path("matches/", views.MatchesView.as_view()),
    path("matches/create", views.MatchCreateView.as_view()),
    path("matches/<int:pk>", views.MatchDetailView.as_view()),
]