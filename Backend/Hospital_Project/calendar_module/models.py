from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    endDate = models.DateField(blank=True, null=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    color = models.CharField(max_length=20, default="#2563EB")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
