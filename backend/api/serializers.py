from rest_framework.serializers import ModelSerializer

from api.models import Match
from api.models import Player


class MatchSerializer(ModelSerializer):
    class Meta:
        model = Match
        fields = ("id", "title", "contract_address", "start_date", "end_date", "active")

class PlayerSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = ("address", "name", "wins", "losses", "earnings")
