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
    
    # Medical Case URLs
    path('cases/', MedicalCaseListView.as_view(), name='case-list'),
    path('cases/create/', MedicalCaseCreateView.as_view(), name='case-create'),
    path('cases/<int:pk>/', MedicalCaseDetailView.as_view(), name='case-detail'),

    # Patient Vital URLs
    path('patients/<int:patient_id>/vitals/', PatientVitalView.as_view(), name='patient-vital-list-create'),
    path('patients/<int:patient_id>/vitals/<int:pk>/', PatientVitalView.as_view(), name='patient-vital-detail'),



    # Patient Operation URLs
    path('patients/<int:patient_id>/operations/', PatientOperationView.as_view(), name='patient-operation-list-create'),
    path('patients/<int:patient_id>/operations/<int:pk>/', PatientOperationView.as_view(), name='patient-operation-detail'),

    # Patient Consultant URLs
    path('patients/<int:patient_id>/consultants/', PatientConsultantView.as_view(), name='patient-consultant-list-create'),
    path('patients/<int:patient_id>/consultants/<int:pk>/', PatientConsultantView.as_view(), name='patient-consultant-detail'),

    # Patient Charges URLs
    path('patients/<int:patient_id>/charges/', PatientChargesView.as_view(), name='patient-charges-list-create'),
    path('patients/<int:patient_id>/charges/<int:pk>/', PatientChargesView.as_view(), name='patient-charges-detail'),

    # Patient Payment URLs
    path('patients/<int:patient_id>/payments/', PatientPaymentView.as_view(), name='patient-payment-list-create'),
    path('patients/<int:patient_id>/payments/<int:pk>/', PatientPaymentView.as_view(), name='patient-payment-detail'),
]