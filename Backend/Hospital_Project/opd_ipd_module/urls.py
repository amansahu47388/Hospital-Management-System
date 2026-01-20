from django.urls import path
from .views import *

urlpatterns = [
    # OPD Patient URLs
    path("opd/create/", OpdPatientCreateAPIView.as_view(), name="opd-create"),
    path("opd/", OpdPatientListAPIView.as_view(), name="opd-list"),
    path("opd/<int:pk>/", OpdPatientDetailAPIView.as_view(), name="opd-detail"),
    path("opd/<int:pk>/update/", OpdPatientUpdateAPIView.as_view()),
    path("opd/<int:pk>/delete/", OpdPatientDeleteAPIView.as_view()),


    # IPD Patient URLs
    path("ipd/create/", IpdPatientCreateAPIView.as_view(), name="ipd-create"),
    path("ipd/", IpdPatientListAPIView.as_view(), name="ipd-list"),
    path("ipd/<int:pk>/", IpdPatientDetailAPIView.as_view(), name="ipd-detail"),
    path("ipd/<int:pk>/update/", IpdPatientUpdateAPIView.as_view(), name="ipd-update"),
    path("ipd/<int:pk>/delete/", IpdPatientDeleteAPIView.as_view()),
    path("ipd/<int:pk>/discharge/", IpdDischargeCreateAPIView.as_view()),
    path("ipd/discharged/",IpdDischargedPatientListAPIView.as_view(),name="ipd-discharged-list"),
    path("ipd/<int:pk>/discharge/revert/",IpdDischargeRevertAPIView.as_view(),name="ipd-discharge-revert"),



    # Prescription URLs
    path("prescriptions/", PrescriptionAPI.as_view(), name="prescription-list"),
    path("prescriptions/create/", PrescriptionAPI.as_view(), name="prescription-create"),
    path("prescriptions/<int:pk>/", PrescriptionAPI.as_view(), name="prescription-detail"),
    path("prescriptions/<int:pk>/delete/", PrescriptionAPI.as_view(), name="prescription-delete"),
]

