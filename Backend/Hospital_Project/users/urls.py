# backend/apps/users/urls.py
from django.urls import path
from .auth_views import LoginView, RefreshTokenView, LogoutView
from .views import UserRegisterView, AdminRegisterView

urlpatterns = [
    path('register/user/', UserRegisterView.as_view()),
    path('register/admin/', AdminRegisterView.as_view()),
    path("login/", LoginView.as_view(), name="token_obtain_pair_cookie"),
    path("refresh/", RefreshTokenView.as_view(), name="token_refresh_cookie"),
    path("logout/", LogoutView.as_view(), name="token_logout"),
]
