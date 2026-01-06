from rest_framework import serializers
from .models import OpdPatient, IpdPatient, IpdDischarge
from patient_module.serializers import PatientSerializer
from setup_module.serializers import BedSerializers
from users.serializers import UserSerializer
import uuid
from django.db import transaction, models

# OPD Patient Serializers
class OpdPatientSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    charge_category = serializers.CharField(source="charge.charge_category", read_only=True)
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = UserSerializer(source='doctor', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = OpdPatient
        fields = [
            'opd_id', 'patient', 'patient_detail', 'appointment_date', 'doctor', 'doctor_detail',
            'symptom', 'discount', 'total_amount', 'paid_amount', 'payment_mode','allergies',
            'checkup_id', 'case_id', 'old_patient', 'casualty', 'charge_id', 'charge_category',
            'reference', 'previous_medical_issue', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['opd_id', 'checkup_id',  'created_by', 'created_at', 'updated_at']

class OpdPatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpdPatient
        fields = [
            'patient', 'appointment_date', 'doctor','allergies', 'symptom', 'discount', 'total_amount', 'paid_amount', 
            'payment_mode', 'old_patient', 'casualty', 'reference', 'previous_medical_issue',
        ]

    def create(self, validated_data):

        max_id = OpdPatient.objects.aggregate(max_id=models.Max('id'))['max_id'] or 0
        case_id = f"{max_id + 1:04d}"

        validated_data["case_id"] = case_id

        return super().create(validated_data)


class OpdPatientListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)    # return nested created_by for list view
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = OpdPatient
        fields = [
            "opd_id","patient_detail","case_id","checkup_id",'allergies', "appointment_date","created_by",
            "doctor_detail","reference","symptom_name","old_patient","previous_medical_issue",
        ]


class OpdPatientUpdateSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    class Meta:
        model = OpdPatient
        fields = [
            'appointment_date', 'charge_id', 'doctor','allergies','symptom','discount','total_amount','paid_amount',
            'payment_mode','old_patient','casualty','reference','previous_medical_issue',
        ]







# IPD Patient Serializers 
class IpdPatientSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = UserSerializer(source='doctor', read_only=True)
    created_by = UserSerializer(read_only=True)
    bed = BedSerializers(read_only=True)

    class Meta:
        model = IpdPatient
        fields = [
            'ipd_id', 'patient', 'patient_detail', 'appointment_date', 'doctor', 'doctor_detail', 'bed' , 'discharge_date',
            'symptom','allergies','checkup_id', 'case_id', 'old_patient', 'casualty', 'reference', 'previous_medical_issue', 
            'credit_limit', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['ipd_id', 'checkup_id',  'created_by', 'created_at', 'updated_at']


class IpdPatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdPatient
        fields = [
            'patient', 'appointment_date', 'doctor','allergies', 'symptom', 'bed', 'credit_limit' , 'case_id',
            'old_patient', 'casualty', 'reference', 'previous_medical_issue',
        ]

    def create(self, validated_data):

        max_id = OpdPatient.objects.aggregate(max_id=models.Max('id'))['max_id'] or 0
        case_id = f"{max_id + 1:04d}"

        validated_data["case_id"] = case_id
        return super().create(validated_data)


class IpdPatientListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    created_by = UserSerializer(read_only=True)
    bed = BedSerializers(read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)

    class Meta:
        model = IpdPatient
        fields = [
            "ipd_id","case_id","patient_detail","appointment_date","case_id","doctor_detail","bed","symptom_name",
            "previous_medical_issue","credit_limit","created_by","created_at",
        ]



class IpdPatientUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdPatient
        fields = [
            'appointment_date', 'doctor','allergies','symptom', 'bed','old_patient','casualty','reference','previous_medical_issue',
            "credit_limit","created_by","created_at",
        ]


class IpdDischargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdDischarge
        fields = "__all__"
        extra_kwargs = {
            "ipd_patient": {"required": False},
            "patient": {"required": False},
            "death_date": {"required": False, "allow_null": True},
            "guardian_name": {"required": False, "allow_blank": True},
            "referral_date": {"required": False, "allow_null": True},
            "hospital_name": {"required": False, "allow_blank": True},
            "reason": {"required": False, "allow_blank": True},
            "attachment": {"required": False, "allow_null": True},
            "report": {"required": False, "allow_blank": True},
            "diagnosis": {"required": False, "allow_blank": True},
            "investigation": {"required": False, "allow_blank": True},
            "operation": {"required": False, "allow_blank": True},
            "treatment_at_home": {"required": False, "allow_blank": True},
            "discharge_note": {"required": False, "allow_blank": True},
        }

    def validate(self, data):
        status = data.get("discharge_status")

        if status == "death":
            if not data.get("death_date"):
                raise serializers.ValidationError({
                    "death_date": "Death date is required"
                })
            if not data.get("guardian_name"):
                raise serializers.ValidationError({
                    "guardian_name": "Guardian name is required"
                })

        if status == "referral":
            if not data.get("referral_date"):
                raise serializers.ValidationError({
                    "referral_date": "Referral date is required"
                })
            if not data.get("hospital_name"):
                raise serializers.ValidationError({
                    "hospital_name": "Hospital name is required"
                })
            if not data.get("reason"):
                raise serializers.ValidationError({
                    "reason": "Reason is required"
                })

        return data


class IpdDischargedListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    created_by = UserSerializer(read_only=True)
    discharge = serializers.SerializerMethodField()

    class Meta:
        model = IpdPatient
        fields = [
            "ipd_id","case_id","patient_detail","doctor_detail","created_by","appointment_date", "discharge_date","credit_limit","discharge",
        ]

    def get_discharge(self, obj):
        if hasattr(obj, "discharge"):
            return {
                "status": obj.discharge.discharge_status,
                "discharge_date": obj.discharge.discharge_date,
                "death_date": obj.discharge.death_date,
                "guardian_name": obj.discharge.guardian_name,
                "report": obj.discharge.report,
                "referral_date": obj.discharge.referral_date,
                "reason": obj.discharge.reason,
                "hospital_name": obj.discharge.hospital_name
            }
        return None
    
    def get_attachment(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None