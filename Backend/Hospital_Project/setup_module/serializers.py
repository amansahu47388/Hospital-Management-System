from rest_framework import serializers
from .models import Bed, HospitalCharges, Symptom
import uuid



class BedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = [
            'bed_name', 'bed_type', 'bed_group','status', 'floor',
        ]