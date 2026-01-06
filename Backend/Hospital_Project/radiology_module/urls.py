from django.urls import path
from .views import (
    RadiologyTestCreateAPIView,
    RadiologyTestListAPIView,
    RadiologyTestUpdateAPIView,
    RadiologyTestDeleteAPIView,
    RadiologyCategoryListAPIView,
    RadiologyParameterListAPIView,
)

urlpatterns = [
    path("test/", RadiologyTestListAPIView.as_view()),
    path("test/create/", RadiologyTestCreateAPIView.as_view()),
    path("test/<int:pk>/update/", RadiologyTestUpdateAPIView.as_view()),
    path("test/<int:pk>/delete/", RadiologyTestDeleteAPIView.as_view()),

    # ✅ THESE TWO MUST EXIST
    path("category/", RadiologyCategoryListAPIView.as_view()),
    path("parameter/", RadiologyParameterListAPIView.as_view()),
]
