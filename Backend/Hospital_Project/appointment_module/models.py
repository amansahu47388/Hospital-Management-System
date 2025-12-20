from django.db import models
import uuid
# from patient_module.models import Patient
from admin_module.models import AdminProfile
from django.conf import settings
from users.models import User

# Create your models here.
class Appointment(models.Model):
    CHOOOSE_SOURCE = (
        ("online", "Online"),
        ("offline", "Offline"),
    )

    CHOOSE_STATUS = (
        ("scheduled", "Scheduled"),
        ("approved", "Approved"),
        ("cancelled", "Cancelled"),
        ("pending", "Pending"),
    )
    CHOOSE_SHIFT = (
        ("morning", "Morning"),
        ("afternoon", "Afternoon"),
        ("evening", "Evening"),
    )
    CHOOSE_APPOINTMENT_PRIORITY = (
        ("normal", "Normal"),
        ("urgent", "Urgent"),
        ("very urgent", "Very Urgent"),
        ("low", "Low")
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE)
    # doctor = models.ForeignKey('admin_module.AdminProfile', on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_as_doctor", limit_choices_to={"role": "doctor"})
    appointment_no = models.CharField(max_length=20, unique=True, editable=False, default=uuid.uuid4)
    appointment_date = models.DateTimeField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    source = models.CharField(max_length=10, choices=CHOOOSE_SOURCE, default='offline')
    status = models.CharField(max_length=10, choices=CHOOSE_STATUS, default='pending')
    shift = models.CharField(max_length=10, choices=CHOOSE_SHIFT, blank=True, null=True)
    slot = models.CharField(max_length=20, blank=True, null=True)
    appontmet_priority = models.CharField(max_length=15, choices=CHOOSE_APPOINTMENT_PRIORITY, default='normal')
    payment_modee = models.CharField(max_length=50, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    department = models.CharField(max_length=150, blank=True, null=True)
    live_consultation = models.BooleanField(default=False)
    fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_appointments', null=True, blank=True)

    def __str__(self):
        return f"Appointment {self.id} - {self.patient.full_name} with {self.doctor.user.get_full_name()}"