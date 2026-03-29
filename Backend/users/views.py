from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer, AdminRegisterSerializer


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, "role", None) == "superadmin")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Restrict write/delete operations to superadmin,
        but allow any authenticated user to list/retrieve users.
        """
        if self.action in ["create", "destroy", "update", "partial_update"]:
            return [permissions.IsAuthenticated(), IsSuperAdmin()]
        # list, retrieve and custom actions like `me`
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)



class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterAdminView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Register new admin with different roles.
        Only first admin registration creates a superuser.
        Subsequent registrations are staff but NOT superuser.
        """
        print(f"📝 Admin registration request from {request.data.get('email')}")
        
        # Check if this is the first admin registration
        superuser_exists = User.objects.filter(is_superuser=True).exists()
        print(f"Superuser exists: {superuser_exists}")
        
        serializer = AdminRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"❌ Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        role = serializer.validated_data.get('role', 'admin')
        print(f"Role: {role}, Superuser exists: {superuser_exists}")
        
        # Only the first admin (no superuser exists yet) becomes superuser
        is_super = not superuser_exists and role == 'admin'
        
        print(f"Making superuser: {is_super}")
        user = serializer.save(is_staff=True, is_superuser=is_super)

       

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        data = {
            "user": UserSerializer(user).data,
            "access": str(access),
            "refresh": str(refresh),
            "is_superuser": is_super,
            "role": role,
            "message": "Admin registered successfully"
        }
        
        print(f"✅ Admin registration successful: {user.email}, Superuser: {is_super}")
        return Response(data, status=status.HTTP_201_CREATED)
