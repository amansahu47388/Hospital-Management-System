from rest_framework import serializers
from .models import PathologyTest, PathologyParameter, PathologyCategory, PathologyBill, PathologyBillItem
from datetime import timedelta
from django.db import transaction, models
from django.utils import timezone



class PathologyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyCategory
        fields = ["id", "category_name"]





class PathologyParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyParameter
        fields = ["parameter_name", "reference_range", "unit"]

    def validate_reference_range(self, value):
        if not value:
            raise serializers.ValidationError("Reference range is required")
        return value






class PathologyTestCreateSerializer(serializers.ModelSerializer):
    parameters = PathologyParameterSerializer(many=True)

    class Meta:
        model = PathologyTest
        fields = ["id", "test_name", "short_name", "test_type", "category", "sub_category", "method", "report_days", "charges", "tax",
            "standard_charge", "total_amount", "parameters",
        ]

    def create(self, validated_data):
        parameters_data = validated_data.pop("parameters")

        pathology_test = PathologyTest.objects.create(**validated_data)

        for param in parameters_data:
            PathologyParameter.objects.create(
                pathology_test=pathology_test,
                parameter_name=param["parameter_name"],
                reference_range=param["reference_range"],
                unit=param["unit"],
            )

        return pathology_test
    





class PathologyParameterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyParameter
        fields = ["parameter_name", "reference_range", "unit"]
    




class PathologyTestListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    charge_name = serializers.CharField(source="charges.charge_name", read_only=True)
    charge_category = serializers.CharField(source="charges.charge_category", read_only=True)
    parameters = PathologyParameterNestedSerializer(many=True, read_only=True)

    class Meta:
        model = PathologyTest
        fields = [ "id", "test_name", "short_name", "test_type", "charge_category", "category_name", "sub_category", "method", "report_days",
            "tax", "standard_charge", "total_amount", "charge_name","parameters"
        ]





class PathologyTestUpdateSerializer(serializers.ModelSerializer):
    parameters = PathologyParameterSerializer(many=True)

    class Meta:
        model = PathologyTest
        fields = ["test_name","short_name","test_type","category","sub_category","method","report_days","charges",
            "tax", "standard_charge", "total_amount", "parameters",
        ]
    def update(self, instance, validated_data):
        parameters_data = validated_data.pop("parameters")

        # Update main test fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Remove old parameters
        instance.parameters.all().delete()
        # Recreate parameters
        for param in parameters_data:
            PathologyParameter.objects.create(
                pathology_test=instance,
                parameter_name=param["parameter_name"],
                reference_range=param["reference_range"],
                unit=param["unit"],
            )

        return instance







class PathologyBillItemSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source="test.test_name", read_only=True)
    
    class Meta:
        model = PathologyBillItem
        fields = ["id", "test", "test_name", "price", "tax", "report_days", "report_date"]






class PathologyBillCreateSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField()
    doctor_id = serializers.IntegerField(required=False, allow_null=True)
    prescription_id = serializers.IntegerField(required=False, allow_null=True)
    note = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    previous_report_value = serializers.BooleanField(required=False, default=False)
    payment_mode = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    tests = serializers.ListField(
        child=serializers.DictField()
    )

    def validate_tests(self, value):
        if not value:
            raise serializers.ValidationError("At least one test is required")
        return value

    @transaction.atomic
    def create(self, validated_data):
        tests = validated_data.pop("tests")
        
        # Generate bill number - use max id to avoid conflicts
        max_id = PathologyBill.objects.aggregate(max_id=models.Max('id'))['max_id'] or 0
        bill_no = f"PB{max_id + 1:04d}"

        bill = PathologyBill.objects.create(
            patient_id=validated_data["patient_id"],
            doctor_id=validated_data.get("doctor_id"),
            prescription_id=validated_data.get("prescription_id"),
            note=validated_data.get("note", ""),
            previous_report_value=validated_data.get("previous_report_value", False),
            payment_mode=validated_data.get("payment_mode", ""),
            discount=validated_data["discount"],
            paid_amount=validated_data["paid_amount"],
            bill_no=bill_no,
            created_by=self.context["request"].user,
        )

        subtotal = 0
        total_tax = 0

        for t in tests:
            test = PathologyTest.objects.get(id=t["test_id"])

            price = test.standard_charge
            tax = (price * test.tax) / 100

            PathologyBillItem.objects.create(
                bill=bill,
                test=test,
                price=price,
                tax=tax,
                report_days=test.report_days or 0,
                report_date=timezone.now().date()
                + timedelta(days=test.report_days or 0),
            )

            subtotal += price
            total_tax += tax

        bill.subtotal = subtotal
        bill.tax = total_tax
        bill.total_amount = subtotal + total_tax - bill.discount
        bill.balance = bill.total_amount - bill.paid_amount
        bill.save()

        return bill








class PathologyBillListSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    case_id = serializers.SerializerMethodField()
    
    class Meta:
        model = PathologyBill
        fields = [
            "id", "bill_no", "case_id", "patient", "patient_name", "doctor", "doctor_name",
            "subtotal", "tax", "discount", "total_amount", "paid_amount", "balance",
            "payment_mode", "created_at", "created_by", "created_by_name", "items_count"
        ]
    
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return "-"
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.full_name or obj.doctor.email
        return "-"
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name or obj.created_by.email
        return "-"
    
    def get_items_count(self, obj):
        return obj.items.count()

    def get_case_id(self, obj):
        # Use prescription ID as case ID
        if obj.prescription_id:
            return f"RX-{obj.prescription_id}"
        return "-"





class PathologyBillDetailSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_phone = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()
    patient_blood_group = serializers.SerializerMethodField()
    patient_address = serializers.SerializerMethodField()
    case_id = serializers.SerializerMethodField()
    prescription_id = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    items = PathologyBillItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PathologyBill
        fields = [
            "id", "bill_no", "patient", "patient_name", "patient_phone", "patient_email",
            "patient_age", "patient_gender", "patient_blood_group", "patient_address",
            "doctor", "doctor_name", "prescription", "prescription_id", "case_id",
            "note", "previous_report_value",
            "subtotal", "tax", "discount", "total_amount", "paid_amount", "balance",
            "payment_mode", "created_at", "updated_at", "created_by", "created_by_name",
            "items"
        ]
    
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return "-"
    
    def get_patient_phone(self, obj):
        if obj.patient:
            return obj.patient.phone or "-"
        return "-"
    
    def get_patient_email(self, obj):
        if obj.patient:
            return obj.patient.email or "-"
        return "-"
    
    def get_patient_age(self, obj):
        if obj.patient:
            return obj.patient.age
        return None
    
    def get_patient_gender(self, obj):
        if obj.patient:
            return obj.patient.get_gender_display_value()
        return "-"
    
    def get_patient_blood_group(self, obj):
        if obj.patient:
            return obj.patient.get_blood_group_display_value() or "-"
        return "-"
    
    def get_patient_address(self, obj):
        if obj.patient:
            address_parts = [
                obj.patient.address,
                obj.patient.city,
                obj.patient.state,
                obj.patient.zip_code
            ]
            return ", ".join(filter(None, address_parts)) or "-"
        return "-"
    
    def get_case_id(self, obj):
        if obj.prescription_id:
            return f"RX-{obj.prescription_id}"
        return "-"
    
    def get_prescription_id(self, obj):
        return obj.prescription_id if obj.prescription else None
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.full_name or obj.doctor.email
        return "-"
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name or obj.created_by.email
        return "-"
    
