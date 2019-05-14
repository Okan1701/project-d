# Create your views here.
from rest_framework import generics

from api.models import Match
from api.models import Player
from api.serializers import MatchSerializer
from api.serializers import PlayerSerializer


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

