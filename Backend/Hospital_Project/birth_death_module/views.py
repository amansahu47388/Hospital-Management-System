from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q

from .models import BirthRecord, DeathRecord
from .serializers import (
    BirthRecordSerializer, BirthRecordCreateSerializer, BirthRecordUpdateSerializer,
    DeathRecordSerializer, DeathRecordCreateSerializer, DeathRecordUpdateSerializer
)


# ==================== BIRTH RECORDS ====================

class BirthRecordListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        
        records = BirthRecord.objects.all().select_related('created_by').order_by('-created_at')
        
        if search:
            records = records.filter(
                Q(id__icontains=search) |
                Q(child_name__icontains=search) |
                Q(mother_name__icontains=search) |
                Q(father_name__icontains=search) |
                Q(case_id__icontains=search)
            )
        
        serializer = BirthRecordSerializer(records, many=True)
        
        # Transform for frontend table format
        transformed_data = []
        for record in serializer.data:
            transformed_data.append({
                'id': record['id'],
                'caseId': record['case_id'] or '',
                'generatedBy': record['created_by_name'] or 'N/A',
                'childName': record['child_name'],
                'gender': record['gender'],
                'birthDate': record['birth_date_formatted'] or '',
                'mother': record['mother_name'],
                'father': record['father_name'] or '',
            })
        
        return Response(transformed_data)


class BirthRecordDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        record = get_object_or_404(
            BirthRecord.objects.select_related('created_by'),
            pk=pk
        )
        # Pass request context to serializer for absolute URLs
        data = BirthRecordSerializer(record, context={'request': request}).data

        # Build absolute URLs for photos if they exist
        def build_absolute_url(url):
            if url and request:
                return request.build_absolute_uri(url)
            return url

        transformed = {
            "id": data["id"],
            "childName": data["child_name"],
            "gender": data["gender"],
            "weight": data["weight"],
            "birthDate": data["birth_date_formatted"],
            "phone": data["phone"],
            "address": data["address"],
            "caseId": data["case_id"],
            "motherName": data["mother_name"],
            "fatherName": data["father_name"],
            "report": data["report"],
            "childPhoto": build_absolute_url(data.get("child_photo")),
            "motherPhoto": build_absolute_url(data.get("mother_photo")),
            "fatherPhoto": build_absolute_url(data.get("father_photo")),
            "document": build_absolute_url(data.get("document_photo")),
            "createdBy": data["created_by_name"],
        }

        return Response(transformed)



class BirthRecordCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BirthRecordCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            return Response({
                'message': 'Birth record created successfully',
                'data': BirthRecordSerializer(record).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BirthRecordUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        record = get_object_or_404(BirthRecord, pk=pk)
        serializer = BirthRecordUpdateSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            record = serializer.save()
            return Response({
                'message': 'Birth record updated successfully',
                'data': BirthRecordSerializer(record).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BirthRecordDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        record = get_object_or_404(BirthRecord, pk=pk)
        record.delete()
        return Response({'message': 'Birth record deleted successfully'})


# ==================== DEATH RECORDS ====================

class DeathRecordListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        
        records = DeathRecord.objects.all().select_related('created_by').order_by('-created_at')
        
        if search:
            records = records.filter(
                Q(id__icontains=search) |
                Q(patient_name__icontains=search) |
                Q(guardian_name__icontains=search) |
                Q(case_id__icontains=search)
            )
        
        serializer = DeathRecordSerializer(records, many=True)
        
        # Transform for frontend table format
        transformed_data = []
        for record in serializer.data:
            transformed_data.append({
                'id': record['id'],
                'caseId': record['case_id'] or '',
                'generatedBy': record['created_by_name'] or 'N/A',
                'patient': record['patient_name'],
                'patientName': record['patient_name'],  # Keep both for compatibility
                'date': record['death_date_formatted'] or '',
                'deathDate': record['death_date_formatted'] or '',  # Keep both for compatibility
                'guardian': record['guardian_name'] or '',
                'guardianName': record['guardian_name'] or '',  # Keep both for compatibility
                'gender': '',  # Death record doesn't have gender, but table expects it
                'report': record['report'] or '-',
            })
        
        return Response(transformed_data)


class DeathRecordDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        record = get_object_or_404(DeathRecord.objects.select_related('created_by'), pk=pk)
        serializer = DeathRecordSerializer(record)
        return Response(serializer.data)


class DeathRecordCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeathRecordCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            return Response({
                'message': 'Death record created successfully',
                'data': DeathRecordSerializer(record).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeathRecordUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        record = get_object_or_404(DeathRecord, pk=pk)
        serializer = DeathRecordUpdateSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            record = serializer.save()
            return Response({
                'message': 'Death record updated successfully',
                'data': DeathRecordSerializer(record).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeathRecordDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        record = get_object_or_404(DeathRecord, pk=pk)
        record.delete()
        return Response({'message': 'Death record deleted successfully'})
