from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "is_active",
            "is_staff",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["email", "full_name", "password", "phone"]

    def create(self, validated_data):
        validated_data["phone"] = validated_data.get("phone") or None
        validated_data["role"] = "patient"  # default role for normal users
        return User.objects.create_user(**validated_data)


class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["email", "full_name", "password", "role", "phone"]

    def validate_role(self, value):
        valid_roles = [r[0] for r in User.ROLE_CHOICES]
        if value not in valid_roles:
            raise serializers.ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        return value

    def create(self, validated_data):
        phone = validated_data.get("phone") or None
        role = validated_data.get("role", "admin")
        validated_data["phone"] = phone
        # admin-created accounts are staff; superuser only if role == 'admin'
        is_staff = True
        is_superuser = True if role == "admin" else False
        return User.objects.create_user(is_staff=is_staff, is_superuser=is_superuser, **validated_data)
