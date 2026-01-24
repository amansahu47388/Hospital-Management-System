
from django.urls import path
from .views import *


urlpatterns = [
    # Appointment Priority
    path('appointment-priority/', AppointmentPriorityAPIView.as_view(), name='appointment-priority'),
    path('appointment-priority/create/', AppointmentPriorityAPIView.as_view(), name='appointment-priority-create'),
    path('appointment-priority/<int:pk>/update/', AppointmentPriorityAPIView.as_view(), name='appointment-priority-update'),
    path('appointment-priority/<int:pk>/delete/', AppointmentPriorityAPIView.as_view(), name='appointment-priority-delete'),


    # Appointment Shift
    path('appointment-shift/', AppointmentShiftAPIView.as_view(), name='appointment-shift'),
    path('appointment-shift/create/', AppointmentShiftAPIView.as_view(), name='appointment-shift-create'),
    path('appointment-shift/<int:pk>/update/', AppointmentShiftAPIView.as_view(), name='appointment-shift-update'),
    path('appointment-shift/<int:pk>/delete/', AppointmentShiftAPIView.as_view(), name='appointment-shift-delete'),



    # Doctors
    path("doctors/", DoctorListAPIView.as_view()),

    # Nurses
    path("nurses/", NurseListAPIView.as_view()),

    # Appointment
    path('', AppointmentViewSet.as_view({'get': 'list'}), name='appointment-list'),
    path('create/', AppointmentCreateAPIView.as_view(), name='appointment-create'),
    # path('<int:pk>/', AppointmentListAPIView.as_view(), name='appointment-detail'),
     path('<int:pk>/', AppointmentViewSet.as_view({
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
    path('<int:pk>/reschedule/', AppointmentViewSet.as_view({'patch': 'reschedule'}), name='appointment-reschedule'),
    path('<int:pk>/delete/', AppointmentViewSet.as_view({'delete': 'delete_appointment'}), name='appointment-delete'),
]
