from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *



class IncomeHeadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = IncomeHead.objects.all()
        serializer = IncomeHeadSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IncomeHeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ExpenseHeadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = ExpenseHead.objects.all()
        serializer = ExpenseHeadSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseHeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class IncomeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            income = get_object_or_404(Income, pk=pk)
            serializer = IncomeSerializer(income)
            return Response(serializer.data)
        else:
            incomes = Income.objects.all().order_by("-created_at")
            serializer = IncomeSerializer(incomes, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        income = get_object_or_404(Income, pk=pk)
        serializer = IncomeSerializer(income, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        income = get_object_or_404(Income, pk=pk)
        income.delete()
        return Response(
            {"message": "Income deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )




class ExpenseAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            expense = get_object_or_404(Expense, pk=pk)
            serializer = ExpenseSerializer(expense)
            return Response(serializer.data)
        else:
            expenses = Expense.objects.all().order_by("-created_at")
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        expense = get_object_or_404(Expense, pk=pk)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        expense = get_object_or_404(Expense, pk=pk)
        expense.delete()
        return Response(
            {"message": "Expense deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )




