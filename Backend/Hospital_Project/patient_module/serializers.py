from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'address',
            'date_of_birth',
            'age',
            'guardian_name',
            'phone',
            'marital_status',
            'gender',
            'remark',
            'tpa',
            'tpa_id',
            'tpa_validity',
            'national_identification_number',
            'blood_group',
            'allergies',
            'created_by',
            'created_at',
            'updated_at',
            'is_active',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_name', 'age', 'created_by', 'national_identification_number']

class PatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
           'id',
            'full_name',
            'email',
            'phone',
            'address',
            'date_of_birth',
            'age',
            'guardian_name',
            'phone',
            'marital_status',
            'gender',
            'remark',
            'tpa',
            'tpa_id',
            'tpa_validity',
            'national_identification_number',
            'blood_group',
            'allergies',
            'created_by',
            'created_at',
            'updated_at',
            'is_active',
        ]

    def validate_email(self, value):
        if Patient.objects.filter(email=value).exists():
            raise serializers.ValidationError("A patient with this email already exists.")
        return value

    def validate_phone(self, value):
        if not value or len(value) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    def validate_date_of_birth(self, value):
        from datetime import date
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 0:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        if age > 150:
            raise serializers.ValidationError("Please enter a valid date of birth.")
        return value

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return Patient.objects.create(**validated_data)
    def update(self, instance, validated_data):
        validated_data.pop("user", None)
        return super().update(instance, validated_data)