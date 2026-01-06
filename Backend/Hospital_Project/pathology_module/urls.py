from django.urls import path
from .views import (
    PathologyTestCreateAPIView,PathologyParameterListAPIView,PathologyCategoryListAPIView,PathologyTestDeleteAPIView,PathologyTestListAPIView,
    PathologyTestUpdateAPIView,GeneratePathologyBillAPIView,PathologyBillListAPIView,PathologyBillDetailAPIView,PrescriptionSearchAPIView,
    PathologyBillUpdateAPIView, PathologyBillDeleteAPIView
)

urlpatterns = [
    # Test Routes
    path("pathology/parameter", PathologyParameterListAPIView.as_view(), name="pathology-parameter"),
    path("pathology/category", PathologyCategoryListAPIView.as_view(), name="pathology-category"),
    path("pathology/pathology-test/", PathologyTestListAPIView.as_view()),
    path("pathology/pathology-test/create/", PathologyTestCreateAPIView.as_view()),
    path("pathology/pathology-test/<int:pk>/update/",PathologyTestUpdateAPIView.as_view()),
    path("pathology/pathology-test/<int:pk>/delete/", PathologyTestDeleteAPIView.as_view()),


    # Bill Routes
    path("pathology/pathology-bill/create/", GeneratePathologyBillAPIView.as_view()),
    path("pathology/pathology-bill/", PathologyBillListAPIView.as_view()),
    path("pathology/pathology-bill/<int:pk>/", PathologyBillDetailAPIView.as_view()),
    path("pathology/pathology-bill/<int:pk>/update/", PathologyBillUpdateAPIView.as_view()),
    path("pathology/pathology-bill/<int:pk>/delete/", PathologyBillDeleteAPIView.as_view()),

    
    # Prescription Search
    path("pathology/prescription/search/", PrescriptionSearchAPIView.as_view()),
]

