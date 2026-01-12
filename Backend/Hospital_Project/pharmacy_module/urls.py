# pharmacy_module/urls.py
from django.urls import path
from .views import *


urlpatterns = [
    #  Category urs
    path("pharmacy/category/", MedicineCategoryAPI.as_view()),



    # Company urls
    path("pharmacy/company/", CompanyListAPIView.as_view()),



    # group urls
    path("pharmacy/groups/", MedicineGroupListAPIView.as_view()),



    # Unit urls
    path("pharmacy/units/", UnitListAPIView.as_view()),


    # Suppliers urls
    path("pharmacy/suppliers/", SupplierListAPIView.as_view()),


    #  MedicineDosage urls
    path("pharmacy/medicinedosages/", MedicineDosageListAPIView.as_view()),


    #  Dosage urls
    path("pharmacy/dosages/", DosageListAPIView.as_view()),



    # Medicine urls
    path("pharmacy/medicines/", MedicineListAPIView.as_view()),
    path("pharmacy/medicines/create/", MedicineCreateAPIView.as_view()),
    path("pharmacy/medicines/<int:pk>/update/", MedicineUpdateAPIView.as_view()),
    path("pharmacy/medicines/<int:pk>/", MedicineDetaisAPIView.as_view()),
    path("pharmacy/medicines/<int:pk>/delete/", MedicineDeleteAPIView.as_view()),

    path("pharmacy/medicines/<int:pk>/stock/", MedicineStockAPIView.as_view()),


    # Purchase urls
    path("pharmacy/purchases/", PharmacyPurchaseListAPIView.as_view()),
    path("pharmacy/purchases/create/", PharmacyPurchaseCreateAPIView.as_view()),
    path("pharmacy/purchases/<int:pk>/", PharmacyPurchaseDetailAPIView.as_view()),
    path("pharmacy/purchases/<int:pk>/delete/", PharmacyPurchaseDeleteAPIView.as_view()),

    # Bill urls
    path("pharmacy/bills/", PharmacyBillListAPIView.as_view()),
    path("pharmacy/bills/create/", PharmacyBillCreateAPIView.as_view()),
    path("pharmacy/bills/<int:pk>/", PharmacyBillDetailAPIView.as_view()),
    path("pharmacy-bills/<int:pk>/update/", PharmacyBillUpdateAPIView.as_view()),
    path("pharmacy/bills/<int:pk>/delete/", PharmacyBillDeleteAPIView.as_view()),

    path("pharmacy/billing/medicines/", PharmacyBillingMedicineAPI.as_view()),
    path("pharmacy/billing/batches/<int:medicine_id>/", PharmacyBillingBatchAPI.as_view()),



]