from django.urls import path
from .views import (
    # Birth Records
    BirthRecordListAPIView,
    BirthRecordDetailAPIView,
    BirthRecordCreateAPIView,
    BirthRecordUpdateAPIView,
    BirthRecordDeleteAPIView,
    
    # Death Records
    DeathRecordListAPIView,
    DeathRecordDetailAPIView,
    DeathRecordCreateAPIView,
    DeathRecordUpdateAPIView,
    DeathRecordDeleteAPIView,
)

urlpatterns = [
    # Birth Records
    path('birth-record/', BirthRecordListAPIView.as_view(), name='birth-record-list'),
    path('birth-record/<int:pk>/', BirthRecordDetailAPIView.as_view(), name='birth-record-detail'),
    path('birth-record/create/', BirthRecordCreateAPIView.as_view(), name='birth-record-create'),
    path('birth-record/<int:pk>/update/', BirthRecordUpdateAPIView.as_view(), name='birth-record-update'),
    path('birth-record/<int:pk>/delete/', BirthRecordDeleteAPIView.as_view(), name='birth-record-delete'),
    
    # Death Records
    path('death-record/', DeathRecordListAPIView.as_view(), name='death-record-list'),
    path('death-record/<int:pk>/', DeathRecordDetailAPIView.as_view(), name='death-record-detail'),
    path('death-record/create/', DeathRecordCreateAPIView.as_view(), name='death-record-create'),
    path('death-record/<int:pk>/update/', DeathRecordUpdateAPIView.as_view(), name='death-record-update'),
    path('death-record/<int:pk>/delete/', DeathRecordDeleteAPIView.as_view(), name='death-record-delete'),
]
