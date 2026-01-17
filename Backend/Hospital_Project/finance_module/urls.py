from django.urls import path
from .views import *

urlpatterns = [
    path("finance/incomehead/", IncomeHeadView.as_view(), name="incomehead"),

    
    path("finance/expensehead/", ExpenseHeadView.as_view(), name="expensehead"),


    path("finance/income/", IncomeAPI.as_view(), name="income"),
    path("finance/income/create/", IncomeAPI.as_view(), name="income-create"),
    path("finance/income/<int:pk>/update/", IncomeAPI.as_view(), name="income-updae"),
    path("finance/income/<int:pk>/details/", IncomeAPI.as_view(), name="income-details"),
    path("finance/income/<int:pk>/delete/", IncomeAPI.as_view(), name="income-delete"),

    path("finance/expense/", ExpenseAPI.as_view(), name="expense"),
    path("finance/expense/create/", ExpenseAPI.as_view(), name="expense-create"),
    path("finance/expense/<int:pk>/update/", ExpenseAPI.as_view(), name="expense-updae"),
    path("finance/expense/<int:pk>/details/", ExpenseAPI.as_view(), name="expense-details"),
    path("finance/expense/<int:pk>/delete/", ExpenseAPI.as_view(), name="expense-delete"),
]