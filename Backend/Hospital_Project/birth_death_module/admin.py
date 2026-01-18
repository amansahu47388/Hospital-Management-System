from django.contrib import admin
from .models import BirthRecord, DeathRecord


@admin.register(BirthRecord)
class BirthRecordAdmin(admin.ModelAdmin):
    list_display = ['reference_no', 'child_name', 'gender', 'birth_date', 'mother_name', 'created_by', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['reference_no', 'child_name', 'mother_name', 'father_name', 'case_id']
    readonly_fields = ['reference_no', 'created_at', 'updated_at']


@admin.register(DeathRecord)
class DeathRecordAdmin(admin.ModelAdmin):
    list_display = ['reference_no', 'patient_name', 'death_date', 'guardian_name', 'created_by', 'created_at']
    list_filter = ['death_date', 'created_at']
    search_fields = ['reference_no', 'patient_name', 'guardian_name', 'case_id']
    readonly_fields = ['reference_no', 'created_at', 'updated_at']
