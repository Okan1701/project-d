from django.db import models


# Create your models here.

class Match(models.Model):
    title = models.CharField(max_length=40)
    contract_address = models.CharField(max_length=256)
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title + " @ " + self.contract_address

    class Meta:
        verbose_name = 'Match'
        verbose_name_plural = 'Matches'


class Player(models.Model):
    address = models.CharField(max_length=256, primary_key=True)
    name = models.CharField(max_length=40)
    wins = models.IntegerField()
    losses = models.IntegerField()
    earnings = models.IntegerField()

    def __str__(self):
        return self.name
