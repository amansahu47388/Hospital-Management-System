# frontoffice/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Visitor, Purpose
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .serializers import *

class PurposeAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = Purpose.objects.all()
        serializer = PurposeSerializer(data, many=True)
        return Response(serializer.data)


class ComplainTypeAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = ComplaintType.objects.all()
        serializer = ComplaintTypeSerializer(data, many=True)
        return Response(serializer.data)



class SourceAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = Source.objects.all()
        serializer = SourceSerializer(data, many=True)
        return Response(serializer.data)



class VisitorAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            visitor = get_object_or_404(Visitor, pk=pk)
            serializer = VisitorSerializer(visitor)
            return Response(serializer.data)
        else:
            data = Visitor.objects.all()
            serializer = VisitorSerializer(data, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = VisitorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        visitor = get_object_or_404(Visitor, pk=pk)
        serializer = VisitorSerializer(visitor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        visitor = get_object_or_404(Visitor, pk=pk)
        visitor.delete()
        return Response({"message": "Deleted"}, status=204)


class ComplainAPI(APIView):
    permission_classes = [IsAuthenticated]

    # LIST + DETAILS
    def get(self, request, pk=None):
        if pk:
            complain = get_object_or_404(Complain, pk=pk)
            serializer = ComplainSerializer(complain)
            return Response(serializer.data)

        data = Complain.objects.select_related("complain_type", "source", "created_by")
        serializer = ComplainSerializer(data, many=True)
        return Response(serializer.data)

    # CREATE
    def post(self, request):
        serializer = ComplainSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # UPDATE
    def put(self, request, pk):
        complain = get_object_or_404(Complain, pk=pk)
        serializer = ComplainSerializer(complain, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        complain = get_object_or_404(Complain, pk=pk)
        complain.delete()
        return Response({"message": "Complaint deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    


class DispachAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(PostalDispatch, pk=pk)
            serializer = PostalDispatchSerializer(obj)
            return Response(serializer.data)

        data = PostalDispatch.objects.select_related("created_by")
        serializer = PostalDispatchSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostalDispatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(PostalDispatch, pk=pk)
        serializer = PostalDispatchSerializer(obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(PostalDispatch, pk=pk)
        obj.delete()
        return Response({"message": "Postal dispatch deleted"}, status=status.HTTP_204_NO_CONTENT)




class ReceiveAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(PostalReceive, pk=pk)
            serializer = PostalReceiveSerializer(obj)
            return Response(serializer.data)

        data = PostalReceive.objects.select_related("created_by")
        serializer = PostalReceiveSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostalReceiveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(PostalReceive, pk=pk)
        serializer = PostalReceiveSerializer(obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(PostalReceive, pk=pk)
        obj.delete()
        return Response({"message": "Postal receive deleted"}, status=status.HTTP_204_NO_CONTENT)
