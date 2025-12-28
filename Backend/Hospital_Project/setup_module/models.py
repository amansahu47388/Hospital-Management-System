from django.db import models

# Create your models here.
class Bed(models.Model):
    BED_STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
    ]

    bed_name = models.CharField(max_length=50, unique=True)
    bed_type = models.CharField(max_length=50, default='Normal')
    bed_group = models.CharField(max_length=50, default='General')
    status = models.CharField(max_length=10, choices=BED_STATUS_CHOICES, default='available')
    floor = models.CharField(max_length=50 , blank=True, null=True)

    def __str__(self):
        return self.bed_name
    

class Symptom(models.Model):
    symptom_title = models.CharField(max_length=100, unique=True)
    symptom_type = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.symptom_title
    


class HospitalCharges(models.Model):
    charge_name = models.CharField(max_length=100, unique=True)
    charge_category = models.CharField(max_length=100)
    charge_type = models.CharField(max_length=100)
    charge_amount = models.DecimalField(max_digits=10, decimal_places=2)
    charge_description = models.TextField(blank=True, null=True)
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    unit = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.charge_name} - {self.charge_amount}"
    

    