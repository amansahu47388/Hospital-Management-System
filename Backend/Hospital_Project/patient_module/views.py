import logging
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import *
from .serializers import *

logger = logging.getLogger(__name__)



#*******************************************************************************************************#
#                            Patient Views
#*******************************************************************************************************#
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







#*******************************************************************************************************#
#                            Patient Vital Views
#*******************************************************************************************************#
class PatientVitalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, patient_id, pk):
        try:
            return PatientVital.objects.get(
                id=pk,
                patient_id=patient_id,
                is_active=True
            )
        except PatientVital.DoesNotExist:
            return None

    def get(self, request, patient_id, pk=None):
        if pk:
            vital = self.get_object(patient_id, pk)
            if not vital:
                return Response({"detail": "Vital record not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = PatientVitalSerializer(vital)
            return Response(serializer.data)
        
        vitals = PatientVital.objects.filter(
            patient_id=patient_id,
            is_active=True
        ).order_by('-vital_date', '-created_at')
        serializer = PatientVitalSerializer(vitals, many=True)
        return Response(serializer.data)

    def post(self, request, patient_id):
        try:
            data = request.data.copy()
            data['patient'] = patient_id
            
            logger.info(f"📝 Creating Vital for patient {patient_id}: {data}")

            serializer = PatientVitalSerializer(data=data)
            if serializer.is_valid():
                serializer.save(created_by=request.user)
                logger.info(f"✅ Vital created for patient {patient_id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            logger.error(f"❌ Vital validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"❌ Error creating vital: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, patient_id, pk):
        try:
            vital = self.get_object(patient_id, pk)
            if not vital:
                return Response({"detail": "Vital record not found"}, status=status.HTTP_404_NOT_FOUND)
            
            logger.info(f"📝 Updating Vital {pk} for patient {patient_id}: {request.data}")

            serializer = PatientVitalSerializer(
                vital, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                logger.info(f"✅ Vital {pk} updated")
                return Response(serializer.data)
            
            logger.error(f"❌ Vital update validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"❌ Error updating vital: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, patient_id, pk):
        vital = self.get_object(patient_id, pk)
        if not vital:
            return Response({"detail": "Vital record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        vital.is_active = False
        vital.save()
        return Response({"detail": "Vital deleted successfully"}, status=status.HTTP_200_OK)



#*******************************************************************************************************#
#                            Patient Operation Views
#*******************************************************************************************************#

class PatientOperationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, patient_id, pk):
        try:
            return PatientOperation.objects.get(
                id=pk,
                patient_id=patient_id,
                is_active=True
            )
        except PatientOperation.DoesNotExist:
            return None

    def get(self, request, patient_id, pk=None):
        if pk:
            operation = self.get_object(patient_id, pk)
            if not operation:
                return Response({"detail": "Operation record not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = PatientOperationSerializer(operation)
            return Response(serializer.data)
        
        operations = PatientOperation.objects.filter(
            patient_id=patient_id,
            is_active=True
        ).order_by('-operation_date', '-created_at')
        serializer = PatientOperationSerializer(operations, many=True)
        return Response(serializer.data)

    def post(self, request, patient_id):
        data = request.data.copy()
        data['patient'] = patient_id

        serializer = PatientOperationSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, patient_id, pk):
        operation = self.get_object(patient_id, pk)
        if not operation:
            return Response({"detail": "Operation record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientOperationSerializer(
            operation, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id, pk):
        operation = self.get_object(patient_id, pk)
        if not operation:
            return Response({"detail": "Operation record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        operation.is_active = False
        operation.save()
        return Response({"detail": "Operation deleted successfully"}, status=status.HTTP_200_OK)





#*******************************************************************************************************#
#                            Patient Consultant Views
#*******************************************************************************************************#
class PatientConsultantView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, patient_id, pk):
        try:
            return PatientConsultant.objects.get(
                id=pk,
                patient_id=patient_id,
                is_active=True
            )
        except PatientConsultant.DoesNotExist:
            return None

    def get(self, request, patient_id, pk=None):
        if pk:
            consultant = self.get_object(patient_id, pk)
            if not consultant:
                return Response({"detail": "Consultant record not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = PatientConsultantSerializer(consultant)
            return Response(serializer.data)
        
        consultants = PatientConsultant.objects.filter(
            patient_id=patient_id,
            is_active=True
        ).order_by('-consultant_date', '-created_at')
        serializer = PatientConsultantSerializer(consultants, many=True)
        return Response(serializer.data)

    def post(self, request, patient_id):
        data = request.data.copy()
        data['patient'] = patient_id

        serializer = PatientConsultantSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, patient_id, pk):
        consultant = self.get_object(patient_id, pk)
        if not consultant:
            return Response({"detail": "Consultant record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientConsultantSerializer(
            consultant, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id, pk):
        consultant = self.get_object(patient_id, pk)
        if not consultant:
            return Response({"detail": "Consultant record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        consultant.is_active = False
        consultant.save()
        return Response({"detail": "Consultant deleted successfully"}, status=status.HTTP_200_OK)






#*******************************************************************************************************#
#                            Patient Charges Views
#*******************************************************************************************************#
class PatientChargesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, patient_id, pk):
        try:
            return PatientCharges.objects.get(
                id=pk,
                patient_id=patient_id,
                is_active=True
            )
        except PatientCharges.DoesNotExist:
            return None

    def get(self, request, patient_id, pk=None):
        if pk:
            charge = self.get_object(patient_id, pk)
            if not charge:
                return Response({"detail": "Charge record not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = PatientChargesSerializer(charge)
            return Response(serializer.data)
        
        charges = PatientCharges.objects.filter(
            patient_id=patient_id,
            is_active=True
        ).order_by('-charge_date', '-created_at')
        serializer = PatientChargesSerializer(charges, many=True)
        return Response(serializer.data)

    def post(self, request, patient_id):
        data = request.data.copy()
        data['patient'] = patient_id

        serializer = PatientChargesSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, patient_id, pk):
        charge = self.get_object(patient_id, pk)
        if not charge:
            return Response({"detail": "Charge record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientChargesSerializer(
            charge, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id, pk):
        charge = self.get_object(patient_id, pk)
        if not charge:
            return Response({"detail": "Charge record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        charge.is_active = False
        charge.save()
        return Response({"detail": "Charge deleted successfully"}, status=status.HTTP_200_OK)







#*******************************************************************************************************#
#                            Patient Charges Views
#*******************************************************************************************************#

class PatientPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, patient_id, pk):
        try:
            return PatientPayment.objects.get(
                id=pk,
                patient_id=patient_id,
                is_active=True
            )
        except PatientPayment.DoesNotExist:
            return None

    def get(self, request, patient_id, pk=None):
        if pk:
            payment = self.get_object(patient_id, pk)
            if not payment:
                return Response({"detail": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = PatientPaymentSerializer(payment)
            return Response(serializer.data)
        
        payments = PatientPayment.objects.filter(
            patient_id=patient_id,
            is_active=True
        ).order_by('-payment_date', '-created_at')
        serializer = PatientPaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request, patient_id):
        data = request.data.copy()
        data['patient'] = patient_id

        serializer = PatientPaymentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, patient_id, pk):
        payment = self.get_object(patient_id, pk)
        if not payment:
            return Response({"detail": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientPaymentSerializer(
            payment, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id, pk):
        payment = self.get_object(patient_id, pk)
        if not payment:
            return Response({"detail": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        payment.is_active = False
        payment.save()
        return Response({"detail": "Payment deleted successfully"}, status=status.HTTP_200_OK)
