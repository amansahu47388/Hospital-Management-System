from django.db import models
from django.conf import settings
from users.models import User
from patient_module.models import Patient


class AppointmentPriority(models.Model):
    priority = models.CharField(max_length=20)

    def __str__(self):
        return self.priority


class AppointmentShift(models.Model):
    shift = models.CharField(max_length=20)
    time_from = models.TimeField()
    time_to = models.TimeField()

    def __str__(self):
        return self.shift


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
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments" )
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_as_doctor", limit_choices_to={"role": "doctor"})
    shift = models.ForeignKey(AppointmentShift, on_delete=models.CASCADE, related_name="appointments", blank=True, null=True)
    appontmet_priority = models.ForeignKey(AppointmentPriority, on_delete=models.CASCADE, related_name="appointments", blank=True, null=True)
    appointment_date = models.DateTimeField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    source = models.CharField(max_length=10, choices=CHOOOSE_SOURCE, default='offline')
    status = models.CharField(max_length=10, choices=CHOOSE_STATUS, default='pending')
    slot = models.CharField(max_length=20, blank=True, null=True)
    payment_mode = models.CharField(max_length=50, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    department = models.CharField(max_length=150, blank=True, null=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_appointments', null=True, blank=True)
   
    def __str__(self):
       return f"{self.patient.full_name} - {self.doctor.full_name} - {self.appointment_date}"   