import logging
from rest_framework import serializers
from .models import Patient
from datetime import date

logger = logging.getLogger(__name__)

class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', 
        read_only=True, 
        required=False
    )
    gender = serializers.CharField(source='get_gender_display_value', read_only=True)
    blood_group = serializers.CharField(source='get_blood_group_display_value', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'photo',
            'address',
            'city',
            'state',
            'zip_code',
            'date_of_birth',
            'age',
            'gender',
            'blood_group',
            'medical_history',
            'allergies',
            'emergency_contact_name',
            'emergency_contact_phone',
            'created_by_name',
            'created_at',
            'updated_at',
            'is_active',
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

class PatientCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'photo',
            'address',
            'city',
            'state',
            'zip_code',
            'date_of_birth',
            'gender',
            'blood_group',
            'medical_history',
            'allergies',
            'emergency_contact_name',
            'emergency_contact_phone',
        ]

    def validate_first_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters.")
        return value.strip()

    def validate_last_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters.")
        return value.strip()

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        value = value.lower().strip()
        
        if self.instance is None:
            if Patient.objects.filter(email=value).exists():
                raise serializers.ValidationError("Patient with this email already exists.")
        else:
            if Patient.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Patient with this email already exists.")
        return value

    def validate_phone(self, value):
        if not value:
            raise serializers.ValidationError("Phone is required.")
        
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 10:
            raise serializers.ValidationError("Phone must have at least 10 digits.")
        return value

    def validate_address(self, value):
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("Address must be at least 5 characters.")
        return value.strip()

    def validate_city(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("City is required.")
        return value.strip()

    def validate_state(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("State is required.")
        return value.strip()

    def validate_zip_code(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Zip code is required.")
        return value.strip()

    def validate_emergency_contact_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Emergency contact name is required.")
        return value.strip()

    def validate_emergency_contact_phone(self, value):
        if not value:
            raise serializers.ValidationError("Emergency contact phone is required.")
        
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 10:
            raise serializers.ValidationError("Emergency contact phone must have at least 10 digits.")
        return value

    def validate_date_of_birth(self, value):
        if not value:
            raise serializers.ValidationError("Date of birth is required.")
        
        today = date.today()
        
        # Check if date is in future
        if value > today:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        # Calculate age
        age = today.year - value.year
        if (today.month, today.day) < (value.month, value.day):
            age -= 1
        
        # Check reasonable age range
        if age > 150:
            raise serializers.ValidationError("Please enter a valid date of birth.")
        if age < 0:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        return value

    def validate_gender(self, value):
        if value not in ['M', 'F', 'O']:
            raise serializers.ValidationError("Invalid gender choice.")
        return value

    def validate_blood_group(self, value):
        valid_groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
        if value not in valid_groups:
            raise serializers.ValidationError("Invalid blood group choice.")
        return value

    def create(self, validated_data):
        logger.info(f"Creating patient with validated data: {validated_data}")
        try:
            validated_data['created_by'] = self.context['request'].user
            patient = Patient.objects.create(**validated_data)
            logger.info(f"Patient created: {patient.id} - Age: {patient.age}")
            return patient
        except Exception as e:
            logger.error(f"Error creating patient: {str(e)}", exc_info=True)
            raise

    def update(self, instance, validated_data):
        logger.info(f"Updating patient {instance.id}")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        logger.info(f"Patient {instance.id} updated - Age: {instance.age}")
        return instance