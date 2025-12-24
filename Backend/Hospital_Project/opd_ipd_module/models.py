from django.db import models
from users.models import User

class OpdPatient(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('transfer to bank account', 'Transfer to Bank Account'),
        ('cheque', 'Cheque'),
        ('other', 'Other'),
    ]

    opd_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE)
    appointment_date = models.DateTimeField(null=True, blank=True)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="opd_patients_as_doctor", limit_choices_to={"role": "doctor"})
    symptom = models.ForeignKey('setup_module.Symptom', on_delete=models.SET_NULL, null=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_mode = models.CharField(max_length=50, choices=PAYMENT_MODE_CHOICES, default='cash')
    checkup_id = models.CharField(max_length=20, unique=True)
    case_id = models.CharField(max_length=20, unique=True)
    old_patient = models.BooleanField(default=False)
    casualty = models.BooleanField(default=False)
    reference = models.CharField(max_length=100, blank=True, null=True)
    previous_medical_issue = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"OPD Visit - {self.patient.first_name} on {self.created_at.strftime('%Y-%m-%d')}"



class IpdPatient(models.Model):
    ipd_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE)
    admission_date = models.DateTimeField(auto_now_add=True)
    discharge_date = models.DateTimeField(null=True, blank=True)
    ipd_no = models.CharField(max_length=20, unique=True)
    case_id = models.CharField(max_length=20, unique=True)
    old_patient = models.BooleanField(default=False)
    previous_medical_issue = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    consutant_doctor = models.ForeignKey('doctor_module.Doctor', on_delete=models.CASCADE)
    bad = models.ForeignKey('setup_module.Bad', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"IPD Visit - {self.patient.first_name} on {self.admission_date.strftime('%Y-%m-%d')}"

