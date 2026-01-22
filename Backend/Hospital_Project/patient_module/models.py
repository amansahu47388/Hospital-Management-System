from django.db import models
from users.models import User
import uuid
from datetime import date

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
        """Calculate age from date of birth"""
        if not self.date_of_birth:
            return 0
        
        today = date.today()
        try:
            age = today.year - self.date_of_birth.year
            
            if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
                age -= 1
            
            return max(0, age)  # Return 0 if negative
        except (ValueError, TypeError):
            return 0

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
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    pulse = models.IntegerField()
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    bp = models.CharField(max_length=10)

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



