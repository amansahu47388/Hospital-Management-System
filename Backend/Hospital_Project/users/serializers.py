from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'is_active', 'is_staff', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'phone']

    def create(self, validated_data):
        # Generate a default phone if not provided
        if not validated_data.get('phone'):
            validated_data['phone'] = f"0000000000"
        validated_data['role'] = 'patient'  # Default role for regular users
        return User.objects.create_user(**validated_data)


class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'role', 'phone']

    def validate_role(self, value):
        valid_roles = ['admin', 'doctor', 'pharmacist', 'pathologist', 'radiologist', 'accountant', 'receptionist', 'staff']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        return value

    def create(self, validated_data):
        if not validated_data.get('phone'):
            validated_data['phone'] = f"0000000000"
        validated_data['is_staff'] = True
        return User.objects.create_user(**validated_data)
