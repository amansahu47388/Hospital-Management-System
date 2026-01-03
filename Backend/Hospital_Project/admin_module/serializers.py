from rest_framework import serializers
from .models import AdminProfile

class AdminProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = AdminProfile
        fields = [
            'id', 'full_name', 'email', 'phone', 'designation', 'department', 'specialist',
            'consultation_duration_minutes', 'consultation_fee', 'contract_type', 'work_shift',
            'work_location', 'merital_status', 'basic_salary', 'gender', 'date_of_birth',
            'current_address', 'permanent_address', 'bio', 'blood_group', 'emergency_contact',
            'profile_picture', 'qualifications', 'experience_years', 'created_at', 'updated_at',
            'socia_media_links', 'staff_id', 'father_name', 'mother_name', 'date_of_joining',
            'pan_number', 'national_id', 'local_id', 'reference_contact', 'epf_no',
            'date_of_leaving', 'casual_leave', 'privilege_leave', 'sick_leave', 'maternity_leave',
            'paternity_leave', 'fever_leave', 'account_title', 'bank_account_number', 'bank_name',
            'ifsc_code', 'bank_branch_name', 'first_name', 'last_name'
        ]
        extra_kwargs = {
            'date_of_birth': {'required': False, 'allow_null': True},
            'date_of_joining': {'required': False, 'allow_null': True},
            'date_of_leaving': {'required': False, 'allow_null': True},
            'designation': {'required': False},
            'department': {'required': False},
            'specialist': {'required': False},
            'contract_type': {'required': False},
            'work_shift': {'required': False},
            'work_location': {'required': False},
            'merital_status': {'required': False},
            'basic_salary': {'required': False},
            'gender': {'required': False},
            'current_address': {'required': False},
            'permanent_address': {'required': False},
            'bio': {'required': False},
            'blood_group': {'required': False},
            'emergency_contact': {'required': False},
            'profile_picture': {'required': False},
            'qualifications': {'required': False},
            'experience_years': {'required': False},
            'socia_media_links': {'required': False},
            'staff_id': {'required': False},
            'father_name': {'required': False},
            'mother_name': {'required': False},
            'pan_number': {'required': False},
            'national_id': {'required': False},
            'local_id': {'required': False},
            'reference_contact': {'required': False},
            'epf_no': {'required': False},
            'casual_leave': {'required': False},
            'privilege_leave': {'required': False},
            'sick_leave': {'required': False},
            'maternity_leave': {'required': False},
            'paternity_leave': {'required': False},
            'fever_leave': {'required': False},
            'account_title': {'required': False},
            'bank_account_number': {'required': False},
            'bank_name': {'required': False},
            'ifsc_code': {'required': False},
            'bank_branch_name': {'required': False},
        }

    def get_full_name(self, obj):
        return obj.user.full_name
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_phone(self, obj):
        return obj.user.phone

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        
        # Update user name if provided
        if first_name is not None or last_name is not None:
            user = instance.user
            full_name = f"{first_name or ''} {last_name or ''}".strip()
            if full_name:
                user.full_name = full_name
                user.save()
        
        return super().update(instance, validated_data)