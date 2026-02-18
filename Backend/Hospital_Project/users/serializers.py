from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import User
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    patient_id = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'is_active', 'is_staff', 'is_superuser', 'created_at', 'patient_id', 'profile_picture']
    
    def get_patient_id(self, obj):
        """Return patient ID if user has a patient profile"""
        patient_profile = getattr(obj, 'patient_profile', None)
        if patient_profile:
            return patient_profile.id
        return None

    def get_full_name(self, obj):
        """Return full name from Patient model if patient, else from User model"""
        patient_profile = getattr(obj, 'patient_profile', None)
        if patient_profile:
            return patient_profile.full_name
        return obj.full_name

    def get_profile_picture(self, obj):
        """Return profile picture URL from AdminProfile or Patient profile"""
        request = self.context.get('request')
        image_url = None

        # Check Admin Profile first (for staff/doctors)
        admin_profile = getattr(obj, 'admin_profile', None)
        if admin_profile and admin_profile.profile_picture:
            image_url = admin_profile.profile_picture.url
        
        # Check Patient Profile (for patients)
        if not image_url:
            patient_profile = getattr(obj, 'patient_profile', None)
            if patient_profile and patient_profile.photo:
                image_url = patient_profile.photo.url
        
        if image_url:
            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None

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
        choices=['admin', 'doctor', 'accountant', 'pharmacist','receptionist', 'pathologist', 'radiologist', 'nurse'],
        default='nurse'
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
        """Validate phone number - allow empty/null"""
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError("Phone must have at least 10 digits")
        return value or None

    def create(self, validated_data):
        """Create admin user with specified role"""
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'admin')
        
        # Get is_staff and is_superuser from context (passed by view)
        is_staff = self.context.get('is_staff', True)  # Default to True for admins
        is_superuser = self.context.get('is_superuser', False)  # Default to False
        
        # Ensure phone is None if empty
        phone = validated_data.get('phone')
        phone = phone.strip() if phone else None
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            full_name=validated_data['full_name'],
            phone=phone,
            role=role,
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        
        print(f"✅ Admin user created: {user.email}, Role: {role}, Staff: {is_staff}, Superuser: {is_superuser}")
        return user

# ==================== STAFF MANAGEMENT SERIALIZERS ====================

class StaffCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating staff members by admin"""
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists")]
    )
    role = serializers.ChoiceField(
        choices=['doctor', 'accountant', 'pharmacist', 'receptionist', 'pathologist', 'radiologist', 'nurse'],
        required=True
    )
    department = serializers.CharField(required=False, allow_blank=True)
    send_invitation = serializers.BooleanField(default=True, write_only=True)
    
    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'role', 'department', 'send_invitation']
    
    def validate_phone(self, value):
        """Validate phone number"""
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError("Phone must have at least 10 digits")
        return value or None
    
    def create(self, validated_data):
        """Create staff user with temporary password"""
        import secrets
        import string
        
        # Remove non-model fields
        send_invitation = validated_data.pop('send_invitation', True)
        department = validated_data.pop('department', '')
        
        # Generate temporary password
        alphabet = string.ascii_letters + string.digits + "!@#$%"
        temp_password = ''.join(secrets.choice(alphabet) for i in range(12))
        
        # Get the admin who is creating this user
        request = self.context.get('request')
        created_by = request.user if request and request.user.is_authenticated else None
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=temp_password,
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone'),
            role=validated_data['role'],
            is_staff=True,
            is_superuser=False,
            is_first_login=True,
            created_by=created_by
        )
        
        # Store temp password for email (attach to user object temporarily)
        user._temp_password = temp_password
        user._send_invitation = send_invitation
        user._department = department
        
        print(f"✅ Staff user created: {user.email}, Role: {user.role}, Temp Password: {temp_password}")
        return user

class StaffListSerializer(serializers.ModelSerializer):
    """Serializer for listing staff members"""
    created_by_name = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'role', 
            'is_active', 'is_first_login', 'created_at', 
            'password_changed_at', 'created_by_name', 'department'
        ]
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name if obj.created_by else "System"
    
    def get_department(self, obj):
        """Get department from AdminProfile if exists"""
        if hasattr(obj, 'admin_profile') and obj.admin_profile:
            return obj.admin_profile.department
        return ""

class StaffUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating staff details"""
    
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'role', 'is_active']
    
    def validate_phone(self, value):
        if value:
            value = value.strip()
            if len(value) < 10:
                raise serializers.ValidationError("Phone must have at least 10 digits")
        return value or None

class FirstLoginPasswordChangeSerializer(serializers.Serializer):
    """Serializer for first-time password change"""
    temporary_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        
        # Validate password strength
        try:
            validate_password(data['new_password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return data
