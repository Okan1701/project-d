from django.db import models


# Create your models here.

class Match(models.Model):
    title = models.CharField(max_length=40)
    contract_address = models.CharField(max_length=256)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.title + " @ " + self.contract_address

    class Meta:
        verbose_name = 'Match'
        verbose_name_plural = 'Matches'