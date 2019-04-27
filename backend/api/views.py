# Create your views here.
from rest_framework import generics

from api.models import Match
from api.serializers import MatchSerializer


class MatchesView(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class MatchCreateView(generics.CreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class MatchDetailView(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
