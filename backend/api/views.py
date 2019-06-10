# Create your views here.
from django.http import HttpResponse
from rest_framework import generics

from api.models import Match
from api.models import Player
from api.serializers import MatchSerializer
from api.serializers import PlayerSerializer
from api import apps
from api.watcher import MatchWatcherService


class MatchesView(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class ActiveMatchesView(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    def get_queryset(self):
        return Match.objects.filter(active=True).values()


class InactiveMatchesView(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    def get_queryset(self):
        return Match.objects.filter(active=False).values()


class MatchCreateView(generics.CreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class MatchDetailView(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class PlayersView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class PlayerCreateView(generics.CreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class PlayerDetailView(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


def start_watcher(request):
    if apps.MATCH_WATCHER_STARTED:
        return HttpResponse("service already started")

    apps.MATCH_WATCHER_STARTED = True
    apps.MATCH_WATCHER_SERVICE = MatchWatcherService(Match)
    apps.MATCH_WATCHER_SERVICE.run()
    return HttpResponse("service started")

def end_watcher(request):
    apps.MATCH_WATCHER_STARTED = False
    apps.MATCH_WATCHER_SERVICE.terminate_loop()
    del apps.MATCH_WATCHER_SERVICE
    return HttpResponse("service ended")
