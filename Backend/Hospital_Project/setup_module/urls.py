from django.urls import path
from .views import SymptomListAPIView, HospitalChargesListAPIView

urlpatterns = [
    path("symptoms/", SymptomListAPIView.as_view(), name="symptom-list"),
    path("charges/", HospitalChargesListAPIView.as_view(), name="hospital-charges-list"),
]

