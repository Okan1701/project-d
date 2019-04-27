from rest_framework.serializers import ModelSerializer

from api.models import Match


class MatchSerializer(ModelSerializer):
    class Meta:
        model = Match
        fields = ("id", "title", "contract_address", "start_date", "end_date")
