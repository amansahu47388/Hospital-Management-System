from django.db import models
from users.models import User
import uuid
from datetime import date
from setup_module.models import OperationSetup



# ******************************************************************************************************#
#                              Patient Model
# ******************************************************************************************************#

class Patient(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile', null=True, blank=True   )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    photo = models.ImageField(upload_to='patient_photos/', blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True )
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='patients_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        """Return full name of patient"""
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def age(self):
        """Calculate detailed age from date of birth"""
        if not self.date_of_birth:
            return "0 Year"
        
        today = date.today()
        dob = self.date_of_birth
        
        years = today.year - dob.year
        months = today.month - dob.month
        days = today.day - dob.day
        
        if days < 0:
            months -= 1
            # Simple approximation for days in previous month
            days += 30 
        
        if months < 0:
            years -= 1
            months += 12
            
        parts = []
        if years > 0: parts.append(f"{years} Year")
        if months > 0: parts.append(f"{months} Month")
        if days > 0: parts.append(f"{days} Day")
        
        return ", ".join(parts) if parts else "0 Day"

    def get_gender_display_value(self):
        """Get gender display value"""
        gender_map = {
            'Male': 'Male',
            'Female': 'Female',
            'Other': 'Other',
        }
        return gender_map.get(self.gender, self.gender)

    def get_blood_group_display_value(self):
        """Get blood group display value"""
        return self.blood_group




# ******************************************************************************************************#
#                                       PatientVital Model
# ******************************************************************************************************#
class PatientVital(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vitals')
    vital_date = models.DateField()
    height = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pulse = models.IntegerField(null=True, blank=True)
    temperature = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bp = models.CharField(max_length=20, null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='vitals_created')
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Vital'
        verbose_name_plural = 'Patient Vitals'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['vital_date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.vital_date}"



# ******************************************************************************************************#
#                                       Patient Operation Model                                              #
# ******************************************************************************************************#

class PatientOperation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='operations')
    operation = models.ForeignKey(OperationSetup, on_delete=models.CASCADE, related_name='operations', )
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='operations_as_doctor', limit_choices_to={"role": "doctor"})
    operation_date = models.DateField()
    assistant_consultant_1 = models.CharField(max_length=100, null=True, blank=True)
    assistant_consultant_2 = models.CharField(max_length=100, null=True, blank=True)
    ot_technician = models.CharField(max_length=100, null=True, blank=True)
    ot_assistant = models.CharField(max_length=100, null=True, blank=True)
    anesthesia_type = models.CharField(max_length=100, null=True, blank=True)
    anesthetist = models.CharField(max_length=100, null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    result = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='operations_created')
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Operation'
        verbose_name_plural = 'Patient Operations'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['operation']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.operation}"




# ******************************************************************************************************#
#                                       Patient Consultant Model                                              #
# ******************************************************************************************************#

class PatientConsultant(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='consultants')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultants_as_doctor', limit_choices_to={"role": "doctor"})
    consultant_date = models.DateField()
    instruction = models.TextField()
    remark = models.TextField(null=True, blank=True)
    result = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='consultants_created')
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Consultant'
        verbose_name_plural = 'Patient Consultants'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['doctor']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.doctor}"








# ******************************************************************************************************#
#                                       Patient Charges Model                                              #
# ******************************************************************************************************#

class PatientCharges(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='charges')
    charge_date = models.DateField(null=True, blank=True)
    charge_type = models.CharField(max_length=100)
    charge_category = models.CharField(max_length=100)
    charge_name = models.CharField(max_length=100)
    standard_charge = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    charge_note = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='charges_created')
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Charge'
        verbose_name_plural = 'Patient Charges'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['charge_type']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.charge_type}"



# ******************************************************************************************************#
#                                       Patient Payment Model                                              #
# ******************************************************************************************************#

class PatientPayment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField(null=True, blank=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_mode = models.CharField(max_length=100)
    note = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments_created')
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Payment'
        verbose_name_plural = 'Patient Payments'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['payment_mode']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.paid_amount}"
