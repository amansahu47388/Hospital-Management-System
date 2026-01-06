from rest_framework import serializers
from .models import (
    RadiologyTest,
    RadiologyParameter,
    RadiologyCategory
)


class RadiologyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RadiologyCategory
        fields = ["id", "category_name"]


class RadiologyParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadiologyParameter
        fields = ["parameter_name", "reference_range", "unit"]


class RadiologyTestCreateSerializer(serializers.ModelSerializer):
    parameters = RadiologyParameterSerializer(many=True)

    class Meta:
        model = RadiologyTest
        fields = [
            "test_name", "short_name", "test_type", "category",
            "sub_category", "method", "report_days", "charges", "tax",
            "standard_charge", "total_amount", "parameters"
        ]

    def create(self, validated_data):
        parameters_data = validated_data.pop("parameters")
        test = RadiologyTest.objects.create(**validated_data)

        for param in parameters_data:
            RadiologyParameter.objects.create(
                radiology_test=test,
                **param
            )
        return test


class RadiologyTestListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    charge_name = serializers.CharField(source="charges.charge_name", read_only=True)
    parameters = RadiologyParameterSerializer(many=True, read_only=True)

    class Meta:
        model = RadiologyTest
        fields = [
            "id", "test_name", "short_name", "test_type",
            "category_name", "sub_category", "method",
            "report_days", "tax", "standard_charge",
            "total_amount", "charge_name", "parameters"
        ]


class RadiologyTestUpdateSerializer(RadiologyTestCreateSerializer):
    def update(self, instance, validated_data):
        parameters_data = validated_data.pop("parameters")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.parameters.all().delete()
        for param in parameters_data:
            RadiologyParameter.objects.create(
                radiology_test=instance,
                **param
            )
        return instance
