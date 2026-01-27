from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from .models import *
from .serializers import *
from opd_ipd_module.models import Prescription
from django.db import transaction

class RadiologyCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RadiologyCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response({"message": "Radiology category created successfully"}, status=201)

    def get(self, request):
        categories = RadiologyCategory.objects.all()
        serializer = RadiologyCategorySerializer(categories, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        category = get_object_or_404(RadiologyCategory, pk=pk)
        serializer = RadiologyCategorySerializer(category, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Radiology category updated successfully"})

    def delete(self, request, pk):
        category = get_object_or_404(RadiologyCategory, pk=pk)
        category.delete()
        return Response({"message": "Radiology category deleted successfully"})



class RadiologyParameterAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RadiologyParameterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response({"message": "Radiology parameter created successfully"}, status=201)

    def get(self, request):
        parameters = RadiologyParameter.objects.all()
        serializer = RadiologyParameterSerializer(parameters, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        parameter = get_object_or_404(RadiologyParameter, pk=pk)
        serializer = RadiologyParameterSerializer(parameter, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Radiology parameter updated successfully"})

    def delete(self, request, pk):
        parameter = get_object_or_404(RadiologyParameter, pk=pk)
        parameter.delete()
        return Response({"message": "Radiology parameter deleted successfully"})




class RadiologyTestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RadiologyTestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response({"message": "Radiology test created successfully"}, status=201)


class RadiologyTestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tests = RadiologyTest.objects.select_related("category", "charges")
        serializer = RadiologyTestListSerializer(tests, many=True)
        return Response(serializer.data)


class RadiologyTestUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        test = get_object_or_404(RadiologyTest, pk=pk)
        serializer = RadiologyTestUpdateSerializer(test, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Radiology test updated successfully"})


class RadiologyTestDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        test = get_object_or_404(RadiologyTest, pk=pk)
        test.delete()
        return Response({"message": "Radiology test deleted successfully"})

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RadiologyCategory, RadiologyParameter
from .serializers import RadiologyCategorySerializer, RadiologyParameterSerializer



class GenerateRadiologyBillAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RadiologyBillCreateSerializer(
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


class RadiologyBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        patient_id = request.query_params.get("patient_id", "").strip()

        queryset = RadiologyBill.objects.select_related(
            "patient", "doctor", "created_by", "case"
        ).prefetch_related("items").order_by("-created_at")

        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        if search:
            queryset = queryset.filter(
                Q(bill_no__icontains=search) |
                Q(patient__first_name__icontains=search) |
                Q(patient__last_name__icontains=search) |
                Q(patient__phone__icontains=search)
            )

        serializer = RadiologyBillListSerializer(queryset, many=True)
        return Response(serializer.data)


class RadiologyBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            RadiologyBill.objects.select_related("patient", "doctor", "created_by", "prescription", "case")
            .prefetch_related("items__test"),
            pk=pk
        )
        serializer = RadiologyBillDetailSerializer(bill)
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
        


class RadiologyBillUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def put(self, request, pk):
        bill = get_object_or_404(RadiologyBill, pk=pk)

        serializer = RadiologyBillCreateSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        tests = data.pop("tests")

        # Update simple bill fields
        bill.patient_id = data.get("patient_id", bill.patient_id)
        bill.doctor_id = data.get("doctor_id", bill.doctor_id)
        bill.prescription_id = data.get("prescription_id", bill.prescription_id)
        bill.note = data.get("note", bill.note)
        bill.previous_report_value = data.get("previous_report_value", bill.previous_report_value)
        bill.payment_mode = data.get("payment_mode", bill.payment_mode)
        bill.discount = data.get("discount", bill.discount)
        bill.paid_amount = data.get("paid_amount", bill.paid_amount)
        bill.case_id = data.get("case_id", bill.case_id)

        # Remove old items
        bill.items.all().delete()

        subtotal = 0
        tax_total = 0

        for t in tests:
            test = RadiologyTest.objects.get(id=t["test_id"])
            price = test.standard_charge
            tax = (price * test.tax) / 100

            RadiologyBillItem.objects.create(
                bill=bill,
                test=test,
                price=price,
                tax=tax,
                report_days=test.report_days or 0,
                report_date=timezone.now().date() + timedelta(days=test.report_days or 0),
            )

            subtotal += price
            tax_total += tax

        bill.subtotal = subtotal
        bill.tax = tax_total
        bill.total_amount = subtotal + tax_total - bill.discount
        bill.balance = bill.total_amount - bill.paid_amount
        bill.save()

        return Response({"success": True, "message": "Bill updated successfully"})



class RadiologyBillDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        bill = get_object_or_404(RadiologyBill, pk=pk)
        bill.delete()
        return Response({"success": True, "message": "Bill deleted successfully"})

