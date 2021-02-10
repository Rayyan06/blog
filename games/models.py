from django.db import models

# Create your models here.


class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    created_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name
