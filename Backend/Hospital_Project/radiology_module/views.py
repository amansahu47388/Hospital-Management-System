from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import RadiologyTest, RadiologyCategory, RadiologyParameter
from .serializers import (
    RadiologyTestCreateSerializer,
    RadiologyTestListSerializer,
    RadiologyTestUpdateSerializer
)


class RadiologyTestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RadiologyTestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response({"message": "Radiology test created successfully"}, status=201)


class RadiologyTestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tests = RadiologyTest.objects.select_related("category", "charges")
        serializer = RadiologyTestListSerializer(tests, many=True)
        return Response(serializer.data)


class RadiologyTestUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        test = get_object_or_404(RadiologyTest, pk=pk)
        serializer = RadiologyTestUpdateSerializer(test, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Radiology test updated successfully"})


class RadiologyTestDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        test = get_object_or_404(RadiologyTest, pk=pk)
        test.delete()
        return Response({"message": "Radiology test deleted successfully"})

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RadiologyCategory, RadiologyParameter
from .serializers import RadiologyCategorySerializer, RadiologyParameterSerializer


class RadiologyCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = RadiologyCategory.objects.all()
        serializer = RadiologyCategorySerializer(categories, many=True)
        return Response(serializer.data)


class RadiologyParameterListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = RadiologyParameter.objects.all()
        serializer = RadiologyParameterSerializer(params, many=True)
        return Response(serializer.data)
