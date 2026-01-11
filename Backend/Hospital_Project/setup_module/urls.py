from django.urls import path
from .views import SymptomListAPIView, HospitalChargesListAPIView, BedListAPIView, ChargeCategoryListAPIView
urlpatterns = [
    path("symptoms/", SymptomListAPIView.as_view(), name="symptom-list"),
    path("charges/", HospitalChargesListAPIView.as_view(), name="hospital-charges-list"),
    path("charge-categories/", ChargeCategoryListAPIView.as_view(), name="charge-category-list"),
    path("beds/", BedListAPIView.as_view(), name="bed-list"),
    
]

