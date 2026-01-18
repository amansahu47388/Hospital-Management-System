from rest_framework import serializers
from .models import *


class IncomeHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeHead
        fields = "__all__"


class ExpenseHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHead
        fields = "__all__"


class IncomeSerializer(serializers.ModelSerializer):
    income_head_name = serializers.CharField(source="income_head.name",read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Income
        fields = "__all__"
        read_only_fields = ("created_by",)

    def get_created_by_name(self, obj):
        user = obj.created_by
        if not user:
            return None
        full_name = f"{user.full_name}".strip()

        # agar full name available hai
        if full_name:
            return full_name

        # fallback
        return user.email

    
class ExpenseSerializer(serializers.ModelSerializer):
    expense_head_name = serializers.CharField(
        source="expense_head.name",
        read_only=True
    )
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = ("created_by",)

    def get_created_by_name(self, obj):
        user = obj.created_by
        if not user:
            return None

        full_name = f"{user.full_name}".strip()
        return full_name if full_name else user.email
