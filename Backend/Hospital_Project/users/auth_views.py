from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import UserSerializer, UserRegisterSerializer, AdminRegisterSerializer
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail



COOKIE_NAME = "refresh_token"
COOKIE_PATH = "/auth/" 

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            return Response({"User account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        user_data = UserSerializer(user, context={'request': request}).data

        resp = Response({
            "access": str(access),
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)

        cookie_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
        resp.set_cookie(
            key=COOKIE_NAME,
            value=str(refresh),
            httponly=True,
            secure=False,  # set True in production with HTTPS
            samesite="Lax",
            max_age=cookie_max_age,
            path=COOKIE_PATH,
        )
        return resp

class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cookie = request.COOKIES.get(COOKIE_NAME)
        refresh_token = request.data.get("refresh") or cookie

        if not refresh_token:
            return Response({"Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            # If rotation enabled, rotate and set new refresh cookie
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                user_id = refresh.get("user_id")
                new_refresh = None
                if user_id:
                    try:
                        user = User.objects.get(pk=user_id)
                        new_refresh = RefreshToken.for_user(user)
                    except User.DoesNotExist:
                        new_refresh = None
                try:
                    refresh.blacklist()
                except Exception:
                    pass

                resp = Response({"access": access_token}, status=status.HTTP_200_OK)
                if new_refresh:
                    cookie_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
                    resp.set_cookie(
                        key=COOKIE_NAME,
                        value=str(new_refresh),
                        httponly=True,
                        secure=False,
                        samesite="Lax",
                        max_age=cookie_max_age,
                        path=COOKIE_PATH,
                    )
                return resp

            return Response({"access": access_token}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cookie = request.COOKIES.get(COOKIE_NAME)
        refresh_token = request.data.get("refresh") or cookie

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        resp = Response({"Logged out"}, status=status.HTTP_200_OK)
        resp.delete_cookie(COOKIE_NAME, path=COOKIE_PATH)
        return resp

class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Optionally create tokens and return them on register
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        data = {
            "user": UserSerializer(user, context={'request': request}).data,
            "access": str(access),
            "refresh": str(refresh)
        }
        return Response(data, status=status.HTTP_201_CREATED)


class RegisterAdminView(APIView):
   
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        superuser_exists = User.objects.filter(is_superuser=True).exists()
        role = request.data.get('role', 'admin')
        
        # Special handling for 'admin' role (superuser role)
        if role == 'admin':
            # If trying to create admin role and superuser already exists
            if superuser_exists:
                return Response(
                    {"Only one superuser admin is allowed. A superuser admin already exists."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            # First admin becomes superuser
            is_super = True
        else:
            is_super = False
        
        # Pass is_staff and is_superuser to serializer via context
        serializer = AdminRegisterSerializer(
            data=request.data,
            context={'is_staff': True, 'is_superuser': is_super}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Ensure user is saved and has an ID
        if not user.pk:
            return Response(
                {"detail": "User creation failed - no user ID generated"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Refresh user from database to ensure all fields are populated
        user.refresh_from_db()

        try:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            user_data = UserSerializer(user, context={'request': request}).data
            
            data = {
                "user": user_data,
                "access": str(access),
                "refresh": str(refresh),
                "message": "Admin registered successfully"
            }
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log the error for debugging
            import traceback
            print(f"❌ Error during admin registration token generation: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {"detail": f"User created but token generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# users/views.py
class StaffList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(is_staff=True)
        data = [{"id": u.id, "full_name": u.full_name} for u in users]
        return Response(data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("password")
        
        if not current_password or not new_password:
            return Response({"error": "Both current and new password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password"}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            
            subject = "Password Reset Request - Hospital Management System"
            message = f"Hello {user.full_name},\n\nYou requested a password reset. Click the link below to set a new password:\n\n{reset_link}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nHospital Management Team"
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            return Response({
                "message": "We have sent a password reset link."
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({"message": "We have sent a password reset link."}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return Response({"error": "Failed to send reset email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not all([uidb64, token, new_password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid or expired reset link"}, status=status.HTTP_400_BAD_REQUEST)
