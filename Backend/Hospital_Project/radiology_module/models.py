from django.db import models
from setup_module.models import HospitalCharges
from users.models import User


class RadiologyCategory(models.Model):
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name


class RadiologyTest(models.Model):
    test_name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    test_type = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(
        RadiologyCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name="tests"
    )
    sub_category = models.CharField(max_length=100, blank=True)
    method = models.CharField(max_length=100, blank=True)
    report_days = models.PositiveIntegerField(null=True, blank=True)
    charges = models.ForeignKey(
        HospitalCharges,
        on_delete=models.SET_NULL,
        null=True,
        related_name="radiology_tests"
    )
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    standard_charge = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.test_name


class RadiologyParameter(models.Model):
    radiology_test = models.ForeignKey(
        RadiologyTest,
        on_delete=models.CASCADE,
        related_name="parameters"
    )
    parameter_name = models.CharField(max_length=100)
    reference_range = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ("radiology_test", "parameter_name")

    def __str__(self):
        return f"{self.parameter_name} - {self.radiology_test.test_name}"


class RadiologyBill(models.Model):
    patient = models.ForeignKey(
        'patient_module.Patient',
        on_delete=models.CASCADE,
        related_name="radiology_bills"
    )
    radiologytest = models.ForeignKey(
        RadiologyTest,
        on_delete=models.CASCADE,
        related_name="radiology_bills"
    )
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="radiology_bills",
        limit_choices_to={"role": "doctor"}
    )
    note = models.TextField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Radiology Bill #{self.id}"
