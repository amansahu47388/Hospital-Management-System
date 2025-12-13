from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "full_name", "email", "phone", "guardian_name", "age", "gender", "address", "disease", "dead", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request", None)
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required to create a patient")
        # link patient to the authenticated user by default
        validated_data["user"] = request.user
        # provide flexibility: if payload includes full_name from UI
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # ensure user field remains consistent
        validated_data.pop("user", None)
        return super().update(instance, validated_data)