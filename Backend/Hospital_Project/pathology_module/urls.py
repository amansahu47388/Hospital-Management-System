from django.urls import path
from .views import (
    PathologyTestCreateAPIView,
    PathologyParameterListAPIView,
    PathologyCategoryListAPIView,
    PathologyTestDeleteAPIView,
    PathologyTestListAPIView,
    PathologyTestUpdateAPIView
)

urlpatterns = [
    path("pathology/parameter", PathologyParameterListAPIView.as_view(), name="pathology-parameter"),
    path("pathology/category", PathologyCategoryListAPIView.as_view(), name="pathology-category"),
    path("pathology/pathology-test/", PathologyTestListAPIView.as_view()),
    path("pathology/pathology-test/create/", PathologyTestCreateAPIView.as_view()),
    path("pathology/pathology-test/<int:pk>/update/",PathologyTestUpdateAPIView.as_view()),
    path("pathology/pathology-test/<int:pk>/delete/", PathologyTestDeleteAPIView.as_view()),
]

