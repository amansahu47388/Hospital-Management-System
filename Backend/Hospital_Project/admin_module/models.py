from django.db import models
import uuid
from django.conf import settings

class AdminProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile")
    designation = models.CharField(max_length=150, blank=True)
    department = models.CharField(max_length=150, blank=True)
    specialist = models.CharField(max_length=255, blank=True)
    consultation_duration_minutes = models.IntegerField(default=15)  # default slot length
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    contract_type = models.CharField(max_length=100, blank=True)
    work_shift = models.CharField(max_length=100, blank=True)
    work_location = models.CharField(max_length=255, blank=True)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gender = models.CharField(max_length=10, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    current_address = models.TextField(blank=True)
    permanent_address = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to="doctor_profiles/", blank=True, null=True)
    qualifications = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    socia_media_links = models.JSONField(default=dict, blank=True)  # e.g. {"linkedin": "...", "twitter": "..."}

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username}"