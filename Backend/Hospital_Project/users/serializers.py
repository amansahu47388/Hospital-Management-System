from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email","first_name","last_name","role"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'phone', 'full_name', 'role', 'password')

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            phone=validated_data['phone'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            password=validated_data['password']
        )
