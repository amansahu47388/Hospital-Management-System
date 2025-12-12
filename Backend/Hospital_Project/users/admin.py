# from django.contrib import admin
# from .models import User
# from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

# @admin.register(User)
# class UserAdmin(DefaultUserAdmin):
#     # Override ordering to use email instead of username
#     ordering = ('email',)
    
#     # Update fieldsets to match our custom User model
#     fieldsets = (
#         (None, {"fields": ("email", "password")}),
#         ("Personal info", {"fields": ("full_name", "phone")}),
#         ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
#         ("Important dates", {"fields": ("last_login", "created_at")}),
#         ("Role", {"fields": ("role",)}),
#     )
    
#     # Add fields for creating new user
#     add_fieldsets = (
#         (None, {
#             "classes": ("wide",),
#             "fields": ("email", "full_name", "phone", "role", "password1", "password2"),
#         }),
#     )
    
#     # Use email instead of username in list display
#     list_display = ("email", "full_name", "role", "is_staff", "is_active", "created_at")
    
#     # Search by email and full_name instead of username
#     search_fields = ("email", "full_name", "phone")
    
#     # Filter options
#     list_filter = ("is_staff", "is_superuser", "is_active", "role", "created_at")
    
#     # Read-only fields
#     readonly_fields = ("last_login", "created_at")
