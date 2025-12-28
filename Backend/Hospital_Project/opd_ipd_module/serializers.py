from rest_framework import serializers
from .models import OpdPatient, IpdPatient
from patient_module.serializers import PatientSerializer
from setup_module.serializers import BedSerializers
from users.serializers import UserSerializer
import uuid

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
            "ipd_id","patient_detail","appointment_date","case_id","doctor_detail","bed","symptom_name",
            "previous_medical_issue","credit_limit","created_by","created_at",
        ]



class IpdPatientUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdPatient
        fields = [
            'appointment_date', 'doctor','allergies','symptom', 'bed','old_patient','casualty','reference','previous_medical_issue',
            "credit_limit","created_by","created_at",
        ]
