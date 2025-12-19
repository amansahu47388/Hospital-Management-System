# apps/appointments/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Appointment.objects.select_related('patient', 'doctor', 'created_by').all()
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if date_from:
            try:
                date_from = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                queryset = queryset.filter(appointment_date__gte=date_from)
            except ValueError:
                pass
        
        if date_to:
            try:
                date_to = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                queryset = queryset.filter(appointment_date__lte=date_to)
            except ValueError:
                pass
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(patient__first_name__icontains=search) |
                Q(patient__last_name__icontains=search) |
                Q(patient__email__icontains=search) |
                Q(appointment_no__icontains=search) |
                Q(doctor__user__first_name__icontains=search) |
                Q(doctor__user__last_name__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Appointment creation failed. Data:", request.data)
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        queryset = self.get_queryset().filter(
            appointment_date__gte=today,
            appointment_date__lt=tomorrow
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        today = timezone.now()
        queryset = self.get_queryset().filter(appointment_date__gt=today)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past appointments"""
        today = timezone.now()
        queryset = self.get_queryset().filter(appointment_date__lt=today)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
