from django.contrib import admin

# Register your models here.
from api.models import Match
from api.models import Player

admin.site.register(Match)
admin.site.register(Player)