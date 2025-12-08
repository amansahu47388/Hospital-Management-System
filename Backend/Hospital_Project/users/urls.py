# backend/apps/users/urls.py
from django.urls import path
from .auth_views import LoginView, RefreshTokenView, LogoutView

urlpatterns = [
    path("login/", LoginView.as_view(), name="token_obtain_pair_cookie"),
    path("refresh/", RefreshTokenView.as_view(), name="token_refresh_cookie"),
    path("logout/", LogoutView.as_view(), name="token_logout"),
]
