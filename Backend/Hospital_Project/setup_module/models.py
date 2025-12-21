from django.db import models

# Create your models here.
class Bad(models.Model):
    BAD_STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
    ]
 
    bad_name = models.CharField(max_length=50, unique=True)
    bad_type = models.CharField(max_length=50, default='Normal')
    bad_group = models.CharField(max_length=50, default='General')
    status = models.CharField(max_length=10, choices=BAD_STATUS_CHOICES, default='available')
    floor = models.CharField(max_length=50 , blank=True, null=True)


    def __str__(self):
        return self.bad_name