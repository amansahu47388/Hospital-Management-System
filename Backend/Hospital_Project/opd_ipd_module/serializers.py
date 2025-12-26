from rest_framework import serializers
from .models import OpdPatient
from patient_module.serializers import PatientSerializer
from users.serializers import UserSerializer
import uuid


class OpdPatientSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    charge_category = serializers.CharField(source="charge.charge_category", read_only=True)
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = UserSerializer(source='doctor', read_only=True)

    class Meta:
        model = OpdPatient
        fields = [
            'opd_id', 'patient', 'patient_detail', 'appointment_date', 'doctor', 'doctor_detail',
            'symptom', 'discount', 'total_amount', 'paid_amount', 'payment_mode',
            'checkup_id', 'case_id', 'old_patient', 'casualty', 'charge_id', 'charge_category',
            'reference', 'previous_medical_issue', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['opd_id', 'checkup_id',  'created_by', 'created_at', 'updated_at']

class OpdPatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpdPatient
        fields = [
            'patient', 'appointment_date', 'doctor', 'symptom', 'discount', 'total_amount', 'paid_amount', 
            'payment_mode', 'old_patient', 'casualty', 'reference', 'previous_medical_issue',
        ]

    def create(self, validated_data):
        validated_data['checkup_id'] = f"CHKN{uuid.uuid4().hex[:8].upper()}"
        validated_data['case_id'] = f"CASEN{uuid.uuid4().hex[:8].upper()}"
        
        return super().create(validated_data)


class OpdPatientListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)

    class Meta:
        model = OpdPatient
        fields = [
            "opd_id","patient_detail","case_id","checkup_id", "appointment_date","created_by",
            "doctor_detail","reference","symptom_name","old_patient","previous_medical_issue",
        ]


class OpdPatientUpdateSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    class Meta:
        model = OpdPatient
        fields = [
            'appointment_date', 'charge_id', 'doctor','symptom','discount','total_amount','paid_amount',
            'payment_mode','old_patient','casualty','reference','previous_medical_issue',
        ]
