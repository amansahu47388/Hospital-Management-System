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

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            # Create AdminProfile if it doesn't exist
            AdminProfile.objects.create(user=request.user)
            queryset = self.get_queryset()
        return super().list(request, *args, **kwargs)
