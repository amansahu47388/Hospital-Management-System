from rest_framework import serializers
from .models import AdminProfile

class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AdminProfile
        fields = ['id', 'full_name', 'designation', 'department', 'specialist', 'consultation_fee', 'work_shift']
    
    def get_full_name(self, obj):
        return f"Dr. {obj.user.full_name or obj.user.email}"