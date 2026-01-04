from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import PathologyCategory, PathologyParameter, PathologyTest, PathologyBill
from .serializers import (
    PathologyTestCreateSerializer, PathologyTestListSerializer, PathologyTestUpdateSerializer,
    PathologyBillCreateSerializer, PathologyBillListSerializer, PathologyBillDetailSerializer
)
from opd_ipd_module.models import Prescription





class PathologyTestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PathologyTestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            print("❌ SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(created_by=request.user)
        return Response(
            {"message": "Pathology test created successfully"},
            status=status.HTTP_201_CREATED
        )




class PathologyTestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = (
            PathologyTest.objects
            .select_related("category", "charges")
            .order_by("-id")
        )

        serializer = PathologyTestListSerializer(queryset, many=True)
        return Response(serializer.data)







class PathologyCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PathologyCategory.objects.values("id", "category_name")
        return Response(data)




class PathologyParameterListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PathologyParameter.objects.values(
            "id", "parameter_name", "reference_range", "unit", "description"
        )
        return Response(data)





class PathologyTestDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        pathology_test = get_object_or_404(PathologyTest, pk=pk)

        pathology_test.delete()

        return Response(
            {"message": "Pathology test deleted successfully"},
            status=status.HTTP_200_OK
        )
    

class PathologyTestUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        test = get_object_or_404(PathologyTest, pk=pk)

        serializer = PathologyTestUpdateSerializer(
            test, data=request.data
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response(
            {"message": "Pathology test updated successfully"},
            status=200
        )


class GeneratePathologyBillAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PathologyBillCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            bill = serializer.save()
            return Response(
                {
                    "success": True,
                    "bill_id": bill.id,
                    "bill_no": bill.bill_no,
                    "total": bill.total_amount,
                    "balance": bill.balance,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class PathologyBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        queryset = PathologyBill.objects.select_related(
            "patient", "doctor", "created_by"
        ).prefetch_related("items").order_by("-created_at")

        if search:
            queryset = queryset.filter(
                Q(bill_no__icontains=search) |
                Q(patient__first_name__icontains=search) |
                Q(patient__last_name__icontains=search) |
                Q(patient__phone__icontains=search)
            )

        serializer = PathologyBillListSerializer(queryset, many=True)
        return Response(serializer.data)


class PathologyBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            PathologyBill.objects.select_related("patient", "doctor", "created_by", "prescription")
            .prefetch_related("items__test"),
            pk=pk
        )
        serializer = PathologyBillDetailSerializer(bill)
        return Response(serializer.data)


class PrescriptionSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prescription_id = request.query_params.get("id", "").strip()
        
        if not prescription_id:
            return Response(
                {"error": "Prescription ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            prescription = Prescription.objects.get(id=prescription_id)
            
            # Try to get patient from related pathology bills or other sources
            # For now, return basic prescription info
            return Response({
                "id": prescription.id,
                "created_at": prescription.created_at,
                "finding": prescription.fnding if hasattr(prescription, 'fnding') else None,
            })
        except Prescription.DoesNotExist:
            return Response(
                {"error": "Prescription not found"},
                status=status.HTTP_404_NOT_FOUND
            )