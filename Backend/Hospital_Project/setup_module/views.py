from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Symptom
from .models import HospitalCharges

# Create your views here.
class SymptomListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = list(Symptom.objects.values("id", "symptom_title", "symptom_type", "description"))
        return Response(data)


class HospitalChargesListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            HospitalCharges.objects.values("id", "charge_category", "charge_name","charge_type", "charge_amount","charge_description", "tax", "unit")
        )
