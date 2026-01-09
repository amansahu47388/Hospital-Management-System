from django.contrib import admin
from .models import Ambulance, AmbulanceChargeCategory, AmbulanceCharge, AmbulanceBill


@admin.register(Ambulance)
class AmbulanceAdmin(admin.ModelAdmin):
    list_display = ['vehicle_number', 'vehicle_model', 'year_made', 'driver_name', 'vehicle_type', 'created_at']
    list_filter = ['vehicle_type', 'year_made', 'created_at']
    search_fields = ['vehicle_number', 'vehicle_model', 'driver_name']
    ordering = ['-created_at']


@admin.register(AmbulanceChargeCategory)
class AmbulanceChargeCategoryAdmin(admin.ModelAdmin):
    list_display = ['category_name']
    search_fields = ['category_name']


@admin.register(AmbulanceCharge)
class AmbulanceChargeAdmin(admin.ModelAdmin):
    list_display = ['charge_name', 'category', 'standard_charge', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['charge_name', 'category__category_name']
    ordering = ['-created_at']


@admin.register(AmbulanceBill)
class AmbulanceBillAdmin(admin.ModelAdmin):
    list_display = ['bill_no', 'patient', 'ambulance', 'charge', 'date', 'net_amount', 'balance', 'payment_mode']
    list_filter = ['payment_mode', 'date', 'created_at']
    search_fields = ['bill_no', 'patient__first_name', 'ambulance__vehicle_number']
    readonly_fields = ['bill_no', 'net_amount', 'balance']
    ordering = ['-created_at']
