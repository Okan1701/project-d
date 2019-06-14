from django.db import models


# Create your models here.

class Match(models.Model):
    owner = models.CharField(max_length=256, default="")
    title = models.CharField(max_length=256)
    contract_address = models.CharField(max_length=256)
    start_date = models.DateField()
    active = models.BooleanField(default=True)
    sport_event_id = models.IntegerField(default=-1)
    status_code = models.IntegerField(default=0)
    winning_team = models.IntegerField(default=-1)
    network_name = models.CharField(max_length=256, default="unknown")

    def __str__(self):
        return self.title + " @ " + self.contract_address

    class Meta:
        verbose_name = 'Match'
        verbose_name_plural = 'Matches'


class Player(models.Model):
    address = models.CharField(max_length=256, primary_key=True)
    name = models.CharField(max_length=40)
    wins = models.IntegerField()
    game_count = models.IntegerField()
    earnings = models.DecimalField(max_digits=128, decimal_places=0)

    def __str__(self):
        return self.name
