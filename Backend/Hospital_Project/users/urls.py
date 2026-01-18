# backend/apps/users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_views import *
from .views import UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("staff/", StaffList.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("register/", RegisterUserView.as_view(), name="register"),  # user register
    path(
        "register/admin/",
        RegisterAdminView.as_view(),
        name="register_admin",
    ),  # admin register
    path("", include(router.urls)),
]
