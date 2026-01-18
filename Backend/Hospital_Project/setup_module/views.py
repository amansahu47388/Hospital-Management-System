from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import *
from .serializers import *



# **************************************************************** #
#                       Hospital Setup APIs                        #
# **************************************************************** #   
class ChargeUnitAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeUnit, pk=pk)
            serializer = ChargeUnitSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeUnit.objects.all().order_by("unit_type")
        serializer = ChargeUnitSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeUnit, pk=pk)
        serializer = ChargeUnitSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeUnit, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeTypeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeType, pk=pk)
            serializer = ChargeTypeSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeType.objects.all().order_by("charge_type")
        serializer = ChargeTypeSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeType, pk=pk)
        serializer = ChargeTypeSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeType, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeCategoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeCategory, pk=pk)
            serializer = ChargeCategorySerializer(obj)
            return Response(serializer.data)

        queryset = (
            ChargeCategory.objects
            .select_related("charge_type")
            .all()
            .order_by("category_name")
        )
        serializer = ChargeCategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeCategory, pk=pk)
        serializer = ChargeCategorySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeCategory, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeTaxAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeTax, pk=pk)
            serializer = ChargeTaxSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeTax.objects.all().order_by("tax_percentage")
        serializer = ChargeTaxSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeTaxSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeTax, pk=pk)
        serializer = ChargeTaxSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeTax, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HospitalChargesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # ✅ LIST / DETAILS
    def get(self, request, pk=None):
        if pk:
            charge = get_object_or_404(HospitalCharges, pk=pk)
            serializer = HospitalChargesSerializer(charge)
            return Response(serializer.data, status=status.HTTP_200_OK)

        charges = HospitalCharges.objects.all().order_by("-id")
        serializer = HospitalChargesSerializer(charges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ CREATE
    def post(self, request):
        serializer = HospitalChargesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ UPDATE
    def put(self, request, pk):
        charge = get_object_or_404(HospitalCharges, pk=pk)
        serializer = HospitalChargesSerializer(
            charge, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ DELETE
    def delete(self, request, pk):
        charge = get_object_or_404(HospitalCharges, pk=pk)
        charge.delete()
        return Response(
            {"message": "Hospital charge deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )




















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


    