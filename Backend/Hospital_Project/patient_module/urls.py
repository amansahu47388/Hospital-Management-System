from django.urls import path
from .views import *

app_name = 'patient_module'

urlpatterns = [
    # Patient URLs
    path('patients/<int:patient_id>/vitals/',PatientVitalView.as_view(),name='patient-vital-list-create'),
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('patients/create/', PatientCreateView.as_view(), name='patient-create'),
    path('patients/search/', PatientSearchView.as_view(), name='patient-search'),
    path("patients/search/", PatientSearchAPIView.as_view(), name="patient-search"),
    path('patients/<int:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/<int:patient_id>/update/', PatientUpdateView.as_view(), name='patient-update'),
    path('patients/<int:patient_id>/delete/', PatientDeleteView.as_view(), name='patient-delete'),
    
    # Patient Vital URLs
    path('patients/<int:patient_id>/vitals/',PatientVitalView.as_view(),name='patient-vital-list-create'),
    path('patients/<int:patient_id>/vitals/<int:vital_id>/create/',PatientVitalView.as_view(),name='patient-vital-detail'),
    path('patients/<int:patient_id>/vitals/<int:vital_id>/update/',PatientVitalView.as_view(),name='patient-vital-update'),
    path('patients/<int:patient_id>/vitals/<int:vital_id>/delete/',PatientVitalView.as_view(),name='patient-vital-delete'),







]