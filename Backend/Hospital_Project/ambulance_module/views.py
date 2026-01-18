from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from .models import *
from .serializers import *

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



# Ambulance Bill Views
class AmbulanceBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        queryset = AmbulanceBill.objects.select_related(
            'patient', 'ambulance', 'hospital_charge', 'created_by'
        ).order_by('-created_at')

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(patient__first_name__icontains=search) |
                Q(ambulance__vehicle_number__icontains=search) |
                Q(hospital_charge__charge_name__icontains=search)
            )

        serializer = AmbulanceBillListSerializer(queryset, many=True)
        return Response(serializer.data)


class AmbulanceBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            AmbulanceBill.objects.select_related('patient', 'ambulance', 'hospital_charge', 'created_by'),
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


class AmbulanceBillUpdateView(APIView):
    def put(self, request, pk):
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        serializer = AmbulanceBillUpdateSerializer(
            bill, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        # PATCH support added ✅
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        serializer = AmbulanceBillUpdateSerializer(
            bill, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceBillDeleteView(APIView):
    def delete(self, request, pk):
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        bill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q


from .models import Ambulance, AmbulanceBill, AmbulanceBillTransaction
from .serializers import (
    AmbulanceSerializer, AmbulanceCreateSerializer, AmbulanceUpdateSerializer,
    AmbulanceBillListSerializer, AmbulanceBillDetailSerializer,
    AmbulanceBillCreateSerializer, AmbulanceBillUpdateSerializer,
    AmbulanceBillTransactionSerializer, AmbulanceBillTransactionCreateSerializer
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


class AmbulanceDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        ambulance = get_object_or_404(Ambulance, pk=pk)
        serializer = AmbulanceSerializer(ambulance)
        return Response(serializer.data)

# Ambulance Bill Views
class AmbulanceBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        queryset = AmbulanceBill.objects.select_related(
            'patient', 'ambulance', 'hospital_charge', 'created_by'
        ).order_by('-created_at')

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(patient__first_name__icontains=search) |
                Q(ambulance__vehicle_number__icontains=search) |
                Q(hospital_charge__charge_name__icontains=search)
            )

        serializer = AmbulanceBillListSerializer(queryset, many=True)
        return Response(serializer.data)


class AmbulanceBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            AmbulanceBill.objects.select_related('patient', 'ambulance', 'hospital_charge', 'created_by'),
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


class AmbulanceBillUpdateView(APIView):
    def put(self, request, pk):
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        serializer = AmbulanceBillUpdateSerializer(
            bill, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        # PATCH support added ✅
        bill = get_object_or_404(AmbulanceBill, pk=pk)
        serializer = AmbulanceBillUpdateSerializer(
            bill, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceBillDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        bill = get_object_or_404(AmbulanceBill.objects.select_related('patient', 'ambulance', 'hospital_charge', 'created_by'),
            pk=pk
        )
        bill.delete()
        return Response({'message': 'Bill deleted successfully'})


# Transaction Views
class AmbulanceBillTransactionListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, bill_id):
        transactions = AmbulanceBillTransaction.objects.filter(bill_id=bill_id).order_by('-date', '-created_at')
        serializer = AmbulanceBillTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class AmbulanceBillTransactionCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bill_id):
        bill = get_object_or_404(AmbulanceBill, pk=bill_id)
        data = request.data.copy()
        data['bill'] = bill_id
        
        serializer = AmbulanceBillTransactionCreateSerializer(
            data=data, 
            context={'request': request}
        )
        if serializer.is_valid():
            transaction = serializer.save()
            # Reload bill to get updated paid_amount and balance
            bill.refresh_from_db()
            return Response({
                'message': 'Transaction created successfully',
                'transaction': AmbulanceBillTransactionSerializer(transaction).data,
                'bill': {
                    'paid_amount': str(bill.paid_amount),
                    'balance': str(bill.balance)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AmbulanceBillTransactionDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, bill_id, transaction_id):
        transaction = get_object_or_404(
            AmbulanceBillTransaction, 
            pk=transaction_id, 
            bill_id=bill_id
        )
        bill = transaction.bill
        transaction.delete()
        # Reload bill to get updated paid_amount and balance
        bill.refresh_from_db()
        return Response({
            'message': 'Transaction deleted successfully',
            'bill': {
                'paid_amount': str(bill.paid_amount),
                'balance': str(bill.balance)
            }
        })