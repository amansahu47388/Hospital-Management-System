from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    MedicineCategory, Company, MedicineGroup, Unit,
    Supplier, MedicineDosage, Dosage, Medicine
)
from .serializers import (
    MedicineCategorySerializer, CompanySerializer,
    MedicineGroupSerializer, UnitSerializer,
    SupplierSerializer, MedicineDosageSerializer,
    DosageSerializer, MedicineSerializer
)



# ----------------- CATEGORY LIST -----------------
class MedicineCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MedicineCategory.objects.all().order_by("category_name")
        serializer = MedicineCategorySerializer(qs, many=True)
        return Response(serializer.data)



# ----------------- COMPANY LIST -----------------
class CompanyListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Company.objects.all().order_by("company_name")
        serializer = CompanySerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- GROUP LIST -----------------
class MedicineGroupListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MedicineGroup.objects.all().order_by("group_name")
        serializer = MedicineGroupSerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- UNIT LIST -----------------
class UnitListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Unit.objects.all().order_by("unit_name")
        serializer = UnitSerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- SUPPLIER LIST -----------------
class SupplierListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Supplier.objects.filter(is_active=True).order_by("supplier_name")
        serializer = SupplierSerializer(qs, many=True)
        return Response(serializer.data)





# ----------------- MEDICINE DOSAGE LIST -----------------
class MedicineDosageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MedicineDosage.objects.filter(is_active=True)\
            .select_related("category_name", "unit")\
            .order_by("category_name", "dosage")

        serializer = MedicineDosageSerializer(qs, many=True)
        return Response(serializer.data)





# ----------------- DOSAGE LIST -----------------
class DosageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Dosage.objects.filter(is_active=True).order_by("dosage_interval")
        serializer = DosageSerializer(qs, many=True)
        return Response(serializer.data)





# --------------------   MEDICINE VIEW   ----------------------------
# ---------- LIST ----------
class MedicineListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Medicine.objects.filter(is_active=True).order_by("-id")
        serializer = MedicineSerializer(qs, many=True)
        return Response(serializer.data)



# ---------- CREATE ----------
class MedicineCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ---------- DETAIL ----------
class MedicineDetaisAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            medicine = Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            return Response({"error": "Medicine not found"}, status=404)

        serializer = MedicineSerializer(medicine)
        return Response(serializer.data)



# ---------- UPDATE ----------
class MedicineUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            medicine = Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            return Response({"error": "Medicine not found"}, status=404)

        serializer = MedicineSerializer(medicine, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    



# ---------- UPDATE ----------
class MedicineUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            medicine = Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            return Response({"error": "Medicine not found"}, status=404)

        serializer = MedicineSerializer(medicine, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ---------- DELETE ----------
class MedicineDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            medicine = Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            return Response({"error": "Medicine not found"}, status=404)

        medicine.is_active = False
        medicine.save()
        return Response({"message": "Medicine deleted successfully"})
