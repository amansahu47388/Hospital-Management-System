from django.db import models
import uuid
from django.conf import settings

class AdminProfile(models.Model):
    CHOOSE_MERITAL_STATUS = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
        ('Separated', 'Separated'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="admin_profile")
    designation = models.CharField(max_length=150, blank=True)
    department = models.CharField(max_length=150, blank=True)
    specialist = models.CharField(max_length=255, blank=True)
    consultation_duration_minutes = models.IntegerField(default=15)  # default slot length
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    contract_type = models.CharField(max_length=100, blank=True)
    work_shift = models.CharField(max_length=100, blank=True)
    work_location = models.CharField(max_length=255, blank=True)
    merital_status = models.CharField(max_length=10, choices=CHOOSE_MERITAL_STATUS, blank=True)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gender = models.CharField(max_length=10, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    current_address = models.TextField(blank=True)
    permanent_address = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to="admin_profiles/", blank=True, null=True)
    qualifications = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    socia_media_links = models.JSONField(default=dict, blank=True)

    # Additional fields from frontend
    staff_id = models.CharField(max_length=20, blank=True)
    father_name = models.CharField(max_length=255, blank=True)
    mother_name = models.CharField(max_length=255, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    pan_number = models.CharField(max_length=20, blank=True)
    national_id = models.CharField(max_length=20, blank=True)
    local_id = models.CharField(max_length=20, blank=True)
    reference_contact = models.CharField(max_length=15, blank=True)
    epf_no = models.CharField(max_length=20, blank=True)
    date_of_leaving = models.DateField(null=True, blank=True)
    casual_leave = models.IntegerField(default=0)
    privilege_leave = models.IntegerField(default=0)
    sick_leave = models.IntegerField(default=0)
    maternity_leave = models.IntegerField(default=0)
    paternity_leave = models.IntegerField(default=0)
    fever_leave = models.IntegerField(default=0)
    account_title = models.CharField(max_length=255, blank=True)
    bank_account_number = models.CharField(max_length=20, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    ifsc_code = models.CharField(max_length=20, blank=True)
    bank_branch_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email}"