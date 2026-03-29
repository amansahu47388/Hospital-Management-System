# pharmacy_module/urls.py
from django.urls import path
from .views import *


urlpatterns = [
    #  Category urls
    path("pharmacy/category/", MedicineCategoryAPI.as_view(), name="medicine-category-list"),
    path("pharmacy/category/create/", MedicineCategoryAPI.as_view(), name="medicine-category-create"),
    path("pharmacy/category/<int:pk>/update/", MedicineCategoryAPI.as_view(), name="medicine-category-update"),
    path("pharmacy/category/<int:pk>/delete/", MedicineCategoryAPI.as_view(), name="medicine-category-delete"),



    # Company urls
    path("pharmacy/company/", CompanyAPIView.as_view(), name="medicine-company-list"),
    path("pharmacy/company/create/", CompanyAPIView.as_view(), name="medicine-company-create"),
    path("pharmacy/company/<int:pk>/update/", CompanyAPIView.as_view(), name="medicine-company-update"),
    path("pharmacy/company/<int:pk>/delete/", CompanyAPIView.as_view(), name="medicine-company-delete"),



    # group urls
    path("pharmacy/groups/", MedicineGroupAPIView.as_view(), name="medicine-group-list"),
    path("pharmacy/groups/create/", MedicineGroupAPIView.as_view(), name="medicine-group-create"),
    path("pharmacy/groups/<int:pk>/update/", MedicineGroupAPIView.as_view(), name="medicine-group-update"),
    path("pharmacy/groups/<int:pk>/delete/", MedicineGroupAPIView.as_view(), name="medicine-group-delete"),



    # Unit urls
    path("pharmacy/units/", UnitAPIView.as_view(), name="medicine-unit-list"),
    path("pharmacy/units/create/", UnitAPIView.as_view(), name="medicine-unit-create"),
    path("pharmacy/units/<int:pk>/update/", UnitAPIView.as_view(), name="medicine-unit-update"),
    path("pharmacy/units/<int:pk>/delete/", UnitAPIView.as_view(), name="medicine-unit-delete"),


    # Suppliers urls
    path("pharmacy/suppliers/", SupplierAPIView.as_view(), name="medicine-supplier-list"),
    path("pharmacy/suppliers/create/", SupplierAPIView.as_view(), name="medicine-supplier-create"),
    path("pharmacy/suppliers/<int:pk>/update/", SupplierAPIView.as_view(), name="medicine-supplier-update"),
    path("pharmacy/suppliers/<int:pk>/delete/", SupplierAPIView.as_view(), name="medicine-supplier-delete"),


    #  MedicineDosage urls
    path("pharmacy/medicinedosages/", MedicineDosageAPIView.as_view(), name="medicine-dosage-list"),
    path("pharmacy/medicinedosages/create/", MedicineDosageAPIView.as_view(), name="medicine-dosage-create"),
    path("pharmacy/medicinedosages/<int:pk>/update/", MedicineDosageAPIView.as_view(), name="medicine-dosage-update"),
    path("pharmacy/medicinedosages/<int:pk>/delete/", MedicineDosageAPIView.as_view(), name="medicine-dosage-delete"),


    #  Dosage urls
    path("pharmacy/dosages/", DosageAPIView.as_view(), name="medicine-dosage-list"),
    path("pharmacy/dosages/create/", DosageAPIView.as_view(), name="medicine-dosage-create"),
    path("pharmacy/dosages/<int:pk>/update/", DosageAPIView.as_view(), name="medicine-dosage-update"),
    path("pharmacy/dosages/<int:pk>/delete/", DosageAPIView.as_view(), name="medicine-dosage-delete"),


    # Medicine urls
    path("pharmacy/medicines/", MedicineListAPIView.as_view(), name="medicine-list"),
    path("pharmacy/medicines/create/", MedicineCreateAPIView.as_view(), name="medicine-create"),
    path("pharmacy/medicines/<int:pk>/update/", MedicineUpdateAPIView.as_view(), name="medicine-update"),
    path("pharmacy/medicines/<int:pk>/", MedicineDetaisAPIView.as_view(), name="medicine-details"),
    path("pharmacy/medicines/<int:pk>/delete/", MedicineDeleteAPIView.as_view(), name="medicine-delete"),
    path("pharmacy/medicines/<int:pk>/stock/", MedicineStockAPIView.as_view(), name="medicine-stock"),


    # Purchase urls
    path("pharmacy/purchases/", PharmacyPurchaseListAPIView.as_view(), name="medicine-purchase-list"),
    path("pharmacy/purchases/create/", PharmacyPurchaseCreateAPIView.as_view(), name="medicine-purchase-create"),
    path("pharmacy/purchases/<int:pk>/", PharmacyPurchaseDetailAPIView.as_view(), name="medicine-purchase-details"),
    path("pharmacy/purchases/<int:pk>/delete/", PharmacyPurchaseDeleteAPIView.as_view(), name="medicine-purchase-delete"),

    # Bill urls
    path("pharmacy/bills/", PharmacyBillListAPIView.as_view(), name="medicine-bill-list"),
    path("pharmacy/bills/create/", PharmacyBillCreateAPIView.as_view(), name="medicine-bill-create"),
    path("pharmacy/bills/<int:pk>/", PharmacyBillDetailAPIView.as_view(), name="medicine-bill-details"),
    path("pharmacy-bills/<int:pk>/update/", PharmacyBillUpdateAPIView.as_view(), name="medicine-bill-update"),
    path("pharmacy/bills/<int:pk>/delete/", PharmacyBillDeleteAPIView.as_view(), name="medicine-bill-delete"),

    path("pharmacy/billing/medicines/", PharmacyBillingMedicineAPI.as_view(), name="medicine-billing-medicines"),
    path("pharmacy/billing/batches/<int:medicine_id>/", PharmacyBillingBatchAPI.as_view(), name="medicine-billing-batches"),



]