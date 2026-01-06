from rest_framework import serializers
from .models import (
    MedicineCategory,
    Company,
    MedicineGroup,
    Unit,
    Supplier,
    MedicineDosage,
    Dosage,
    Medicine
)


# ----------------- CATEGORY -----------------
class MedicineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = ["id", "category_name"]


# ----------------- COMPANY -----------------
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "company_name"]


# ----------------- GROUP -----------------
class MedicineGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineGroup
        fields = ["id", "group_name"]


# ----------------- UNIT -----------------
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "unit_name"]


# ----------------- SUPPLIER -----------------
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "id",
            "supplier_name",
            "supplier_contact",
            "contact_person_name",
            "contact_person_phone",
            "drug_license_number",
            "address",
            "is_active",
        ]


# ----------------- MEDICINE DOSAGE -----------------
class MedicineDosageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category_name.name", read_only=True)
    unit_name = serializers.CharField(source="unit.unit_name", read_only=True)

    class Meta:
        model = MedicineDosage
        fields = [
            "id",
            "category_name",
            "dosage",
            "unit",
            "unit_name",
            "is_active",
        ]


# ----------------- DOSAGE -----------------
class DosageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dosage
        fields = [
            "id",
            "dosage_interval",
            "dosage_duration",
            "is_active",
        ]



# ---------- MEDICINE SERIALIZER ----------

class MedicineSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    group_name = serializers.CharField(source="group.group_name", read_only=True)
    unit_name = serializers.CharField(source="unit.unit_name", read_only=True)

    class Meta:
        model = Medicine
        fields = [
            "id", "name",
            "category", "category_name",
            "company", "company_name",
            "group", "group_name",
            "unit", "unit_name",
            "composition",
            "min_level",
            "reorder_level",
            "tax",
            "box_packing",
            "vat_account",
            "rack_number",
            "note",
            "image",
            "is_active",
            "created_at",
        ]

    def validate(self, data):
        if data.get("min_level", 0) < 0:
            raise serializers.ValidationError("Min level cannot be negative")

        if data.get("reorder_level", 0) < 0:
            raise serializers.ValidationError("Reorder level cannot be negative")

        return data