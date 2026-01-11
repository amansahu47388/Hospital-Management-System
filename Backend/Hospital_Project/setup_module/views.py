from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Symptom, HospitalCharges, Bed


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


class BedListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = list(Bed.objects.values("id", "bed_name", "bed_type", "bed_group", "status", "floor"))
        return Response(data)


class ChargeCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get unique charge categories from HospitalCharges
        categories = HospitalCharges.objects.values_list('charge_category', flat=True).distinct()
        # Convert to list of dictionaries with id and name
        category_list = [{'id': idx + 1, 'category_name': cat} for idx, cat in enumerate(categories) if cat]
        return Response(category_list)


    