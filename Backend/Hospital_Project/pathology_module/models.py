from django.db import models
from setup_module.models import HospitalCharges
from users.models import User


class PathologyCategory(models.Model):
    category_name = models.CharField(max_length=100)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.category_name
    


class PathologyParameter(models.Model):
    parameter_name = models.CharField(max_length=100,unique=True)
    reference_range = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.parameter_name}"



class PathologyTest(models.Model):
    parameters = models.ManyToManyField(PathologyParameter, related_name="tests")
    test_name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    test_type = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(PathologyCategory,on_delete=models.SET_NULL,null=True,related_name="tests")
    sub_category = models.CharField(max_length=100, blank=True)
    method = models.CharField(max_length=100, blank=True)
    report_days = models.PositiveIntegerField(null=True, blank=True)
    charges = models.ForeignKey(HospitalCharges,on_delete=models.SET_NULL,null=True,related_name="pathology_tests")
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    standard_charge = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.test_name





class PathologyBill(models.Model):
    patient = models.ForeignKey('patient_module.Patient', on_delete=models.CASCADE, related_name="pathology_bills" )
    doctor = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name="pathology_bills", limit_choices_to={"role": "doctor"}, null=True, blank=True)
    prescription = models.ForeignKey('opd_ipd_module.Prescription', on_delete=models.SET_NULL, null=True, blank=True, related_name="pathology_bills")
    note = models.TextField(null=True, blank=True)
    previous_report_value = models.BooleanField(default=False)
    payment_mode = models.CharField(max_length=50, null=True, blank=True)
    bill_no = models.CharField(max_length=50, unique=True, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance  = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ["-created_at"]
        
    def __str__(self):
        return f"Pathology Bill #{self.id} - {self.patient}"
    

    
class PathologyBillItem(models.Model):
    bill = models.ForeignKey( PathologyBill,on_delete=models.CASCADE, related_name="items")
    test = models.ForeignKey( PathologyTest, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    report_days = models.PositiveIntegerField()
    report_date = models.DateField()
    
    def __str__(self):
        return f"{self.bill.bill_no} - {self.test.test_name}"
