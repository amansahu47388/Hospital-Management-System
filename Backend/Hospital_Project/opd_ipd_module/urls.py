from django.urls import path
from .views import OpdPatientCreateAPIView, OpdPatientListAPIView, OpdPatientDetailAPIView

urlpatterns = [
    # OPD Patient URLs
    path("opd/create/", OpdPatientCreateAPIView.as_view(), name="opd-create"),
    path("opd/", OpdPatientListAPIView.as_view(), name="opd-list"),
    path("opd/<int:pk>/", OpdPatientDetailAPIView.as_view(), name="opd-detail"),

    # IPD Patient URLs
    # (To be added in the future)
]
