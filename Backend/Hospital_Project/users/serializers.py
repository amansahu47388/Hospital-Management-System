from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import User
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'is_active', 'is_staff', 'is_superuser', 'created_at']

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists.")],
    )
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'phone', 'password')

    def validate_password(self, value):
        # First try Django's configured validators
        try:
            validate_password(value)
            return value
        except DjangoValidationError as e:
            # raise DRF ValidationError with django errors joined
            raise serializers.ValidationError(list(e.messages))

        # fallback checks — unreachable if validate_password works but left for clarity
        import re
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        # ensure optional phone becomes None if blank
        if 'phone' in validated_data and not validated_data['phone']:
            validated_data['phone'] = None

        password = validated_data.pop('password')
        validated_data['role'] = 'patient'
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class AdminRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists")]
    )
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'phone', 'password', 'role')

    def validate_password(self, value):
        try:
            validate_password(value)
            return value
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))

    def validate_role(self, value):
        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in valid_roles:
            raise serializers.ValidationError("Invalid role")
        return value

    def create(self, validated_data):
        if 'phone' in validated_data and not validated_data['phone']:
            validated_data['phone'] = None

        password = validated_data.pop('password')
        role = validated_data.get('role', 'admin')
        # allow callers (views) to override is_staff/is_superuser via kwargs
        is_staff = validated_data.pop('is_staff', True)
        is_superuser = validated_data.pop('is_superuser', True if role == 'admin' else False)
        validated_data['is_staff'] = is_staff
        validated_data['is_superuser'] = is_superuser
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
