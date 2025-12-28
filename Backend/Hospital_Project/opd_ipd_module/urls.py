from django.urls import path
from .views import IpdPatientUpdateAPIView, OpdPatientCreateAPIView, OpdPatientListAPIView, OpdPatientDetailAPIView, OpdPatientUpdateAPIView, IpdPatientCreateAPIView, IpdPatientListAPIView, IpdPatientDetailAPIView

urlpatterns = [
    # OPD Patient URLs
    path("opd/create/", OpdPatientCreateAPIView.as_view(), name="opd-create"),
    path("opd/", OpdPatientListAPIView.as_view(), name="opd-list"),
    path("opd/<int:pk>/", OpdPatientDetailAPIView.as_view(), name="opd-detail"),
     path("opd/<int:pk>/update/", OpdPatientUpdateAPIView.as_view()),

    # IPD Patient URLs
    path("ipd/create/", IpdPatientCreateAPIView.as_view(), name="ipd-create"),
    path("ipd/", IpdPatientListAPIView.as_view(), name="ipd-list"),
    path("ipd/<int:pk>/", IpdPatientDetailAPIView.as_view(), name="ipd-detail"),
    path("ipd/<int:pk>/update/", IpdPatientUpdateAPIView.as_view(), name="ipd-update"),
]
