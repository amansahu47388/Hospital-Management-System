from django.urls import path
from .views import *

urlpatterns = [
    # OPD Patient URLs
    path("opd/create/", OpdPatientCreateAPIView.as_view(), name="opd-create"),
    path("opd/", OpdPatientListAPIView.as_view(), name="opd-list"),
    path("opd/<int:pk>/", OpdPatientDetailAPIView.as_view(), name="opd-detail"),
    path("opd/<int:pk>/update/", OpdPatientUpdateAPIView.as_view()),
    path("opd/<int:pk>/delete/", OpdPatientDeleteAPIView.as_view()),
    path("opd/<int:opd_id>/convert-to-ipd/", ConvertOpdToIpdAPIView.as_view(), name="opd-to-ipd"),


    # IPD Patient URLs
    path("ipd/create/", IpdPatientCreateAPIView.as_view(), name="ipd-create"),
    path("ipd/", IpdPatientListAPIView.as_view(), name="ipd-list"),
    path("ipd/<int:pk>/", IpdPatientDetailAPIView.as_view(), name="ipd-detail"),
    path("ipd/<int:pk>/update/", IpdPatientUpdateAPIView.as_view(), name="ipd-update"),
    path("ipd/<int:pk>/delete/", IpdPatientDeleteAPIView.as_view()),
    path("ipd/<int:pk>/discharge/", IpdDischargeCreateAPIView.as_view()),
    path("ipd/discharged/",IpdDischargedPatientListAPIView.as_view(),name="ipd-discharged-list"),
    path("ipd/<int:pk>/discharge/revert/",IpdDischargeRevertAPIView.as_view(),name="ipd-discharge-revert"),


    # Nurse Note URLs
    path("ipd/nurse-note/", NurseNoteAPIView.as_view(), name="ipd-nurse-note-list"),
    path("ipd/nurse-note/create/", NurseNoteAPIView.as_view(), name="ipd-nurse-note-create"),
    path("ipd/nurse-note/<int:pk>/", NurseNoteAPIView.as_view(), name="ipd-nurse-note-detail"),
    path("ipd/nurse-note/<int:pk>/update/", NurseNoteAPIView.as_view(), name="ipd-nurse-note-update"),
    path("ipd/nurse-note/<int:pk>/delete/", NurseNoteAPIView.as_view(), name="ipd-nurse-note-delete"),


    # Prescription URLs
    path("ipd/prescriptions/", PrescriptionAPI.as_view(), name="ipd-prescription-list"),
    path("ipd/prescriptions/create/", PrescriptionAPI.as_view(), name="ipd-prescription-create"),
    path("ipd/prescriptions/<int:pk>/", PrescriptionAPI.as_view(), name="ipd-prescription-detail"),
    path("ipd/prescriptions/<int:pk>/delete/", PrescriptionAPI.as_view(), name="ipd-prescription-delete"),
]

