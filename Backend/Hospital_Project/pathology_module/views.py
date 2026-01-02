from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import PathologyCategory, PathologyParameter, PathologyTest
from .serializers import PathologyTestCreateSerializer, PathologyTestListSerializer,PathologyTestUpdateSerializer





class PathologyTestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PathologyTestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            print("❌ SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(created_by=request.user)
        return Response(
            {"message": "Pathology test created successfully"},
            status=status.HTTP_201_CREATED
        )




class PathologyTestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = (
            PathologyTest.objects
            .select_related("category", "charges")
            .order_by("-id")
        )

        serializer = PathologyTestListSerializer(queryset, many=True)
        return Response(serializer.data)







class PathologyCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PathologyCategory.objects.values("id", "category_name")
        return Response(data)




class PathologyParameterListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PathologyParameter.objects.values(
            "id", "parameter_name", "reference_range", "unit", "description"
        )
        return Response(data)





class PathologyTestDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        pathology_test = get_object_or_404(PathologyTest, pk=pk)

        pathology_test.delete()

        return Response(
            {"message": "Pathology test deleted successfully"},
            status=status.HTTP_200_OK
        )
    



class PathologyTestUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        test = get_object_or_404(PathologyTest, pk=pk)

        serializer = PathologyTestUpdateSerializer(
            test, data=request.data
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response(
            {"message": "Pathology test updated successfully"},
            status=200
        )
