from django.db import models
from setup_module.models import HospitalCharges
from users.models import User


class Ambulance(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('Owned', 'Owned'),
        ('Contractual', 'Contractual'),
    ]

    vehicle_number = models.CharField(max_length=50, unique=True)
    vehicle_model = models.CharField(max_length=100)
    year_made = models.PositiveIntegerField(null=True, blank=True)
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    driver_license = models.CharField(max_length=50, blank=True, null=True)
    driver_contact = models.CharField(max_length=15, blank=True, null=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle_number} - {self.vehicle_model}"

    class Meta:
        ordering = ['-created_at']


class AmbulanceChargeCategory(models.Model):
    category_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.category_name


class AmbulanceCharge(models.Model):
    category = models.ForeignKey(
        AmbulanceChargeCategory,
        on_delete=models.CASCADE,
        related_name="charges"
    )
    charge_name = models.CharField(max_length=100)
    standard_charge = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.charge_name} - ${self.standard_charge}"

    class Meta:
        unique_together = ('category', 'charge_name')


class AmbulanceBill(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE, related_name="ambulance_bills")
    ambulance = models.ForeignKey(Ambulance, on_delete=models.SET_NULL, null=True, blank=True)
    charge = models.ForeignKey(AmbulanceCharge, on_delete=models.SET_NULL, null=True, blank=True)
    hospital_charge = models.ForeignKey(HospitalCharges, on_delete=models.SET_NULL, null=True, blank=True, related_name="ambulance_bills")
    date = models.DateField()
    note = models.TextField(blank=True, null=True)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, blank=True, null=True)
    bill_no = models.CharField(max_length=50, unique=True, null=True, blank=True)

    # Financial fields
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.bill_no:
            # Generate bill number
            import uuid
            self.bill_no = f"AMB-{uuid.uuid4().hex[:8].upper()}"

        # Calculate net amount
        self.net_amount = self.total_amount - self.discount + self.tax
        self.balance = self.net_amount - self.paid_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ambulance Bill #{self.bill_no} - {self.patient}"

    class Meta:
        ordering = ['-created_at']
