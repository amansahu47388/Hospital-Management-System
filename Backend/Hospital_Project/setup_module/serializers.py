from rest_framework import serializers
from .models import Bed
import uuid
from .models import *


#***********************************************************************************#
#                     HOSPITAL CHARGE SETUP SERIALIZERS                                #
#***********************************************************************************#

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




#***********************************************************************************#
#                     HOSPITAL BED SETUP SERIALIZERS                                #
#***********************************************************************************#

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = "__all__"


class BedTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BedType
        fields = "__all__"


class BedGroupSerializer(serializers.ModelSerializer):
    floor_name = serializers.CharField(source="floor.floor_name", read_only=True)
    bed_type_name = serializers.CharField(source="bed_type.bad_type", read_only=True)

    class Meta:
        model = BedGroup
        fields = "__all__"


class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = "__all__"




#***********************************************************************************#
#                     OPERATIONS SETUP SERIALIZERS                                  #
#***********************************************************************************#

class OperationSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationSetup
        fields = "__all__"

    def validate_name(self, value):
        return value.strip()




       
#***********************************************************************************#
#                     SYMPTOM SETUP SERIALIZERS                                  #
#***********************************************************************************#

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = "__all__"





















class BedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = [
            'bed_name', 'bed_type', 'bed_group','status', 'floor',
        ]



#***********************************************************************************#
#                     FINDING SETUP SERIALIZERS                                     #
#***********************************************************************************#

class FindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finding
        fields = "__all__"




#***********************************************************************************#
#                     VITAL SETUP SERIALIZERS                                       #
#***********************************************************************************#

class VitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = "__all__"

# For backward compatibility with views using "VitalsSerializer"
VitalsSerializer = VitalSerializer
