from django.urls import path
from .views import *

app_name = 'patient_module'

urlpatterns = [
    # Patient URLs
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('patients/create/', PatientCreateView.as_view(), name='patient-create'),
    path('patients/search/', PatientSearchView.as_view(), name='patient-search'),
    path("patients/search/", PatientSearchAPIView.as_view(), name="patient-search"),
    path('patients/<int:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/<int:patient_id>/update/', PatientUpdateView.as_view(), name='patient-update'),
    path('patients/<int:patient_id>/delete/', PatientDeleteView.as_view(), name='patient-delete'),
    
    # Patient Vital URLs
    path('patients/<int:patient_id>/vitals/',PatientVitalView.as_view(),name='patient-vital-list-create'),
    path('patients/<int:patient_id>/vitals/<int:pk>/create/',PatientVitalView.as_view(),name='patient-vital-detail'),
    path('patients/<int:patient_id>/vitals/<int:pk>/update/',PatientVitalView.as_view(),name='patient-vital-update'),
    path('patients/<int:patient_id>/vitals/<int:pk>/delete/',PatientVitalView.as_view(),name='patient-vital-delete'),


    # Patient Operation URLs
    path('patients/<int:patient_id>/operations/',PatientOperationView.as_view(),name='patient-operation-list-create'),
    path('patients/<int:patient_id>/operations/<int:pk>/create/',PatientOperationView.as_view(),name='patient-operation-detail'),
    path('patients/<int:patient_id>/operations/<int:pk>/update/',PatientOperationView.as_view(),name='patient-operation-update'),
    path('patients/<int:patient_id>/operations/<int:pk>/delete/',PatientOperationView.as_view(),name='patient-operation-delete'),
  

    # Patient Consultant URLs
    path('patients/<int:patient_id>/consultants/',PatientConsultantView.as_view(),name='patient-consultant-list-create'),
    path('patients/<int:patient_id>/consultants/<int:pk>/create/',PatientConsultantView.as_view(),name='patient-consultant-detail'),
    path('patients/<int:patient_id>/consultants/<int:pk>/update/',PatientConsultantView.as_view(),name='patient-consultant-update'),
    path('patients/<int:patient_id>/consultants/<int:pk>/delete/',PatientConsultantView.as_view(),name='patient-consultant-delete'),

    # Patient Charges URLs
    path('patients/<int:patient_id>/charges/',PatientChargesView.as_view(),name='patient-charges-list-create'),
    path('patients/<int:patient_id>/charges/<int:pk>/create/',PatientChargesView.as_view(),name='patient-charges-detail'),
    path('patients/<int:patient_id>/charges/<int:pk>/update/',PatientChargesView.as_view(),name='patient-charges-update'),
    path('patients/<int:patient_id>/charges/<int:pk>/delete/',PatientChargesView.as_view(),name='patient-charges-delete'),



]