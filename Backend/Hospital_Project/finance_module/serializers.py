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
    income_head_name = serializers.CharField(source="income_head.name", read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Income
        fields = "__all__"
        read_only_fields = ("created_by",)

    def get_created_by_name(self, obj):
        if obj.created_by:
            return (
                obj.created_by.get_full_name()
                if hasattr(obj.created_by, "get_full_name")
                else obj.created_by.email
            )
        return None
    
class ExpenseSerializer(serializers.ModelSerializer):
    expense_head_name = serializers.CharField(source="expense_head.name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.full", read_only=True)

    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = ("created_by",)
