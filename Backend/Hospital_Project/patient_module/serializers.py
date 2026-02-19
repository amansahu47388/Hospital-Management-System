import logging
import os
from rest_framework import serializers
from .models import *
from datetime import date


logger = logging.getLogger(__name__)





#*******************************************************************************************************#
#                            Patient Serializer
#*******************************************************************************************************#

class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', 
        read_only=True, 
        required=False
    )
    gender = serializers.CharField(source='get_gender_display_value', read_only=True)
    blood_group = serializers.CharField(source='get_blood_group_display_value', read_only=True)

    is_admitted = serializers.SerializerMethodField()
    is_active_opd = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id','first_name', 'last_name', 'full_name', 'email', 'phone', 'address', 'city', 
        'state', 'zip_code', 'date_of_birth', 'age', 'gender', 'blood_group', 'medical_history', 'allergies',
         'emergency_contact_name', 'emergency_contact_phone', 'photo', 'created_by_name', 'created_at', 'updated_at', 'is_active',
         'is_admitted', 'is_active_opd'
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'full_name',
            'age',
            'created_by_name',
            'gender',
            'blood_group'
        ]

    def get_full_name(self, obj):
        """Get full name"""
        return obj.full_name

    def get_age(self, obj):
        """Calculate and return age"""
        if not obj.date_of_birth:
            return 0
        
        today = date.today()
        try:
            age = today.year - obj.date_of_birth.year
            
            if (today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day):
                age -= 1
            
            return max(0, age)
        except (ValueError, TypeError):
            return 0

    def get_photo(self, obj):
        """Return relative URL for photo"""
        if obj.photo:
            return obj.photo.url
        return None

    def get_is_admitted(self, obj):
        from opd_ipd_module.models import IpdPatient
        return IpdPatient.objects.filter(patient=obj, is_discharged=False).exists()

    def get_is_active_opd(self, obj):
        from opd_ipd_module.models import OpdPatient
        return OpdPatient.objects.filter(patient=obj, appointment_date__date=date.today()).exists()

class PatientCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating patients"""
    gender = serializers.CharField(required=False)
    send_invitation = serializers.BooleanField(default=True, write_only=True)
    
    class Meta:
        model = Patient
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state',
            'zip_code', 'date_of_birth', 'gender', 'blood_group', 'medical_history', 'allergies',
              'emergency_contact_name', 'emergency_contact_phone', 'photo', 'send_invitation'
        ]
        extra_kwargs = {
            'last_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'phone': {'required': False, 'allow_blank': True, 'allow_null': True},
            'address': {'required': False, 'allow_blank': True, 'allow_null': True},
            'date_of_birth': {'required': False, 'allow_null': True},
        }

    def validate_first_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters.")
        return value.strip()

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        value = value.lower().strip()
        
        if self.instance is None:
            if Patient.objects.filter(email=value, is_active=True).exists():
                raise serializers.ValidationError("Patient with this email already exists.")
            # Also check User table to prevent silent failures in user creation
            from users.models import User
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists in the system.")
        else:
            if Patient.objects.filter(email=value, is_active=True).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Patient with this email already exists.")
        
        return value

    def validate_phone(self, value):
        if not value:
            return None
        
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 10:
            raise serializers.ValidationError("Phone must have at least 10 digits.")
        return value

    def validate_address(self, value):
        if not value:
            return None
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Address must be at least 5 characters.")
        return value.strip()

    def validate_date_of_birth(self, value):
        if not value:
            return None
        
        today = date.today()
        
        if value > today:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        age = today.year - value.year
        if (today.month, today.day) < (value.month, value.day):
            age -= 1
        
        if age > 150:
            raise serializers.ValidationError("Please enter a valid date of birth.")
        if age < 0:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        return value

    def validate_gender(self, value):
        # Normalize shorthand to full words
        gender_map = {
            'M': 'Male',
            'F': 'Female',
            'O': 'Other',
            'm': 'Male',
            'f': 'Female',
            'o': 'Other'
        }
        normalized_value = gender_map.get(value, value)
        
        valid_genders = ['Male', 'Female', 'Other']
        if normalized_value not in valid_genders:
            raise serializers.ValidationError(f"Invalid gender choice. Must be one of {valid_genders}")
        return normalized_value
    

    def validate_blood_group(self, value):
        valid_groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
        if value not in valid_groups:
            raise serializers.ValidationError("Invalid blood group choice.")
        return value

    def validate_photo(self, value):
        """Validate photo file"""
        # If value is a string (existing photo URL), skip validation
        if isinstance(value, str):
            return value
        
        # If value is None or empty, allow it (photo is optional)
        if not value:
            return value
        
        # Only validate if it's an actual file upload
        if hasattr(value, 'size') and hasattr(value, 'content_type'):
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be less than 5MB.")
            
            # Check file type
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("File must be an image.")
        
        return value

    def create(self, validated_data):
        """Create a new patient with temporary password (similar to staff management)"""
        import secrets
        import string
        
        logger.info(f"Creating new patient")
        
        # Remove non-model fields
        send_invitation = validated_data.pop('send_invitation', True)
        
        try:
            # Extract photo if present (will be set separately)
            photo = validated_data.pop('photo', None)
            
            # Get the admin who is creating this patient
            request = self.context.get('request')
            created_by = request.user if request and request.user.is_authenticated else None
            
            # Generate temporary password (same pattern as staff)
            alphabet = string.ascii_letters + string.digits + "!@#$%"
            temp_password = ''.join(secrets.choice(alphabet) for i in range(12))
            
            # Create Patient record
            validated_data['created_by'] = created_by
            
            # Add photo back if it was present
            if photo:
                validated_data['photo'] = photo
            
            patient = Patient.objects.create(**validated_data)
            
            # Store temp password and send_invitation flag for view to use
            patient._temp_password = temp_password
            patient._send_invitation = send_invitation
            
            logger.info(f"✅ Patient created: ID={patient.id}, Name={patient.full_name}, Temp Password: {temp_password}")
            
            return patient
        except Exception as e:
            logger.error(f"❌ Error creating patient: {str(e)}", exc_info=True)
            raise serializers.ValidationError(f"Error creating patient: {str(e)}")

    def update(self, instance, validated_data):
        """Update an existing patient"""
        logger.info(f"Updating patient ID={instance.id}")
        
        # Remove send_invitation if present (not needed for updates)
        validated_data.pop('send_invitation', None)
        
        try:
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            
            instance.save()
            logger.info(f"✅ Patient updated: ID={instance.id}")
            return instance
        except Exception as e:
            logger.error(f"❌ Error updating patient: {str(e)}", exc_info=True)
            raise serializers.ValidationError(f"Error updating patient: {str(e)}")
        


class PatientSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ("id", "first_name", "last_name", "phone", "email")


class PatientDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Patient
        fields = "__all__"






#*******************************************************************************************************#
#                            MedicalCase Serializer
#*******************************************************************************************************#

class MedicalCaseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = MedicalCase
        fields = '__all__'
        read_only_fields = ('case_id', 'created_by', 'created_at', 'updated_at')


#*******************************************************************************************************#
#                            PatientVital Serializer
#*******************************************************************************************************#

class PatientVitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientVital
        fields = "__all__"
        read_only_fields = ('created_by',)




#*******************************************************************************************************#
#                            Patient Operation Serializer
#*******************************************************************************************************#

class PatientOperationSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    operation_name = serializers.CharField(source='operation.name', read_only=True)
    operation_type = serializers.CharField(source='operation.operation_type', read_only=True)

    class Meta:
        model = PatientOperation
        fields = "__all__"
        read_only_fields = ('created_by',)


#*******************************************************************************************************#
#                            Patient ConsultantRegister Serializer
#*******************************************************************************************************#

class PatientConsultantSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)

    class Meta:
        model = PatientConsultant
        fields = "__all__"
        read_only_fields = ('created_by',)




#*******************************************************************************************************#
#                            Patient Charges Serializer
#*******************************************************************************************************#

class PatientChargesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientCharges
        fields = "__all__"
        read_only_fields = ('created_by',)



#*******************************************************************************************************#
#                            Patient Payment Serializer
#*******************************************************************************************************#

class PatientPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientPayment
        fields = "__all__"
        read_only_fields = ('created_by',)
