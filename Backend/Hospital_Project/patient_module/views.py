from django.shortcuts import render
from rest_framework import permissions, viewsets
from .models import Patient
from .serializers import PatientSerializer

class IsStaffOrAuthenticatedPost(permissions.BasePermission):
    """
    - Allow SAFE methods to anyone.
    - Allow POST to any authenticated user.
    - Require staff for PUT/PATCH/DELETE.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            return bool(request.user and request.user.is_authenticated)
        # For write/update/delete, require staff
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-id')
    serializer_class = PatientSerializer
    permission_classes = [IsStaffOrAuthenticatedPost]
