from rest_framework import serializers
from .models import Bed
import uuid
from .models import *



class ChargeUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargeUnit
        fields = "__all__"

class ChargeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargeType
        fields = "__all__"

class ChargeCategorySerializer(serializers.ModelSerializer):
    charge_type_name = serializers.CharField(
        source="charge_type.charge_type",
        read_only=True
    )

    class Meta:
        model = ChargeCategory
        fields = "__all__"

class ChargeTaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargeTax
        fields = "__all__"


class HospitalChargesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalCharges
        fields = "__all__"










class BedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = [
            'bed_name', 'bed_type', 'bed_group','status', 'floor',
        ]


