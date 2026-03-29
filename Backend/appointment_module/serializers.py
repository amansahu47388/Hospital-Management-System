from rest_framework import serializers
from patient_module.models import Patient
from users.models import User
from appointment_module.models import *
from setup_module.serializers import HospitalChargesSerializer



class AppointmentPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentPriority
        fields = ['id', 'priority']


class AppointmentShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentShift
        fields = ['id', 'shift', 'time_from', 'time_to']


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
    shift_details = AppointmentShiftSerializer(source='shift', read_only=True)
    priority_details = AppointmentPrioritySerializer(source='appontmet_priority', read_only=True)
    charge_details = HospitalChargesSerializer(source='charge', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    doctor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="doctor"),
        required=True
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id", "created_at", "created_by")

    def get_doctor_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.full_name or obj.doctor.email}"
        return None

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name or obj.created_by.email
        return None

    def get_priority_details(self, obj):
        if obj.appontmet_priority:
            return {
                "id": obj.appontmet_priority.id,
                "priority": obj.appontmet_priority.priority
            }
        return None
    
    def get_shift_details(self, obj):
        if obj.shift:
            return {
                "id": obj.shift.id,
                "shift": obj.shift.shift,
                "time_from": obj.shift.time_from,
                "time_to": obj.shift.time_to
            }
        return None