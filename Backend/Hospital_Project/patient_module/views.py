import logging
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count
from django.db.models.functions import ExtractYear
from .models import *
from .serializers import *

from opd_ipd_module.models import OpdPatient, IpdPatient, Prescription
from pharmacy_module.models import PharmacyBill
from pathology_module.models import PathologyBill
from radiology_module.models import RadiologyBill
from ambulance_module.models import AmbulanceBill

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
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            logger.info(f"📝 Creating patient - User: {request.user}, Data: {request.data}")
            
            serializer = PatientCreateUpdateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            patient = serializer.save()
            
            # Create User account and send invitation email (same pattern as staff)
            if getattr(patient, '_send_invitation', True):
                self.create_user_and_send_invitation(patient, getattr(patient, '_temp_password', ''))
            
            response_data = PatientSerializer(patient).data
            response_data['temporary_password'] = getattr(patient, '_temp_password', '')
            
            return Response({
                'message': 'Patient account created successfully',
                'patient': response_data
            }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"❌ Error creating patient: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"Internal server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def create_user_and_send_invitation(self, patient, temp_password):
        """Create User account for patient and send invitation email (same pattern as staff)"""
        from django.core.mail import send_mail
        from django.conf import settings
        from users.models import User
        
        # Check if user already exists
        if patient.user:
            logger.info(f"Patient {patient.id} already has a user account")
            return
        
        # Check if email is already used by another user
        if User.objects.filter(email=patient.email).exists():
            logger.warning(f"Email {patient.email} already exists in User table")
            return
        
        # Create User account
        user = User.objects.create(
            email=patient.email,
            full_name=patient.full_name,
            role='patient',
            is_staff=False,
            is_superuser=False,
            is_first_login=True,
            is_active=True
        )
        user.set_password(temp_password)
        user.save()
        
        # Link user to patient
        patient.user = user
        patient.save()
        
        logger.info(f"✅ User account created for patient {patient.id}")
        
        # Send invitation email
        try:
            subject = "Welcome to Hospital Management System - Patient Portal Access"
            login_url = f"{settings.FRONTEND_URL}/login"
            
            message = f"""Dear {patient.full_name},

Welcome to our Hospital Management System!

Your patient portal account has been created successfully. You can now access your medical records, appointments, and other healthcare information online.

Account Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: {patient.email}
Temporary Password: {temp_password}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 IMPORTANT SECURITY NOTICE:
For security reasons, you MUST change your password on first login.

Login here: {login_url}

Steps to get started:
1. Visit the login page
2. Use your email and temporary password
3. You will be prompted to create a new password
4. Access your patient portal dashboard

Through the patient portal, you can:
✓ View your medical records
✓ Check appointment history
✓ Access test results
✓ View billing information
✓ Update your profile

If you did not expect this account creation or have any questions, please contact our hospital reception.

Best regards,
Hospital Management Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply to this email.
"""
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [patient.email],
                fail_silently=False,
            )
            logger.info(f"✅ Invitation email sent to {patient.email}")
            
        except Exception as e:
            logger.error(f"❌ Failed to send invitation email to {patient.email}: {str(e)}")


class PatientUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, patient_id):
        try:
            logger.info(f"📝 Updating patient ID={patient_id}")
            logger.info(f"Request data: {request.data}")
            
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

#*******************************************************************************************************#
#                            MedicalCase Views
#*******************************************************************************************************#

class MedicalCaseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            patient_id = request.query_params.get('patient_id')
            case_id = request.query_params.get('case_id')
            if patient_id:
                cases = MedicalCase.objects.filter(patient_id=patient_id).order_by('-created_at')
            elif case_id:
                cases = MedicalCase.objects.filter(case_id=case_id).order_by('-created_at')
            else:
                cases = MedicalCase.objects.filter(is_active=True).order_by('-created_at')
            
            serializer = MedicalCaseSerializer(cases, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MedicalCaseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            case = MedicalCase.objects.get(pk=pk)
            serializer = MedicalCaseSerializer(case)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except MedicalCase.DoesNotExist:
            return Response({"detail": "Case not found"}, status=status.HTTP_404_NOT_FOUND)

class MedicalCaseCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MedicalCaseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class PatientDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, patient_id):
        try:
            logger.info(f"🗑️ Deleting patient {patient_id}")

            # Fetch patient
            try:
                patient = Patient.objects.get(id=patient_id, is_active=True)
            except Patient.DoesNotExist:
                return Response(
                    {"detail": "Patient not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            patient_name = patient.full_name

            # Check OPD / IPD
            from opd_ipd_module.models import OpdPatient, IpdPatient
            if OpdPatient.objects.filter(patient=patient).exists():
                return Response(
                    {"detail": "Patient has OPD records. Delete them first."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if IpdPatient.objects.filter(patient=patient).exists():
                return Response(
                    {"detail": "Patient has IPD records. Delete them first."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check Pharmacy Bills
            from pharmacy_module.models import PharmacyBill
            if PharmacyBill.objects.filter(patient=patient).exists():
                return Response(
                    {"detail": "Patient has pharmacy bills. Delete them first."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Hard delete
            patient.delete()

            logger.info(f"✅ Patient {patient_id} deleted")

            return Response(
                {"detail": "Patient deleted successfully."},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Full error only in server logs
            logger.error(f"❌ Delete patient error: {str(e)}", exc_info=True)

            # Simple message to frontend
            return Response(
                {"detail": "Unable to delete patient right now. Please try again later."},
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
        
        patient_id_query = self.request.query_params.get("patient_id")
        case_id = self.request.query_params.get("case_id")
        
        queryset = PatientCharges.objects.filter(
            patient_id=patient_id_query or patient_id,
            is_active=True
        ).order_by('-charge_date', '-created_at')

        if case_id:
            queryset = queryset.filter(case__case_id=case_id)

        serializer = PatientChargesSerializer(queryset, many=True)
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
        
        patient_id_query = self.request.query_params.get("patient_id")
        case_id = self.request.query_params.get("case_id")

        queryset = PatientPayment.objects.filter(
            patient_id=patient_id_query or patient_id,
            is_active=True
        ).order_by('-payment_date', '-created_at')

        if case_id:
            queryset = queryset.filter(case__case_id=case_id)

        serializer = PatientPaymentSerializer(queryset, many=True)
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


class PatientDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        try:
            logger.info(f"📊 Fetching dashboard data for patient {patient_id}")
            
            # 1. Stats Grid
            stats = [
                {"label": "OPD", "count": OpdPatient.objects.filter(patient_id=patient_id).count()},
                {"label": "IPD", "count": IpdPatient.objects.filter(patient_id=patient_id).count()},
                {"label": "Pharmacy", "count": PharmacyBill.objects.filter(patient_id=patient_id).count()},
                {"label": "Pathology", "count": PathologyBill.objects.filter(patient_id=patient_id).count()},
                {"label": "Radiology", "count": RadiologyBill.objects.filter(patient_id=patient_id).count()},
                {"label": "Consultation", "count": PatientConsultant.objects.filter(patient_id=patient_id).count()},
                {"label": "Ambulance", "count": AmbulanceBill.objects.filter(patient_id=patient_id).count()},
            ]

            # 2. Medical History (Yearly counts)
            years = set()
            models_to_check = [
                OpdPatient, IpdPatient, PharmacyBill, 
                PathologyBill, RadiologyBill, 
                PatientConsultant, AmbulanceBill
            ]
            
            for model in models_to_check:
                model_years = model.objects.filter(patient_id=patient_id).annotate(
                    year=ExtractYear('created_at')
                ).values_list('year', flat=True).distinct()
                years.update([y for y in model_years if y])
            
            history = []
            for year in sorted(list(years)):
                history.append({
                    "year": str(int(year)),
                    "OPD": OpdPatient.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "IPD": IpdPatient.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "Pharmacy": PharmacyBill.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "Pathology": PathologyBill.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "Radiology": RadiologyBill.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "Consultation": PatientConsultant.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                    "Ambulance": AmbulanceBill.objects.filter(patient_id=patient_id, created_at__year=year).count(),
                })

            # 3. Top 10 Findings
            findings = Prescription.objects.filter(
                patient_id=patient_id, 
                findings__isnull=False
            ).values('findings__finding_name').annotate(
                value=Count('findings')
            ).order_by('-value')[:10]
            
            COLORS = ["#2D6A4F", "#34A0A4", "#D4A373", "#6A4C93", "#4CAF50", "#F4A261", "#E9C46A", "#E63946", "#26648E", "#4FB0C6"]
            
            findings_data = [
                {
                    "name": f['findings__finding_name'], 
                    "value": f['value'],
                    "fill": COLORS[i % len(COLORS)]
                } for i, f in enumerate(findings)
            ]

            # 4. Top 10 Symptoms
            opd_symptoms = OpdPatient.objects.filter(
                patient_id=patient_id, 
                symptom__isnull=False
            ).values('symptom__symptom_title').annotate(value=Count('symptom'))
            
            ipd_symptoms = IpdPatient.objects.filter(
                patient_id=patient_id, 
                symptom__isnull=False
            ).values('symptom__symptom_title').annotate(value=Count('symptom'))
            
            symptoms_map = {}
            for s in opd_symptoms:
                title = s['symptom__symptom_title']
                symptoms_map[title] = symptoms_map.get(title, 0) + s['value']
            for s in ipd_symptoms:
                title = s['symptom__symptom_title']
                symptoms_map[title] = symptoms_map.get(title, 0) + s['value']
            
            symptoms_data = sorted(
                [{"name": k, "value": v} for k, v in symptoms_map.items()], 
                key=lambda x: x['value'], 
                reverse=True
            )[:10]

            logger.info("✅ Dashboard data fetched successfully")
            return Response({
                "stats": stats,
                "history": history,
                "findings": findings_data,
                "symptoms": symptoms_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"❌ Error fetching dashboard data: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
