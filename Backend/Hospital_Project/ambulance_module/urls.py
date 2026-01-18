from django.urls import path

from .views import (
    # Ambulance CRUD
    AmbulanceListAPIView,
    AmbulanceCreateAPIView,
    AmbulanceUpdateAPIView,
    AmbulanceDeleteAPIView,

    

    # Bills
    AmbulanceBillListAPIView,
    AmbulanceBillDetailAPIView,
    GenerateAmbulanceBillAPIView,
    AmbulanceBillUpdateView,
    
)

urlpatterns = [
    # Ambulance management
    path('ambulance/', AmbulanceListAPIView.as_view()),
    path('ambulance/create/', AmbulanceCreateAPIView.as_view()),
    path('ambulance/<int:pk>/update/', AmbulanceUpdateAPIView.as_view()),
    path('ambulance/<int:pk>/delete/', AmbulanceDeleteAPIView.as_view()),

    # Bills
    path('ambulance-bill/', AmbulanceBillListAPIView.as_view()),
    path('ambulance-bill/<int:pk>/', AmbulanceBillDetailAPIView.as_view()),
    path('ambulance-bill/create/', GenerateAmbulanceBillAPIView.as_view()),
    path("ambulance-bill/<int:pk>/update/", AmbulanceBillUpdateView.as_view()),
    
]