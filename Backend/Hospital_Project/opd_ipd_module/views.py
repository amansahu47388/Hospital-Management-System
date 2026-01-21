from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import OpdPatient , IpdPatient, IpdDischarge
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.db.models import ProtectedError
from .serializers import IpdPatientCreateSerializer, IpdPatientListSerializer, IpdPatientListSerializer, IpdPatientSerializer, OpdPatientSerializer, OpdPatientCreateSerializer , OpdPatientListSerializer, IpdDischargeSerializer
from django.utils.timezone import now
from .serializers import OpdPatientUpdateSerializer , IpdPatientUpdateSerializer, IpdDischargedListSerializer, PrescriptionSerializer
from rest_framework.views import APIView


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


class OpdPatientUpdateAPIView(generics.UpdateAPIView):
    queryset = OpdPatient.objects.all()
    serializer_class = OpdPatientUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]


class OpdPatientDeleteAPIView(generics.DestroyAPIView):
    queryset = OpdPatient.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        try:
            instance = self.get_object()
        except Http404:
            return Response({"detail": "OPD not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            instance.delete()
            return Response({"detail": "OPD deleted successfully."}, status=status.HTTP_200_OK)
        except ProtectedError:
            return Response({"detail": "Cannot delete OPD because it is referenced by other records."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Failed to delete OPD.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# IPD Patient Views
class IpdPatientCreateAPIView(generics.CreateAPIView):
    queryset = IpdPatient.objects.all()
    serializer_class = IpdPatientCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ IPD CREATE ERROR:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class IpdPatientListAPIView(generics.ListAPIView):
    serializer_class = IpdPatientListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IpdPatient.objects.filter(is_discharged=False)

class IpdPatientDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = IpdPatient.objects.all()
    serializer_class = IpdPatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class IpdPatientUpdateAPIView(generics.UpdateAPIView):
    queryset = IpdPatient.objects.all()
    serializer_class = IpdPatientUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]


class IpdPatientDeleteAPIView(generics.DestroyAPIView):
    queryset = IpdPatient.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        try:
            instance = self.get_object()
        except Http404:
            return Response({"detail": "IPD not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            instance.delete()
            return Response({"detail": "IPD deleted successfully."}, status=status.HTTP_200_OK)
        except ProtectedError:
            return Response({"detail": "Cannot delete IPD because it is referenced by other records."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Failed to delete IPD.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IpdDischargeCreateAPIView(generics.CreateAPIView):
    serializer_class = IpdDischargeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        ipd = get_object_or_404(
            IpdPatient,
            pk=kwargs["pk"],
            is_discharged=False
        )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # save discharge record linking to IPD
        discharge = serializer.save(
            ipd_patient=ipd,
            patient=ipd.patient
        )

        # mark IPD discharged and snapshot discharge_date
        bed = ipd.bed
        ipd.is_discharged = True
        ipd.discharge_date = serializer.validated_data.get("discharge_date")
        # free bed on ipd and mark bed available
        ipd.bed = None
        ipd.save()

        if bed:
            bed.status = "available"
            bed.save()

        return Response(
            {"detail": "Patient discharged successfully", "discharge": IpdDischargeSerializer(discharge).data},
            status=status.HTTP_201_CREATED
        )


class IpdDischargedPatientListAPIView(generics.ListAPIView):
    serializer_class = IpdDischargedListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            IpdPatient.objects
            .filter(is_discharged=True)
            .select_related("patient", "doctor", "created_by")
            .order_by("-discharge_date")
        )
    

class IpdDischargeRevertAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        ipd = get_object_or_404(IpdPatient, pk=pk, is_discharged=True)

        discharge = get_object_or_404(IpdDischarge, ipd_patient=ipd)

        # OPTIONAL: store bed before discharge if needed
        # bed = discharge.bed_snapshot (if you add snapshot logic)

        # revert ipd
        ipd.is_discharged = False
        ipd.discharge_date = None
        ipd.save()

        # delete discharge record
        discharge.delete()

        return Response(
            {"detail": "Discharge reverted successfully"},
            status=status.HTTP_200_OK
        )


class PrescriptionAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Prescription, pk=pk)
            serializer = PrescriptionSerializer(obj)
            return Response(serializer.data)
        queryset = Prescription.objects.all().order_by("-created_at")
        serializer = PrescriptionSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(Prescription, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
