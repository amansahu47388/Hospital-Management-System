from rest_framework import serializers
from .models import Ambulance, AmbulanceBill, AmbulanceBillTransaction

class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = [
            'id', 'vehicle_number', 'vehicle_model', 'year_made',
            'driver_name', 'driver_license', 'driver_contact',
            'vehicle_type', 'note', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AmbulanceCreateSerializer(serializers.ModelSerializer):
    # Map camelCase frontend fields to snake_case model fields
    vehicleNumber = serializers.CharField(write_only=True)
    vehicleModel = serializers.CharField(write_only=True)
    yearMade = serializers.CharField(write_only=True, required=False, allow_blank=True)  # Accept as string, convert to int
    driverName = serializers.CharField(write_only=True, required=False, allow_blank=True)
    driverLicense = serializers.CharField(write_only=True, required=False, allow_blank=True)
    driverContact = serializers.CharField(write_only=True, required=False, allow_blank=True)
    vehicleType = serializers.ChoiceField(
        choices=[('Owned', 'Owned'), ('Contractual', 'Contractual')],
        write_only=True
    )
    note = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Ambulance
        fields = [
            'vehicleNumber', 'vehicleModel', 'yearMade',
            'driverName', 'driverLicense', 'driverContact',
            'vehicleType', 'note'
        ]

    def create(self, validated_data):
        # Convert camelCase to snake_case for model creation
        year_made_value = validated_data.pop('yearMade', None)
        model_data = {
            'vehicle_number': validated_data.pop('vehicleNumber'),
            'vehicle_model': validated_data.pop('vehicleModel'),
            'year_made': int(year_made_value) if year_made_value and year_made_value.strip() else None,  # Convert string to int or None
            'driver_name': validated_data.pop('driverName') or None,
            'driver_license': validated_data.pop('driverLicense') or None,
            'driver_contact': validated_data.pop('driverContact') or None,
            'vehicle_type': validated_data.pop('vehicleType'),
            'note': validated_data.pop('note') or None,
            'created_by': self.context['request'].user
        }
        return Ambulance.objects.create(**model_data)


class AmbulanceUpdateSerializer(serializers.ModelSerializer):
    # Map camelCase frontend fields to snake_case model fields
    vehicleNumber = serializers.CharField(write_only=True)
    vehicleModel = serializers.CharField(write_only=True)
    yearMade = serializers.CharField(write_only=True, required=False, allow_blank=True)  # Accept as string, convert to int
    driverName = serializers.CharField(write_only=True, required=False, allow_blank=True)
    driverLicense = serializers.CharField(write_only=True, required=False, allow_blank=True)
    driverContact = serializers.CharField(write_only=True, required=False, allow_blank=True)
    vehicleType = serializers.ChoiceField(
        choices=[('Owned', 'Owned'), ('Contractual', 'Contractual')],
        write_only=True
    )
    note = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Ambulance
        fields = [
            'vehicleNumber', 'vehicleModel', 'yearMade',
            'driverName', 'driverLicense', 'driverContact',
            'vehicleType', 'note'
        ]

    def update(self, instance, validated_data):
        # Convert camelCase to snake_case for model update
        instance.vehicle_number = validated_data.get('vehicleNumber', instance.vehicle_number)
        instance.vehicle_model = validated_data.get('vehicleModel', instance.vehicle_model)
        year_made_value = validated_data.get('yearMade')
        instance.year_made = int(year_made_value) if year_made_value and year_made_value.strip() else None  # Convert string to int or None
        instance.driver_name = validated_data.get('driverName') or None
        instance.driver_license = validated_data.get('driverLicense') or None
        instance.driver_contact = validated_data.get('driverContact') or None
        instance.vehicle_type = validated_data.get('vehicleType', instance.vehicle_type)
        instance.note = validated_data.get('note') or None
        instance.save()
        return instance


class AmbulanceBillListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    ambulance_number = serializers.CharField(source='ambulance.vehicle_number', read_only=True)
    ambulance_model = serializers.CharField(source='ambulance.vehicle_model', read_only=True)
    driver_name = serializers.CharField(source='ambulance.driver_name', read_only=True)
    driver_contact = serializers.CharField(source='ambulance.driver_contact', read_only=True)
    charge_name = serializers.SerializerMethodField()
    patient_address = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)
    
    def get_charge_name(self, obj):
        if obj.hospital_charge:
            return obj.hospital_charge.charge_name
        return None
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}".strip()

    def get_patient_address(self, obj):
        return obj.patient.address if obj.patient else None
    case_id = serializers.SerializerMethodField()

    def get_case_id(self, obj):
        if obj.case:
            return obj.case.case_id
        return "-"

    class Meta:
        model = AmbulanceBill
        fields = [
            'id', 'patient_id', 'patient_name', 'case_id', 'ambulance_number', 
            'ambulance_model', 'driver_name', 'driver_contact', 'charge_name',
            'date', 'total_amount', 'discount', 'tax', 'net_amount', 'patient_address',
            'paid_amount', 'balance', 'payment_mode', 'created_by_name', 'created_at'
        ]


class AmbulanceBillDetailSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    patient_phone = serializers.CharField(source='patient.phone', read_only=True)
    ambulance_details = serializers.SerializerMethodField()
    charge_details = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)
    case_id = serializers.SerializerMethodField()

    def get_case_id(self, obj):
        if obj.case:
            return obj.case.case_id
        return "-"

    def get_ambulance_details(self, obj):
        if obj.ambulance:
            return {
                'vehicle_number': obj.ambulance.vehicle_number,
                'vehicle_model': obj.ambulance.vehicle_model,
                'driver_name': obj.ambulance.driver_name,
                'driver_contact': obj.ambulance.driver_contact,
            }
        return None

    def get_charge_details(self, obj):
        if obj.hospital_charge:
            return {
                'category': obj.hospital_charge.charge_category,
                'charge_name': obj.hospital_charge.charge_name,
                'standard_charge': obj.hospital_charge.charge_amount,
                'tax': obj.hospital_charge.tax,
            }
        return None

   

    class Meta:
        model = AmbulanceBill
        fields = [
            'id', 'patient_name', 'patient_phone', 'case_id', 'ambulance_details',
            'charge_details', 'date', 'note', 'payment_mode', 'total_amount',
            'discount', 'tax', 'net_amount', 'paid_amount', 'balance',
            'created_by_name', 'created_at'
        ]


class AmbulanceBillCreateSerializer(serializers.ModelSerializer):
    hospital_charge = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    
    class Meta:
        model = AmbulanceBill
        fields = [
            'patient', 'case', 'ambulance','hospital_charge', 'date', 'note',
            'payment_mode', 'total_amount', 'discount', 'tax', 'paid_amount'
        ]
        extra_kwargs = {
            'charge': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        # Ensure either charge or hospital_charge is provided
        if not data.get('hospital_charge') and not data.get('charge'):
            raise serializers.ValidationError({
                'hospital_charge': 'Either charge or hospital_charge must be provided.'
            })
        return data

    def create(self, validated_data):
        hospital_charge_id = validated_data.pop('hospital_charge', None)
        if hospital_charge_id:
            from setup_module.models import HospitalCharges
            try:
                hospital_charge = HospitalCharges.objects.get(id=hospital_charge_id)
                validated_data['hospital_charge'] = hospital_charge
            except HospitalCharges.DoesNotExist:
                raise serializers.ValidationError({
                    'hospital_charge': f'Hospital charge with id {hospital_charge_id} does not exist.'
                })
        
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AmbulanceBillUpdateSerializer(serializers.ModelSerializer):
    hospital_charge = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    
    class Meta:
        model = AmbulanceBill
        fields = [
            'patient', 'case', 'ambulance', 'charge', 'hospital_charge', 'date', 'note',
            'payment_mode', 'total_amount', 'discount', 'tax', 'paid_amount'
        ]

    def update(self, instance, validated_data):
        hospital_charge_id = validated_data.pop('hospital_charge', None)
        if hospital_charge_id is not None:
            from setup_module.models import HospitalCharges
            try:
                hospital_charge = HospitalCharges.objects.get(id=hospital_charge_id)
                instance.hospital_charge = hospital_charge
            except HospitalCharges.DoesNotExist:
                instance.hospital_charge = None
        
        return super().update(instance, validated_data)

        
class AmbulanceBillDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceBill
        fields = "__all__"


class AmbulanceBillTransactionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    payment_mode_display = serializers.CharField(source='get_payment_mode_display', read_only=True)
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() if hasattr(obj.created_by, 'get_full_name') else obj.created_by.email
        return None

    class Meta:
        model = AmbulanceBillTransaction
        fields = [
            'id', 'transaction_id', 'bill', 'date', 'payment_mode', 
            'payment_mode_display', 'amount', 'note', 'created_by_name', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']


class AmbulanceBillTransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceBillTransaction
        fields = ['bill', 'date', 'payment_mode', 'amount', 'note']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

        
