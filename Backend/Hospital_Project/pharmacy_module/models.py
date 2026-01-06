from django.db import models
from users.models import User 

# Create your models here.
class MedicineCategory(models.Model):
    category_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.category_name



class Company(models.Model):
    company_name  = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.company_name
    


class MedicineGroup(models.Model):
    group_name  = models.CharField(max_length=20)

    def __str__(self):
        return self.group_name
    

class Unit(models.Model):
    unit_name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.unit_name


class Supplier(models.Model):
    supplier_name = models.CharField(max_length=255,unique=True)
    supplier_contact = models.CharField(max_length=20,help_text="Supplier main contact number")
    contact_person_name = models.CharField(max_length=255)
    contact_person_phone = models.CharField(max_length=20)
    drug_license_number = models.CharField(max_length=100,unique=True)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["supplier_name"]

    def __str__(self):
        return self.supplier_name


class MedicineDosage(models.Model):
    category_name = models.ForeignKey(MedicineCategory, on_delete=models.CASCADE, related_name="medicine_doase")
    dosage = models.DecimalField(max_digits=6,decimal_places=2)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="medicine_dosage")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category_name", "dosage"]
        unique_together = ("category_name", "dosage", "unit")

    def __str__(self):
        return f"{self.category_name} - {self.dosage}{self.unit}"


class Dosage(models.Model):
    dosage_interval = models.CharField(max_length=100)
    dosage_duration = models.CharField(max_length=100,)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["dosage_interval"]

    def __str__(self):
        return f"{self.dosage_interval} - {self.dosage_duration}"




class Medicine(models.Model):
    name = models.CharField(max_length=150)
    category = models.ForeignKey(MedicineCategory, on_delete=models.PROTECT)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    group = models.ForeignKey(MedicineGroup, on_delete=models.SET_NULL, null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)

    composition = models.CharField(max_length=255, blank=True)
    min_level = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=0)

    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    box_packing = models.CharField(max_length=50)
    vat_account = models.CharField(max_length=50, blank=True)
    rack_number = models.CharField(max_length=50, blank=True)
    note = models.TextField(blank=True)

    image = models.ImageField(upload_to="medicines/", null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='medicine')

    class Meta:
        unique_together = ("name", "company")

    def __str__(self):
        return self.name
