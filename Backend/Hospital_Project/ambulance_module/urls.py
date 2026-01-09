from django.urls import path
from .views import (
    # Ambulance CRUD
    AmbulanceListAPIView,
    AmbulanceCreateAPIView,
    AmbulanceUpdateAPIView,
    AmbulanceDeleteAPIView,

    # Charge Category
    AmbulanceChargeCategoryListAPIView,
    AmbulanceChargeCategoryCreateAPIView,

    # Charges
    AmbulanceChargeListAPIView,
    AmbulanceChargeCreateAPIView,
    AmbulanceChargeUpdateAPIView,
    AmbulanceChargeDeleteAPIView,

    # Bills
    AmbulanceBillListAPIView,
    AmbulanceBillDetailAPIView,
    GenerateAmbulanceBillAPIView,
    AmbulanceBillUpdateAPIView,
    AmbulanceBillDeleteAPIView,
)

urlpatterns = [
    # Ambulance management
    path('ambulance/', AmbulanceListAPIView.as_view()),
    path('ambulance/create/', AmbulanceCreateAPIView.as_view()),
    path('ambulance/<int:pk>/update/', AmbulanceUpdateAPIView.as_view()),
    path('ambulance/<int:pk>/delete/', AmbulanceDeleteAPIView.as_view()),

    # Charge categories
    path('charge-category/', AmbulanceChargeCategoryListAPIView.as_view()),
    path('charge-category/create/', AmbulanceChargeCategoryCreateAPIView.as_view()),

    # Charges
    path('charge/', AmbulanceChargeListAPIView.as_view()),
    path('charge/create/', AmbulanceChargeCreateAPIView.as_view()),
    path('charge/<int:pk>/update/', AmbulanceChargeUpdateAPIView.as_view()),
    path('charge/<int:pk>/delete/', AmbulanceChargeDeleteAPIView.as_view()),

    # Bills
    path('ambulance-bill/', AmbulanceBillListAPIView.as_view()),
    path('ambulance-bill/<int:pk>/', AmbulanceBillDetailAPIView.as_view()),
    path('ambulance-bill/create/', GenerateAmbulanceBillAPIView.as_view()),
    path('ambulance-bill/<int:pk>/update/', AmbulanceBillUpdateAPIView.as_view()),
    path('ambulance-bill/<int:pk>/delete/', AmbulanceBillDeleteAPIView.as_view()),
]