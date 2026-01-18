from django.urls import path

from .views import (
    # Ambulance CRUD
    AmbulanceListAPIView,
    AmbulanceCreateAPIView,
    AmbulanceUpdateAPIView,
    AmbulanceDeleteAPIView,
    AmbulanceDetailAPIView,
    

    # Bills
    AmbulanceBillListAPIView,
    AmbulanceBillDetailAPIView,
    GenerateAmbulanceBillAPIView,
    AmbulanceBillUpdateView,
    AmbulanceBillDeleteView,
    
    # Transactions
    AmbulanceBillTransactionListAPIView,
    AmbulanceBillTransactionCreateAPIView,
    AmbulanceBillTransactionDeleteAPIView,
)

urlpatterns = [
    # Ambulance management
    path('ambulance/', AmbulanceListAPIView.as_view()),
    path('ambulance/create/', AmbulanceCreateAPIView.as_view()),
    path('ambulance/<int:pk>/update/', AmbulanceUpdateAPIView.as_view()),
    path('ambulance/<int:pk>/delete/', AmbulanceDeleteAPIView.as_view()),
    path('ambulance/<int:pk>/', AmbulanceDetailAPIView.as_view()),

    # Bills
    path('ambulance-bill/', AmbulanceBillListAPIView.as_view()),
    path('ambulance-bill/<int:pk>/', AmbulanceBillDetailAPIView.as_view()),
    path('ambulance-bill/create/', GenerateAmbulanceBillAPIView.as_view()),
    path("ambulance-bill/<int:pk>/update/", AmbulanceBillUpdateView.as_view()),
    path("ambulance-bill/<int:pk>/delete/", AmbulanceBillDeleteView.as_view()),
    
    # Transactions
    path('ambulance-bill/<int:bill_id>/transactions/', AmbulanceBillTransactionListAPIView.as_view()),
    path('ambulance-bill/<int:bill_id>/transactions/create/', AmbulanceBillTransactionCreateAPIView.as_view()),
    path('ambulance-bill/<int:bill_id>/transactions/<int:transaction_id>/delete/', AmbulanceBillTransactionDeleteAPIView.as_view()),
]
