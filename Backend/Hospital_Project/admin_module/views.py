from rest_framework import viewsets
from .models import AdminProfile
from .serializers import AdminProfileSerializer
from rest_framework.permissions import IsAuthenticated

class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdminProfile.objects.filter(user=self.request.user)
