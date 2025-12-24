import logging
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Patient
from .serializers import PatientSerializer, PatientCreateUpdateSerializer

logger = logging.getLogger(__name__)

class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class PatientListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            patients = Patient.objects.filter(is_active=True).order_by('-created_at')
            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching patients: {str(e)}", exc_info=True)
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(id=patient_id, is_active=True)
            serializer = PatientSerializer(patient)
            logger.info(f"✅ Patient {patient_id} fetched successfully")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            logger.warning(f"Patient {patient_id} not found")
            return Response(
                {"detail": "Patient not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching patient {patient_id}: {str(e)}", exc_info=True)
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        try:
            logger.info(f"📝 Creating patient - User: {request.user}, Data: {request.data}")
            
            if not request.user.is_staff:
                logger.warning(f"❌ Non-admin user {request.user} attempted to create patient")
                return Response(
                    {"detail": "Only admin users can create patients."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = PatientCreateUpdateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                patient = serializer.save()
                response_serializer = PatientSerializer(patient)
                return Response(
                    response_serializer.data,
                    status=status.HTTP_201_CREATED
                )
            else:
                logger.error(f"❌ Serializer validation errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"❌ Error creating patient: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"Internal server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, patient_id):
        try:
            logger.info(f"📝 Updating patient ID={patient_id}")
            logger.info(f"Request data: {request.data}")
            
            # Check admin permission
            if not request.user.is_staff:
                logger.warning(f"❌ Non-admin user {request.user} attempted to update patient")
                return Response(
                    {"detail": "Only admin users can update patients."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get patient
            try:
                patient = Patient.objects.get(id=patient_id, is_active=True)
            except Patient.DoesNotExist:
                logger.warning(f"❌ Patient {patient_id} not found")
                return Response(
                    {"detail": "Patient not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update patient
            serializer = PatientCreateUpdateSerializer(
                patient,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            
            if serializer.is_valid():
                updated_patient = serializer.save()
                response_serializer = PatientSerializer(updated_patient)
                logger.info(f"✅ Patient {patient_id} updated successfully")
                return Response(
                    response_serializer.data,
                    status=status.HTTP_200_OK
                )
            else:
                logger.error(f"❌ Serializer validation errors: {serializer.errors}")
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"❌ Error updating patient {patient_id}: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"Error updating patient: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, patient_id):
        try:
            logger.info(f"🗑️ Deleting patient {patient_id}")
            
            patient = Patient.objects.get(id=patient_id, is_active=True)
            patient_name = patient.full_name
            
            # Hard delete
            patient.delete()
            
            logger.info(f"✅ Patient {patient_id} ({patient_name}) deleted successfully")
            return Response(
                {
                    "detail": f"Patient {patient_name} has been permanently deleted.",
                    "id": patient_id
                },
                status=status.HTTP_200_OK
            )
        except Patient.DoesNotExist:
            logger.warning(f"❌ Patient {patient_id} not found")
            return Response(
                {"detail": "Patient not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"❌ Error deleting patient {patient_id}: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"Error deleting patient: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            query = request.query_params.get('q', '')
            logger.info(f"🔍 Searching patients with query: '{query}'")
            
            if not query or len(query) < 2:
                return Response([], status=status.HTTP_200_OK)
            
            patients = Patient.objects.filter(
                is_active=True
            ).filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(phone__icontains=query)
            ).order_by('-created_at')
            
            serializer = PatientSerializer(patients, many=True)
            logger.info(f"✅ Found {patients.count()} patients")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"❌ Error searching patients: {str(e)}", exc_info=True)
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientSearchAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response([], status=200)
        qs = Patient.objects.filter(
            Q(first_name__icontains=q) |
            Q(last_name__icontains=q) |
            Q(mobile__icontains=q) |
            Q(pk__iexact=q)
        )[:20]
        serializer = PatientSerializer(qs, many=True)
        return Response(serializer.data)