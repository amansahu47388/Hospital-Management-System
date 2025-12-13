from django.db import models
from users.models import User
from django.utils import timezone
import uuid


class Patient(models.Model):
    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other")
    )

    MATERIAL_STATUS_CHOICES = (
        ("single", "Single"),
        ("married", "Married"),
        ("divorced", "Divorced"),
        ("widowed", "Widowed")
    )

    BLOOD_GROUP_CHOICES = (
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
        ("O+", "O+"),
        ("O-", "O-"),
    )
    TPA_CHOICES = (
        ("heath life insurance", "Heath Life Insurance"),
        ("star heath insurance", "Star Heath Insurance"),
        ("IDBI federal", "IDBI Federal"),
        ("cghs", "CGHS"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    dob = models.DateField()
    age = models.IntegerField()
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    marital_status = models.CharField(max_length=10, choices=MATERIAL_STATUS_CHOICES)
    guardian_name = models.CharField(max_length=150, blank=True, null=True)
    photo = models.ImageField(upload_to='patient_photos/', blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    remark = models.TextField(blank=True, null=True)
    tpa = models.CharField(max_length=50, choices=TPA_CHOICES, blank=True, null=True)
    tpa_id = models.CharField(max_length=100, blank=True, null=True)
    tpa_validity = models.DateField(blank=True, null=True)
    national_identification_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.full_name
