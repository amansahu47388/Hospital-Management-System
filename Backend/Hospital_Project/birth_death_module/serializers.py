from rest_framework import serializers
from .models import BirthRecord, DeathRecord


class BirthRecordSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    birth_date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = BirthRecord
        fields = [
            'id', 'reference_no', 'child_name', 'gender', 'weight',
            'birth_date', 'phone', 'address', 'case_id', 'mother_name',
            'father_name', 'report', 'child_photo', 'mother_photo',
            'father_photo', 'document_photo', 'created_by', 'created_by_name',
            'created_at', 'updated_at', 'birth_date_formatted'
        ]
        read_only_fields = ['id', 'reference_no', 'created_at', 'updated_at', 'created_by']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() if hasattr(obj.created_by, 'get_full_name') else str(obj.created_by)
        return None

    def get_birth_date_formatted(self, obj):
        if obj.birth_date:
            return obj.birth_date.strftime('%m/%d/%Y %I:%M %p')
        return None


class BirthRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthRecord
        fields = [
            'child_name', 'gender', 'weight', 'birth_date', 'phone',
            'address', 'case_id', 'mother_name', 'father_name', 'report',
            'child_photo', 'mother_photo', 'father_photo', 'document_photo'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class BirthRecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthRecord
        fields = [
            'child_name', 'gender', 'weight', 'birth_date', 'phone',
            'address', 'case_id', 'mother_name', 'father_name', 'report',
            'child_photo', 'mother_photo', 'father_photo', 'document_photo'
        ]


class DeathRecordSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    death_date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = DeathRecord
        fields = [
            'id', 'reference_no', 'case_id', 'patient_name', 'death_date',
            'guardian_name', 'report', 'attachment', 'created_by',
            'created_by_name', 'created_at', 'updated_at', 'death_date_formatted'
        ]
        read_only_fields = ['id', 'reference_no', 'created_at', 'updated_at', 'created_by']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() if hasattr(obj.created_by, 'get_full_name') else str(obj.created_by)
        return None

    def get_death_date_formatted(self, obj):
        if obj.death_date:
            return obj.death_date.strftime('%m/%d/%Y')
        return None


class DeathRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeathRecord
        fields = [
            'case_id', 'patient_name', 'death_date', 'guardian_name',
            'report', 'attachment'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class DeathRecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeathRecord
        fields = [
            'case_id', 'patient_name', 'death_date', 'guardian_name',
            'report', 'attachment'
        ]
