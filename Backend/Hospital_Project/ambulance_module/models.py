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

class AmbulanceBill(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE, related_name="ambulance_bills")
    case = models.ForeignKey('patient_module.MedicalCase', on_delete=models.SET_NULL, null=True, blank=True, related_name="ambulance_bills")
    # bill_no = models.CharField(max_length=50, unique=True, null=True, blank=True)
    ambulance = models.ForeignKey(Ambulance, on_delete=models.SET_NULL, null=True, blank=True)
    hospital_charge = models.ForeignKey(HospitalCharges, on_delete=models.SET_NULL, null=True, blank=True, related_name="ambulance_bills")
    date = models.DateField()
    note = models.TextField(blank=True, null=True)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, blank=True, null=True)

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

class AmbulanceBillTransaction(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    bill = models.ForeignKey(AmbulanceBill, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    date = models.DateTimeField()
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default='cash')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            import uuid
            self.transaction_id = f"TRANID{uuid.uuid4().hex[:5].upper()}"
        super().save(*args, **kwargs)
        
        # Update bill's paid_amount when transaction is created
        from django.db.models import Sum
        bill = self.bill
        total_paid = bill.transactions.aggregate(
            total=Sum('amount')
        )['total'] or 0
        bill.paid_amount = total_paid
        bill.balance = bill.net_amount - total_paid
        bill.save()

    def delete(self, *args, **kwargs):
        bill = self.bill
        super().delete(*args, **kwargs)
        # Recalculate paid_amount after deletion
        from django.db.models import Sum
        total_paid = bill.transactions.aggregate(
            total=Sum('amount')
        )['total'] or 0
        bill.paid_amount = total_paid
        bill.balance = bill.net_amount - total_paid
        bill.save()

    def __str__(self):
        return f"Transaction {self.transaction_id} - ${self.amount}"

    class Meta:
        ordering = ['-date', '-created_at']

