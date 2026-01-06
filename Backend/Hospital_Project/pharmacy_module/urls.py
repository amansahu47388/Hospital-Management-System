# pharmacy_module/urls.py
from django.urls import path
from .views import( 
    MedicineCategoryListAPIView,
    CompanyListAPIView,
    MedicineGroupListAPIView,
    UnitListAPIView,
    SupplierListAPIView,
    MedicineDosageListAPIView,
    DosageListAPIView,
    MedicineListAPIView , MedicineCreateAPIView, MedicineUpdateAPIView, MedicineDetaisAPIView, MedicineDeleteAPIView,

)


urlpatterns = [
    #  Category urs
    path("pharmacy/category/", MedicineCategoryListAPIView.as_view()),



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
    path("pharmacy/medicines/<int:pk>update/", MedicineUpdateAPIView.as_view()),
    path("pharmacy/medicines/<int:pk>/", MedicineDetaisAPIView.as_view()),
    path("pharmacy/medicines/<int:pk>delete", MedicineDeleteAPIView.as_view()),


]