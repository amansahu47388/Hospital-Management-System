from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import UserSerializer, UserRegisterSerializer, AdminRegisterSerializer
from .models import User
from django.contrib.auth import authenticate

COOKIE_NAME = "refresh_token"
COOKIE_PATH = "/auth/" 

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            return Response({"detail": "User account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        user_data = UserSerializer(user).data

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
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

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
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

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

        resp = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
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
            "user": UserSerializer(user).data,
            "access": str(access),
            "refresh": str(refresh)
        }
        return Response(data, status=status.HTTP_201_CREATED)


class RegisterAdminView(APIView):
    # Allow anyone to POST, but enforce server-side rules: if a superuser exists,
    # only a superuser may create additional admin accounts. If no superuser
    # exists yet, allow the first admin to be created (bootstrap case).
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # If a superuser already exists, require the requester to be a superuser
        if User.objects.filter(is_superuser=True).exists():
            if not (request.user and getattr(request.user, "is_superuser", False)):
                return Response({"detail": "You do not have permission to create admin users."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AdminRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Determine whether the created admin should be a superuser.
        role = serializer.validated_data.get('role', 'admin')
        # By default do not grant superuser. Grant only in two cases:
        # 1) No superuser exists yet (bootstrap)
        # 2) The requester is an existing superuser
        can_be_super = False
        if not User.objects.filter(is_superuser=True).exists():
            can_be_super = True
        elif request.user and getattr(request.user, 'is_superuser', False):
            can_be_super = True

        is_super = True if (role == 'admin' and can_be_super) else False
        user = serializer.save(is_staff=True, is_superuser=is_super)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        data = {
            "user": UserSerializer(user).data,
            "access": str(access),
            "refresh": str(refresh)
        }
        return Response(data, status=status.HTTP_201_CREATED)
