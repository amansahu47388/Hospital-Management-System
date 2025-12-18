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
        email = validated_data['email']
        full_name = validated_data['full_name']
        phone = validated_data.get('phone')
        
        user = User.objects.create_user(
            email=email,
            full_name=full_name,
            password=password,
            phone=phone,
            role='patient'
        )
        return user

class AdminRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists")]
    )
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(
        choices=['admin', 'doctor', 'accountant', 'pharmacist','receptionist', 'pathologist', 'radiologist', 'staff'],
        default='staff'
    )


    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'role']

    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value.lower()

    def validate_phone(self, value):
        """Validate phone number"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Phone must have at least 10 digits")
        return value

    def create(self, validated_data):
        """Create admin user with specified role"""
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'admin')
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            full_name=validated_data['full_name'],
            phone=validated_data['phone'],
            role=role,
            is_staff=True,  # All admins are staff
            is_superuser=False  # None are superuser by default
        )
        
        print(f"✅ Admin user created: {user.email}, Role: {role}")
        return user
