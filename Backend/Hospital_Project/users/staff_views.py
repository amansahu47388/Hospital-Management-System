from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import User
from .serializers import (
    StaffCreateSerializer, 
    StaffListSerializer, 
    StaffUpdateSerializer,
    FirstLoginPasswordChangeSerializer
)
from admin_module.models import AdminProfile


class IsSuperAdmin(permissions.BasePermission):
    """Only superuser admins can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser


class StaffManagementView(APIView):
    """
    GET: List all staff members
    POST: Create new staff member
    """
    permission_classes = [IsSuperAdmin]
    
    def get(self, request):
        """List all staff members"""
        staff = User.objects.filter(is_staff=True).select_related('created_by', 'admin_profile').order_by('-created_at')
        serializer = StaffListSerializer(staff, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create new staff member"""
        serializer = StaffCreateSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        
        # Create AdminProfile if department is provided
        department = getattr(user, '_department', '')
        if department:
            AdminProfile.objects.create(user=user, department=department)
        
        # Send invitation email if requested
        if getattr(user, '_send_invitation', True):
            self.send_invitation_email(user, getattr(user, '_temp_password', ''))
        
        response_data = StaffListSerializer(user).data
        response_data['temporary_password'] = getattr(user, '_temp_password', '')
        
        return Response({
            'message': f'{user.role.capitalize()} account created successfully',
            'staff': response_data
        }, status=status.HTTP_201_CREATED)
    
    def send_invitation_email(self, user, temp_password):
        """Send invitation email to new staff member"""
        try:
            subject = f"Welcome to Hospital Management System - {user.role.capitalize()} Account Created"
            
            login_url = f"{settings.FRONTEND_URL}/admin/login"
            
            message = f"""Dear {user.full_name},

Your staff account has been created successfully!

Account Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: {user.role.capitalize()}
Email: {user.email}
Temporary Password: {temp_password}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 IMPORTANT SECURITY NOTICE:
For security reasons, you MUST change your password on first login.

Login here: {login_url}

Steps to get started:
1. Visit the login page
2. Use your email and temporary password
3. You will be prompted to create a new password
4. Complete your profile setup

If you did not expect this account creation, please contact the administrator immediately.

Best regards,
Hospital Management Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply to this email.
"""
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            print(f"✅ Invitation email sent to {user.email}")
            
        except Exception as e:
            print(f"❌ Failed to send invitation email to {user.email}: {str(e)}")


class StaffDetailView(APIView):
    """
    GET: Get staff details
    PUT: Update staff details
    DELETE: Delete staff member
    """
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, staff_id):
        """Get staff details"""
        try:
            staff = User.objects.select_related('created_by', 'admin_profile').get(id=staff_id, is_staff=True)
            serializer = StaffListSerializer(staff)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Staff member not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, staff_id):
        """Update staff details"""
        try:
            staff = User.objects.get(id=staff_id, is_staff=True)
            
            # Prevent updating superuser
            if staff.is_superuser:
                return Response({'error': 'Cannot update superuser account'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = StaffUpdateSerializer(staff, data=request.data, partial=True)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            
            return Response({
                'message': 'Staff updated successfully',
                'staff': StaffListSerializer(staff).data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'Staff member not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, staff_id):
        """Delete staff member"""
        try:
            staff = User.objects.get(id=staff_id, is_staff=True)
            
            # Prevent deleting superuser
            if staff.is_superuser:
                return Response({'error': 'Cannot delete superuser account'}, status=status.HTTP_403_FORBIDDEN)
            
            staff_name = staff.full_name
            staff.delete()
            
            return Response({
                'message': f'Staff member {staff_name} deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'Staff member not found'}, status=status.HTTP_404_NOT_FOUND)


class StaffToggleActiveView(APIView):
    """Toggle staff active status"""
    permission_classes = [IsSuperAdmin]
    
    def patch(self, request, staff_id):
        """Activate or deactivate staff"""
        try:
            staff = User.objects.get(id=staff_id, is_staff=True)
            
            # Prevent deactivating superuser
            if staff.is_superuser:
                return Response({'error': 'Cannot deactivate superuser account'}, status=status.HTTP_403_FORBIDDEN)
            
            staff.is_active = not staff.is_active
            staff.save()
            
            status_text = 'activated' if staff.is_active else 'deactivated'
            
            return Response({
                'message': f'Staff member {status_text} successfully',
                'is_active': staff.is_active
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'Staff member not found'}, status=status.HTTP_404_NOT_FOUND)


class ResendInvitationView(APIView):
    """Resend invitation email with new temporary password"""
    permission_classes = [IsSuperAdmin]
    
    def post(self, request, staff_id):
        """Resend invitation email"""
        try:
            import secrets
            import string
            
            staff = User.objects.get(id=staff_id, is_staff=True)
            
            # Generate new temporary password
            alphabet = string.ascii_letters + string.digits + "!@#$%"
            temp_password = ''.join(secrets.choice(alphabet) for i in range(12))
            
            # Update password and reset first login flag
            staff.set_password(temp_password)
            staff.is_first_login = True
            staff.save()
            
            # Send email
            try:
                subject = f"Password Reset - Hospital Management System"
                login_url = f"{settings.FRONTEND_URL}/admin/login"
                
                message = f"""Dear {staff.full_name},

Your password has been reset by the administrator.

New Temporary Password: {temp_password}

Please login and change your password immediately:
{login_url}

Best regards,
Hospital Management Team
"""
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [staff.email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': 'Invitation email sent successfully',
                    'temporary_password': temp_password
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({
                    'error': f'Failed to send email: {str(e)}',
                    'temporary_password': temp_password
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except User.DoesNotExist:
            return Response({'error': 'Staff member not found'}, status=status.HTTP_404_NOT_FOUND)


class FirstLoginPasswordChangeView(APIView):
    """Handle first-time password change"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Change password on first login"""
        user = request.user
        
        # Check if user needs to change password
        if not user.is_first_login:
            return Response({'error': 'Password already changed'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FirstLoginPasswordChangeSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify temporary password
        if not user.check_password(serializer.validated_data['temporary_password']):
            return Response({'error': 'Invalid temporary password'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.is_first_login = False
        user.password_changed_at = timezone.now()
        user.save()
        
        return Response({
            'message': 'Password changed successfully. Please login with your new password.'
        }, status=status.HTTP_200_OK)
