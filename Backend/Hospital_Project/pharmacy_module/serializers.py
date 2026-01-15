from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import json
from datetime import datetime
from django.db import transaction, models
from django.utils import timezone
from .models import (
    MedicineCategory,
    Company,
    MedicineGroup,
    Unit,
    Supplier,
    MedicineDosage,
    Dosage,
    Medicine,
    MedicineBatch,
    MedicineStock,
    PharmacyPurchase,
    PharmacyPurchaseItem,
    PharmacyBill,
    PharmacyBillItem
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


# ----------------- MEDICINE -----------------
class MedicineSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    group_name = serializers.CharField(source="group.group_name", read_only=True)
    unit_name = serializers.CharField(source="unit.unit_name", read_only=True)
    available_qty = serializers.IntegerField(read_only=True)

    class Meta:
        model = Medicine
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "company",
            "company_name",
            "group",
            "group_name",
            "unit",
            "unit_name",
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
            "available_qty",
        ]


class MedicineCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = [
            "name",
            "category",
            "company",
            "group",
            "unit",
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
        ]


    def create(self, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        return Medicine.objects.create(created_by=user, **validated_data)
    



# ----------------- MEDICINE STOCK -----------------
class MedicineStockDetailSerializer(serializers.ModelSerializer):
    batch_no = serializers.CharField(source="batch.batch_no")
    expiry_date = serializers.DateField(source="batch.expiry_date")
    created_at = serializers.DateTimeField(source="batch.created_at") 
    mrp = serializers.DecimalField(source="batch.mrp", max_digits=10, decimal_places=2)
    purchase_price = serializers.DecimalField(source="batch.purchase_price", max_digits=10, decimal_places=2)
    sale_price = serializers.DecimalField(source="batch.sale_price", max_digits=10, decimal_places=2)
    tax_percentage = serializers.DecimalField(source="batch.tax_percentage", max_digits=5, decimal_places=2)

    class Meta:
        model = MedicineStock
        fields = [
            "id",
            "batch_no",
            "expiry_date",
            'created_at',
            "mrp",
            "purchase_price",
            "sale_price",
            "tax_percentage",
            "total_qty",
            "available_qty",
            "reserved_qty",
        ]






# ----------------- PHARMACY PURCHASE -----------------
class PharmacyPurchaseItemSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source="medicine.name", read_only=True)
    category_name = serializers.CharField(source="medicine.category.category_name", read_only=True)
    box_packing = serializers.CharField(source="medicine.box_packing", read_only=True)

    batch_no = serializers.CharField(source="batch.batch_no", read_only=True)
    expiry_date = serializers.DateField(source="batch.expiry_date", read_only=True)
    mrp = serializers.DecimalField(source="batch.mrp", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = PharmacyPurchaseItem
        fields = [
            "id",
            "medicine",
            "medicine_name",
            "category_name",
            "box_packing",
            "batch",
            "batch_no",
            "expiry_date",
            "mrp",
            "quantity",
            "purchase_price",
            "sale_price",
            "tax_percentage",
            "amount",
        ]


class PharmacyPurchaseSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.supplier_name", read_only=True)
    supplier_contact = serializers.CharField(source="supplier.supplier_contact", read_only=True)
    contact_person_name = serializers.CharField(source="supplier.contact_person_name", read_only=True)
    contact_person_phone = serializers.CharField(source="supplier.contact_person_phone", read_only=True)
    drug_license_number = serializers.CharField(source="supplier.drug_license_number", read_only=True)
    address = serializers.CharField(source="supplier.address", read_only=True)

    items = PharmacyPurchaseItemSerializer(many=True, read_only=True)

    class Meta:
        model = PharmacyPurchase
        fields = [
            "id",
            "supplier",
            "supplier_name",
            "supplier_contact",
            "contact_person_name",
            "contact_person_phone",
            "drug_license_number",
            "address",
            "bill_no",
            "purchase_date",
            "total_amount",
            "discount_amount",
            "tax_amount",
            "net_amount",
            "payment_mode",
            "payment_amount",
            "note",
            "items",
        ]


class PharmacyPurchaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyPurchase
        fields = [
            "supplier",
            "bill_no",
            "purchase_date",
            "total_amount",
            "discount_amount",
            "tax_amount",
            "net_amount",
            "payment_mode",
            "payment_amount",
            "note",
            "attachment",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        raw_items_json = request.data.get("items_json")
        if not raw_items_json:
            raise ValidationError({"items": "At least one item is required"})

        try:
            items_data = json.loads(raw_items_json)
        except Exception:
            raise ValidationError({"items": "Invalid items_json format"})

        with transaction.atomic():
            purchase = PharmacyPurchase.objects.create(
                created_by=user, **validated_data
            )

            for item in items_data:
                medicine_id = item.get("medicine")
                batch_no = item.get("batch_no")
                expiry_date = item.get("expiry_date")
                quantity = int(item.get("quantity", 0))
                purchase_price = item.get("purchase_price")
                sale_price = item.get("sale_price")
                tax_percentage = item.get("tax_percentage", 0)
                amount = item.get("amount", 0)
                mrp = item.get("mrp", 0)

                if not medicine_id or not batch_no:
                    raise ValidationError({"items": "medicine & batch_no required"})

                if quantity <= 0:
                    raise ValidationError({"items": "quantity must be > 0"})

                medicine = Medicine.objects.get(pk=medicine_id)

                batch, _ = MedicineBatch.objects.get_or_create(
                    medicine=medicine,
                    batch_no=batch_no,
                    defaults={
                        "expiry_date": expiry_date,
                        "mrp": mrp,
                        "purchase_price": purchase_price,
                        "sale_price": sale_price,
                        "tax_percentage": tax_percentage,
                    },
                )

                PharmacyPurchaseItem.objects.create(
                    purchase=purchase,
                    medicine=medicine,
                    batch=batch,
                    quantity=quantity,
                    purchase_price=purchase_price,
                    sale_price=sale_price,
                    tax_percentage=tax_percentage,
                    amount=amount,
                )

                # ✅ STOCK UPDATE (VERY IMPORTANT)
                stock, created = MedicineStock.objects.get_or_create(
                    medicine=medicine,
                    batch=batch,
                    defaults={
                        "total_qty": quantity,
                        "available_qty": quantity,
                    },
                )

                if not created:
                    stock.total_qty += quantity
                    stock.available_qty += quantity
                    stock.save()

        return purchase


# ----------------- PHARMACY BILL -----------------
class PharmacyBillItemSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source="medicine.name", read_only=True)
    batch_no = serializers.CharField(source="batch.batch_no", read_only=True)
    expiry_date = serializers.DateField(source="batch.expiry_date", read_only=True)


    class Meta:
        model = PharmacyBillItem
        fields = [
            "id",
            "medicine",
            "medicine_name",
            "batch",
            "batch_no",
            "quantity",
            "expiry_date",
            "sale_price",
            "tax_percentage",
            "discount_percentage",
            "amount",
        ]


class PharmacyBillSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_phone = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    items = PharmacyBillItemSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True)

    class Meta:
        model = PharmacyBill
        fields = [
            "id",
            "bill_date",
            "patient",
            "patient_name",
            "patient_phone",
            "items",
            "doctor",
            "doctor_name",

            "created_by",
            "created_by_name",

            "total_amount",
            "discount_amount",
            "tax_amount",
            "net_amount",
            "paid_amount",
            "refund_amount",
            "balance_amount",
            "payment_mode",
            "note",
        ]
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return "-"
    
    def get_patient_phone(self, obj):
        if obj.patient:
            return f"{obj.patient.phone}"
        return "-"
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.full_name or obj.doctor.email
        return "-"


class PharmacyBillCreateSerializer(serializers.ModelSerializer):
    items = PharmacyBillItemSerializer(many=True)

    class Meta:
        model = PharmacyBill
        fields = [
            "patient",
            "doctor",
            "total_amount",
            "discount_amount",
            "tax_amount",
            "net_amount",
            "paid_amount",
            "refund_amount",
            "balance_amount",
            "payment_mode",
            "note",
            "items",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        items = validated_data.pop("items")

        if not items:
            raise ValidationError("At least one medicine is required")

        with transaction.atomic():

            bill = PharmacyBill.objects.create(created_by=user, **validated_data)

            for item in items:

                stock = MedicineStock.objects.select_for_update().get(
                    medicine=item["medicine"],
                    batch=item["batch"]
                )

                if stock.available_qty < item["quantity"]:
                    raise ValidationError(
                        f"Not enough stock for {item['medicine'].name} - {item['batch'].batch_no}"
                    )

                # 🔻 Deduct stock
                stock.available_qty -= item["quantity"]
                stock.save()

                PharmacyBillItem.objects.create(
                    bill=bill,
                    **item
                )

        return bill

