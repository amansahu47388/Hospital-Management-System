from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils import timezone
from .serializers import UserSerializer
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

COOKIE_NAME = "refresh_token"

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Accepts JSON: {"username": "...", "password": "..."}
        Returns: {"access": "...", "user": {..}} and sets httpOnly cookie with refresh token.
        """
        serializer = TokenObtainPairSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = serializer.validated_data  # contains 'access' and 'refresh'
        access = tokens.get("access")
        refresh = tokens.get("refresh")

        # Optionally return user info
        username = request.data.get("username")
        try:
            user = User.objects.get(username=username)
            user_data = UserSerializer(user).data
        except User.DoesNotExist:
            user_data = {}

        # Set refresh token in httpOnly cookie (secure flag off for dev)
        resp = Response({"access": access, "user": user_data}, status=status.HTTP_200_OK)
        # cookie settings:
        cookie_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
        resp.set_cookie(
            key=COOKIE_NAME,
            value=refresh,
            httponly=True,
            secure=False,           # set True on production with HTTPS
            samesite="Lax",         # or 'Strict' depending on front+backend domain setup
            max_age=cookie_max_age,
            path="/api/v1/auth/",
        )
        return resp

class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Reads refresh token from httpOnly cookie and returns new access token.
        Optionally rotates refresh token (Simple JWT ROTATE_REFRESH_TOKENS=True will give a new one).
        """
        cookie = request.COOKIES.get(COOKIE_NAME)
        if not cookie:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(cookie)
            data = {"access": str(refresh.access_token)}
            # If rotation is enabled, create new refresh and set cookie
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                new_refresh = RefreshToken.for_user(refresh.user)
                # Blacklist the old token (if configured)
                try:
                    refresh.blacklist()
                except Exception:
                    pass
                cookie_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
                resp = Response({"access": data["access"]}, status=status.HTTP_200_OK)
                resp.set_cookie(
                    key=COOKIE_NAME,
                    value=str(new_refresh),
                    httponly=True,
                    secure=False,
                    samesite="Lax",
                    max_age=cookie_max_age,
                    path="/api/v1/auth/",
                )
                return resp
            return Response(data, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Blacklists the current refresh token (read from cookie), clears cookie.
        """
        cookie = request.COOKIES.get(COOKIE_NAME)
        if cookie:
            try:
                token = RefreshToken(cookie)
                # blacklist
                token.blacklist()
            except Exception:
                pass

        resp = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        resp.delete_cookie(COOKIE_NAME, path="/api/v1/auth/")
        return resp
