from django.urls import path
from .views import *
urlpatterns = [
    path("charge-units/", ChargeUnitAPI.as_view(), name="charge-unts"),
    path("charge-units/create/", ChargeUnitAPI.as_view(), name="charge-unts-create"),
    path("charge-units/<int:pk>/update/", ChargeUnitAPI.as_view(), name="charge-unts-update"),
    path("charge-units/<int:pk>/delete/", ChargeUnitAPI.as_view(), name="charge-unts-delete"),


    path("charge-type/", ChargeTypeAPI.as_view(), name="charge-type"),
    path("charge-type/create/", ChargeTypeAPI.as_view(), name="charge-type-create"),
    path("charge-type/<int:pk>/update/", ChargeTypeAPI.as_view(), name="charge-type-update"),
    path("charge-type/<int:pk>/delete/", ChargeTypeAPI.as_view(), name="charge-type-delete"),


    path("charge-categories/", ChargeCategoryAPI.as_view(), name="charge-categories"),
    path("charge-category/create/", ChargeCategoryAPI.as_view(), name="charge-category-create"),
    path("charge-category/<int:pk>/update/", ChargeCategoryAPI.as_view(), name="charge-category-update"),
    path("charge-category/<int:pk>/delete/", ChargeCategoryAPI.as_view(), name="charge-category-delete"),


    path("charge-tax/", ChargeTaxAPI.as_view(), name="charge-tax"),
    path("charge-tax/create/", ChargeTaxAPI.as_view(), name="charge-tax-create"),
    path("charge-tax/<int:pk>/update/", ChargeTaxAPI.as_view(), name="charge-tax-update"),
    path("charge-tax/<int:pk>/delete/", ChargeTaxAPI.as_view(), name="charge-tax-delete"),


    path("charges/", HospitalChargesAPIView.as_view(), name="hospital-charges-list"),
    path("charges/create/", HospitalChargesAPIView.as_view(), name="hospital-charges-create"),
    path("charges/<int:pk>/update/", HospitalChargesAPIView.as_view(), name="hospital-charges-update"),
    path("charges/<int:pk>/delete/", HospitalChargesAPIView.as_view(), name="hospital-charges-delete"),




    path("charges/", HospitalChargesListAPIView.as_view(), name="hospital-charges-list"),
    path("symptoms/", SymptomListAPIView.as_view(), name="symptom-list"),
    # path("charge-categories/", ChargeCategoryListAPIView.as_view(), name="charge-category-list"),
    path("beds/", BedListAPIView.as_view(), name="bed-list"),
    
]

