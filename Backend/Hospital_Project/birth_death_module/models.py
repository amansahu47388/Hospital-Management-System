from django.db import models
from users.models import User
import uuid


class BirthRecord(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    reference_no = models.CharField(max_length=50, unique=True, null=True, blank=True)
    child_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    weight = models.CharField(max_length=50, blank=True, null=True)
    birth_date = models.DateTimeField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    case_id = models.CharField(max_length=50, blank=True, null=True)
    mother_name = models.CharField(max_length=150)
    father_name = models.CharField(max_length=150, blank=True, null=True)
    report = models.TextField(blank=True, null=True)
    
    # Image fields
    child_photo = models.ImageField(upload_to='birth_records/child_photos/', blank=True, null=True)
    mother_photo = models.ImageField(upload_to='birth_records/mother_photos/', blank=True, null=True)
    father_photo = models.ImageField(upload_to='birth_records/father_photos/', blank=True, null=True)
    document_photo = models.ImageField(upload_to='birth_records/documents/', blank=True, null=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='birth_records_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.reference_no:
            self.reference_no = f"BREF{uuid.uuid4().hex[:4].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Birth Record - {self.child_name} ({self.reference_no})"

    class Meta:
        ordering = ['-created_at']


class DeathRecord(models.Model):
    reference_no = models.CharField(max_length=50, unique=True, null=True, blank=True)
    case_id = models.CharField(max_length=50, blank=True, null=True)
    patient_name = models.CharField(max_length=150)
    death_date = models.DateField()
    guardian_name = models.CharField(max_length=150, blank=True, null=True)
    report = models.TextField(blank=True, null=True)
    attachment = models.ImageField(upload_to='death_records/attachments/', blank=True, null=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='death_records_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.reference_no:
            self.reference_no = f"DREF{uuid.uuid4().hex[:4].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Death Record - {self.patient_name} ({self.reference_no})"

    class Meta:
        ordering = ['-created_at']
