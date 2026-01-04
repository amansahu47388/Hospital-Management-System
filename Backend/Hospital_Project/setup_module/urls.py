from django.urls import path
from .views import SymptomListAPIView, HospitalChargesListAPIView, BedListAPIView
urlpatterns = [
    path("symptoms/", SymptomListAPIView.as_view(), name="symptom-list"),
    path("charges/", HospitalChargesListAPIView.as_view(), name="hospital-charges-list"),
    path("beds/", BedListAPIView.as_view(), name="bed-list"),
    
]

