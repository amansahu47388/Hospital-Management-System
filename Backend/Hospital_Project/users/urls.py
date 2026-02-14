# backend/apps/users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_views import *
from .views import UserViewSet
from .staff_views import (
    StaffManagementView,
    StaffDetailView,
    StaffToggleActiveView,
    ResendInvitationView,
    FirstLoginPasswordChangeView
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("staff/", StaffList.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("register/", RegisterUserView.as_view(), name="register"),  # user register
    path("register/admin/", RegisterAdminView.as_view(), name="register_admin"),  # admin register (DEPRECATED - use staff management)
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    
    # Staff Management Routes
    path("staff-management/", StaffManagementView.as_view(), name="staff_management"),
    path("staff-management/<int:staff_id>/", StaffDetailView.as_view(), name="staff_detail"),
    path("staff-management/<int:staff_id>/toggle-active/", StaffToggleActiveView.as_view(), name="staff_toggle_active"),
    path("staff-management/<int:staff_id>/resend-invitation/", ResendInvitationView.as_view(), name="resend_invitation"),
    path("first-login-password-change/", FirstLoginPasswordChangeView.as_view(), name="first_login_password_change"),
    
    path("", include(router.urls)),
]
