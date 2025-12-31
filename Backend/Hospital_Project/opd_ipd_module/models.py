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
    allergies = models.TextField(blank=True, null=True)
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
    appointment_date = models.DateTimeField(null=True, blank=True)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ipd_patients_as_doctor", limit_choices_to={"role": "doctor"})
    symptom = models.ForeignKey('setup_module.Symptom', on_delete=models.SET_NULL, null=True)
    bed = models.ForeignKey('setup_module.Bed', on_delete=models.SET_NULL, null=True)
    checkup_id = models.CharField(max_length=20, blank=True, null=True)
    case_id = models.CharField(max_length=20, unique=True)
    old_patient = models.BooleanField(default=False)
    casualty = models.BooleanField(default=False)
    allergies = models.TextField(blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_discharged = models.BooleanField(default=False) 
    discharge_date = models.DateTimeField(null=True, blank=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    previous_medical_issue = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"IPD Visit - {self.patient.first_name} on {self.created_at.strftime('%Y-%m-%d')}"



class IpdDischarge(models.Model):

    DISCHARGE_STATUS_CHOICES = [
        ("normal", "Normal"),
        ("referral", "Referral"),
        ("death", "Death"),
    ]
    
    ipd_patient = models.OneToOneField("opd_ipd_module.IpdPatient", on_delete=models.CASCADE,related_name="discharge")
    patient = models.ForeignKey("patient_module.Patient", on_delete=models.SET_NULL,null=True,blank=True,related_name="discharges",)
    discharge_date = models.DateTimeField(null=True, blank=True)
    discharge_status = models.CharField(max_length=20,choices=DISCHARGE_STATUS_CHOICES)
    guardian_name = models.CharField(max_length=100, blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    investigation = models.TextField(blank=True, null=True)
    operation = models.TextField(blank=True, null=True)
    treatment_at_home = models.TextField(blank=True, null=True)
    discharge_note = models.TextField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    report = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="ipd_discharge_attachments/",blank=True,null=True)
    death_date = models.DateTimeField(blank=True, null=True)
    referral_date = models.DateTimeField(blank=True, null=True)
    hospital_name = models.CharField(max_length=150, blank=True, null=True)
    note = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Discharge - IPD {self.ipd_patient.ipd_id}"