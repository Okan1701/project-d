from rest_framework.serializers import ModelSerializer

from api.models import Match
from api.models import Player


class MatchSerializer(ModelSerializer):
    class Meta:
        model = Match
        fields = (
            "id",
            "owner",
            "title",
            "contract_address",
            "start_date",
            "active",
            "sport_event_id",
            "status_code",
            "winning_team",
            "network_name"
        )


class PlayerSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = ("address", "name", "wins", "game_count", "earnings")
