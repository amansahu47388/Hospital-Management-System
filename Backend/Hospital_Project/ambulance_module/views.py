from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from .models import Ambulance, AmbulanceChargeCategory, AmbulanceCharge, AmbulanceBill
from .serializers import (
    AmbulanceSerializer, AmbulanceCreateSerializer, AmbulanceUpdateSerializer,
    AmbulanceChargeCategorySerializer, AmbulanceChargeSerializer, AmbulanceChargeCreateSerializer,
    AmbulanceBillListSerializer, AmbulanceBillDetailSerializer,
    AmbulanceBillCreateSerializer, AmbulanceBillUpdateSerializer
)


# Ambulance CRUD Views
class AmbulanceListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ambulances = Ambulance.objects.all()
        serializer = AmbulanceSerializer(ambulances, many=True)
        return Response(serializer.data)


class AmbulanceCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AmbulanceCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ambulance = serializer.save()
            return Response({
                'message': 'Ambulance created successfully',
                'ambulance': AmbulanceSerializer(ambulance).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        ambulance = get_object_or_404(Ambulance, pk=pk)
        serializer = AmbulanceUpdateSerializer(ambulance, data=request.data)
        if serializer.is_valid():
            ambulance = serializer.save()
            return Response({
                'message': 'Ambulance updated successfully',
                'ambulance': AmbulanceSerializer(ambulance).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        ambulance = get_object_or_404(Ambulance, pk=pk)
        ambulance.delete()
        return Response({'message': 'Ambulance deleted successfully'})


# Ambulance Charge Category Views
class AmbulanceChargeCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = AmbulanceChargeCategory.objects.all()
        serializer = AmbulanceChargeCategorySerializer(categories, many=True)
        return Response(serializer.data)


class AmbulanceChargeCategoryCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AmbulanceChargeCategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response({
                'message': 'Charge category created successfully',
                'category': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Ambulance Charge Views
class AmbulanceChargeListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        charges = AmbulanceCharge.objects.select_related('category')
        serializer = AmbulanceChargeSerializer(charges, many=True)
        return Response(serializer.data)


class AmbulanceChargeCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AmbulanceChargeCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            charge = serializer.save()
            return Response({
                'message': 'Charge created successfully',
                'charge': AmbulanceChargeSerializer(charge).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceChargeUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        charge = get_object_or_404(AmbulanceCharge, pk=pk)
        serializer = AmbulanceChargeCreateSerializer(charge, data=request.data)
        if serializer.is_valid():
            charge = serializer.save()
            return Response({
                'message': 'Charge updated successfully',
                'charge': AmbulanceChargeSerializer(charge).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceChargeDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        charge = get_object_or_404(AmbulanceCharge, pk=pk)
        charge.delete()
        return Response({'message': 'Charge deleted successfully'})


# Ambulance Bill Views
class AmbulanceBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        queryset = AmbulanceBill.objects.select_related(
            'patient', 'ambulance', 'charge', 'hospital_charge', 'created_by'
        ).order_by('-created_at')

        if search:
            queryset = queryset.filter(
                Q(bill_no__icontains=search) |
                Q(patient__first_name__icontains=search) |
                Q(ambulance__vehicle_number__icontains=search) |
                Q(charge__charge_name__icontains=search) |
                Q(hospital_charge__charge_name__icontains=search)
            )

        serializer = AmbulanceBillListSerializer(queryset, many=True)
        return Response(serializer.data)


class AmbulanceBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            AmbulanceBill.objects.select_related('patient', 'ambulance', 'charge', 'created_by'),
            pk=pk
        )
        serializer = AmbulanceBillDetailSerializer(bill)
        return Response(serializer.data)


class GenerateAmbulanceBillAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = AmbulanceBillCreateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                bill = serializer.save()
                return Response({
                    'success': True,
                    'bill_id': bill.id,
                    'bill_no': bill.bill_no,
                    'total': bill.total_amount,
                    'net_amount': bill.net_amount,
                    'balance': bill.balance,
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error creating ambulance bill: {error_trace}")
            return Response({
                'success': False,
                'message': str(e),
                'error': 'An error occurred while creating the bill. Please check if database migrations have been applied.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AmbulanceBillUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        serializer = AmbulanceBillUpdateSerializer(bill, data=request.data)
        if serializer.is_valid():
            bill = serializer.save()
            return Response({
                'success': True,
                'bill_id': bill.id,
                'bill_no': bill.bill_no,
                'total': bill.total_amount,
                'net_amount': bill.net_amount,
                'balance': bill.balance,
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceBillDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        bill.delete()
        return Response({'message': 'Bill deleted successfully'})
