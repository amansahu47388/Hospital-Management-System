from rest_framework import serializers
from .models import Ambulance, AmbulanceChargeCategory, AmbulanceCharge, AmbulanceBill


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


class AmbulanceChargeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceChargeCategory
        fields = ['id', 'category_name']


class AmbulanceChargeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)

    class Meta:
        model = AmbulanceCharge
        fields = [
            'id', 'category', 'category_name', 'charge_name',
            'standard_charge', 'description', 'created_at'
        ]


class AmbulanceChargeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceCharge
        fields = ['category', 'charge_name', 'standard_charge', 'description']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AmbulanceBillListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    ambulance_number = serializers.CharField(source='ambulance.vehicle_number', read_only=True)
    charge_name = serializers.CharField(source='charge.charge_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)

    class Meta:
        model = AmbulanceBill
        fields = [
            'id', 'bill_no', 'patient_name', 'ambulance_number', 'charge_name',
            'date', 'total_amount', 'discount', 'tax', 'net_amount',
            'paid_amount', 'balance', 'payment_mode', 'created_by_name', 'created_at'
        ]


class AmbulanceBillDetailSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    patient_phone = serializers.CharField(source='patient.phone', read_only=True)
    ambulance_details = serializers.SerializerMethodField()
    charge_details = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)

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
        if obj.charge:
            return {
                'category': obj.charge.category.category_name,
                'charge_name': obj.charge.charge_name,
                'standard_charge': obj.charge.standard_charge,
            }
        return None

    class Meta:
        model = AmbulanceBill
        fields = [
            'id', 'bill_no', 'patient_name', 'patient_phone', 'ambulance_details',
            'charge_details', 'date', 'note', 'payment_mode', 'total_amount',
            'discount', 'tax', 'net_amount', 'paid_amount', 'balance',
            'created_by_name', 'created_at'
        ]


class AmbulanceBillCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceBill
        fields = [
            'patient', 'ambulance', 'charge', 'date', 'note',
            'payment_mode', 'total_amount', 'discount', 'tax', 'paid_amount'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AmbulanceBillUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceBill
        fields = [
            'patient', 'ambulance', 'charge', 'date', 'note',
            'payment_mode', 'total_amount', 'discount', 'tax', 'paid_amount'
        ]