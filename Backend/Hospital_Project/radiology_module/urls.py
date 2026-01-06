from django.urls import path
from .views import (
    RadiologyTestCreateAPIView,
    RadiologyTestListAPIView,
    RadiologyTestUpdateAPIView,
    RadiologyTestDeleteAPIView,
    RadiologyCategoryListAPIView,
    RadiologyParameterListAPIView,
    GenerateRadiologyBillAPIView, RadiologyBillListAPIView,RadiologyBillDetailAPIView,PrescriptionSearchAPIView,
    RadiologyBillUpdateAPIView, RadiologyBillDeleteAPIView
)

urlpatterns = [
    path("test/", RadiologyTestListAPIView.as_view()),
    path("test/create/", RadiologyTestCreateAPIView.as_view()),
    path("test/<int:pk>/update/", RadiologyTestUpdateAPIView.as_view()),
    path("test/<int:pk>/delete/", RadiologyTestDeleteAPIView.as_view()),

    # ✅ THESE TWO MUST EXIST
    path("category/", RadiologyCategoryListAPIView.as_view()),
    path("parameter/", RadiologyParameterListAPIView.as_view()),

    # Bill Routes
    path("radiology-bill/create/", GenerateRadiologyBillAPIView.as_view()),
    path("radiology-bill/", RadiologyBillListAPIView.as_view()),
    path("radiology-bill/<int:pk>/", RadiologyBillDetailAPIView.as_view()),
    path("radiology-bill/<int:pk>/update/", RadiologyBillUpdateAPIView.as_view()),
    path("radiology-bill/<int:pk>/delete/", RadiologyBillDeleteAPIView.as_view()),
    
    # Prescription Search
    path("prescription/search/", PrescriptionSearchAPIView.as_view()),
]
