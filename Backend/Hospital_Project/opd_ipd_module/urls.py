from django.urls import path
from .views import OpdPatientCreateAPIView, OpdPatientListAPIView, OpdPatientDetailAPIView, OpdPatientUpdateAPIView

urlpatterns = [
    # OPD Patient URLs
    path("opd/create/", OpdPatientCreateAPIView.as_view(), name="opd-create"),
    path("opd/", OpdPatientListAPIView.as_view(), name="opd-list"),
    path("opd/<int:pk>/", OpdPatientDetailAPIView.as_view(), name="opd-detail"),
     path("opd/<int:pk>/update/", OpdPatientUpdateAPIView.as_view()),

    # IPD Patient URLs
    # (To be added in the future)
]
