from rest_framework import viewsets
from .models import AdminProfile
from .serializers import DoctorSerializer
from rest_framework.permissions import IsAuthenticated

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdminProfile.objects.select_related('user').all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
