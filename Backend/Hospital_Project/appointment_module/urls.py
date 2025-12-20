from django.urls import path
from .views import AppointmentViewSet

urlpatterns = [
    path('', AppointmentViewSet.as_view({'get': 'list'}), name='appointment-list'),
    path('create/', AppointmentViewSet.as_view({'post': 'create'}), name='appointment-create'),
    path('<uuid:pk>/', AppointmentViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='appointment-detail'),
    path('today/', AppointmentViewSet.as_view({'get': 'today'}), name='appointment-today'),
    path('upcoming/', AppointmentViewSet.as_view({'get': 'upcoming'}), name='appointment-upcoming'),
    path('past/', AppointmentViewSet.as_view({'get': 'past'}), name='appointment-past'),
    path('doctor-wise/', AppointmentViewSet.as_view({'get': 'doctor_wise'}), name='appointment-doctor-wise'),
    path('patient-queue/', AppointmentViewSet.as_view({'get': 'patient_queue'}), name='appointment-patient-queue'),
]