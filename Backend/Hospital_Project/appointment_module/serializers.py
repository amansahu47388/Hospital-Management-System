# apps/appointments/serializers.py
from rest_framework import serializers
from .models import Appointment
from patient_module.models import Patient
from users.models import User

class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'gender', 'full_name']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id',  'full_name', 'email', 'phone', 'role']
    
    def get_full_name(self, obj):
        return f"Dr. {obj.full_name or obj.email}"


class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    doctor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="doctor"),
        required=True
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id", "appointment_no", "created_at", "created_by")

    def get_doctor_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.full_name or obj.doctor.email}"
        return None

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name or obj.created_by.email
        return None

    def create(self, validated_data):
        import uuid
        validated_data["appointment_no"] = f"APP{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)

