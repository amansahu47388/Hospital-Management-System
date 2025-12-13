# backend/apps/users/urls.py
from django.urls import path
from .auth_views import LoginView, LogoutView, RefreshTokenView, RegisterUserView, RegisterAdminView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),               # user register
    path('register/admin/', RegisterAdminView.as_view(), name='register_admin'),  # admin register
]
