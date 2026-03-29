from django.db import models
from users.models import User


class IncomeHead(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name



class ExpenseHead(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Income(models.Model):
    name = models.CharField(max_length=255)
    income_head = models.ForeignKey(IncomeHead, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='incomes_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.amount}"



class Expense(models.Model):
    name = models.CharField(max_length=255)
    expense_head = models.ForeignKey(ExpenseHead, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='expenses_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.amount}"
    
