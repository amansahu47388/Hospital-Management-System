from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import OpdPatient
from .serializers import OpdPatientSerializer, OpdPatientCreateSerializer , OpdPatientListSerializer
from django.utils.timezone import now


class OpdPatientCreateAPIView(generics.CreateAPIView):
    queryset = OpdPatient.objects.all()
    serializer_class = OpdPatientCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ OPD CREATE ERROR:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class OpdPatientListAPIView(generics.ListAPIView):
    serializer_class = OpdPatientListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = OpdPatient.objects.select_related(
            "patient", "doctor", "created_by", "symptom"
        ).order_by("-created_at")

        tab = self.request.query_params.get("tab")

        if tab == "today":
            qs = qs.filter(appointment_date__date=now().date())
        elif tab == "upcoming":
            qs = qs.filter(appointment_date__gt=now())
        elif tab == "old":
            qs = qs.filter(appointment_date__lt=now())

        return qs


class OpdPatientDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = OpdPatient.objects.all()
    serializer_class = OpdPatientSerializer
    permission_classes = [permissions.IsAuthenticated]