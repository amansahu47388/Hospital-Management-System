from rest_framework import serializers
from .models import PathologyTest, PathologyParameter, PathologyCategory


class PathologyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyCategory
        fields = ["id", "category_name"]


class PathologyParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyParameter
        fields = ["parameter_name", "reference_range", "unit"]

    def validate_reference_range(self, value):
        if not value:
            raise serializers.ValidationError("Reference range is required")
        return value


class PathologyTestCreateSerializer(serializers.ModelSerializer):
    parameters = PathologyParameterSerializer(many=True)

    class Meta:
        model = PathologyTest
        fields = ["id", "test_name", "short_name", "test_type", "category", "sub_category", "method", "report_days", "charges", "tax",
            "standard_charge", "total_amount", "parameters",
        ]

    def create(self, validated_data):
        parameters_data = validated_data.pop("parameters")

        pathology_test = PathologyTest.objects.create(**validated_data)

        for param in parameters_data:
            PathologyParameter.objects.create(
                pathology_test=pathology_test,
                parameter_name=param["parameter_name"],
                reference_range=param["reference_range"],
                unit=param["unit"],
            )

        return pathology_test
    

class PathologyParameterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathologyParameter
        fields = ["parameter_name", "reference_range", "unit"]
    

class PathologyTestListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    charge_name = serializers.CharField(source="charges.charge_name", read_only=True)
    charge_category = serializers.CharField(source="charges.charge_category", read_only=True)
    parameters = PathologyParameterNestedSerializer(many=True, read_only=True)

    class Meta:
        model = PathologyTest
        fields = [ "id", "test_name", "short_name", "test_type", "charge_category", "category_name", "sub_category", "method", "report_days",
            "tax", "standard_charge", "total_amount", "charge_name","parameters"
        ]


class PathologyTestUpdateSerializer(serializers.ModelSerializer):
    parameters = PathologyParameterSerializer(many=True)

    class Meta:
        model = PathologyTest
        fields = ["test_name","short_name","test_type","category","sub_category","method","report_days","charges",
            "tax", "standard_charge", "total_amount", "parameters",
        ]
    def update(self, instance, validated_data):
        parameters_data = validated_data.pop("parameters")

        # Update main test fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Remove old parameters
        instance.parameters.all().delete()
        # Recreate parameters
        for param in parameters_data:
            PathologyParameter.objects.create(
                pathology_test=instance,
                parameter_name=param["parameter_name"],
                reference_range=param["reference_range"],
                unit=param["unit"],
            )

        return instance
