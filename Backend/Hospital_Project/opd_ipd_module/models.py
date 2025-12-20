from django.db import models

class OpdPatient(models.Model):
    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE)
    appointment = models.ForeignKey('appointment_module.Appointment', on_delete=models.CASCADE)
    consutant_doctor = models.ForeignKey('doctor_module.Doctor', on_delete=models.CASCADE)
    opd_no = models.CharField(max_length=20, unique=True)
    case_id = models.CharField(max_length=20, unique=True)
    old_patient = models.BooleanField(default=False)
    visit_date = models.DateTimeField(auto_now_add=True)
    previos_medical_issue = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"OPD Visit - {self.patient.first_name} on {self.visit_date.strftime('%Y-%m-%d')}"



class IpdPatient(models.Model):
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

