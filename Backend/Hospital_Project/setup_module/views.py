from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import *
from .serializers import *



# **************************************************************** #
#                       Hospital Charge Setup APIs                        #
# **************************************************************** #   
class ChargeUnitAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeUnit, pk=pk)
            serializer = ChargeUnitSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeUnit.objects.all().order_by("unit_type")
        serializer = ChargeUnitSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeUnit, pk=pk)
        serializer = ChargeUnitSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeUnit, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeTypeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeType, pk=pk)
            serializer = ChargeTypeSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeType.objects.all().order_by("charge_type")
        serializer = ChargeTypeSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeType, pk=pk)
        serializer = ChargeTypeSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeType, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeCategoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeCategory, pk=pk)
            serializer = ChargeCategorySerializer(obj)
            return Response(serializer.data)

        queryset = (
            ChargeCategory.objects
            .select_related("charge_type")
            .all()
            .order_by("category_name")
        )
        serializer = ChargeCategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeCategory, pk=pk)
        serializer = ChargeCategorySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeCategory, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChargeTaxAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ChargeTax, pk=pk)
            serializer = ChargeTaxSerializer(obj)
            return Response(serializer.data)

        queryset = ChargeTax.objects.all().order_by("tax_percentage")
        serializer = ChargeTaxSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChargeTaxSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(ChargeTax, pk=pk)
        serializer = ChargeTaxSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(ChargeTax, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HospitalChargesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # ✅ LIST / DETAILS
    def get(self, request, pk=None):
        if pk:
            charge = get_object_or_404(HospitalCharges, pk=pk)
            serializer = HospitalChargesSerializer(charge)
            return Response(serializer.data, status=status.HTTP_200_OK)

        charges = HospitalCharges.objects.all().order_by("-id")
        serializer = HospitalChargesSerializer(charges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ CREATE
    def post(self, request):
        serializer = HospitalChargesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ UPDATE
    def put(self, request, pk):
        charge = get_object_or_404(HospitalCharges, pk=pk)
        serializer = HospitalChargesSerializer(
            charge, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ DELETE
    def delete(self, request, pk):
        charge = get_object_or_404(HospitalCharges, pk=pk)
        charge.delete()
        return Response(
            {"message": "Hospital charge deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )






# **************************************************************** #
#                       BED Setup APIs                             #
# **************************************************************** # 

class FloorAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        floors = Floor.objects.all().order_by("-created_at")
        serializer = FloorSerializer(floors, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FloorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            floor = Floor.objects.get(pk=pk)
        except Floor.DoesNotExist:
            return Response({"error": "Floor not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FloorSerializer(floor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            floor = Floor.objects.get(pk=pk)
        except Floor.DoesNotExist:
            return Response({"error": "Floor not found"}, status=status.HTTP_404_NOT_FOUND)

        floor.delete()
        return Response(
            {"message": "Floor deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class BedTypeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bed_types = BedType.objects.all().order_by("-created_at")
        serializer = BedTypeSerializer(bed_types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BedTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            bed_type = BedType.objects.get(pk=pk)
        except BedType.DoesNotExist:
            return Response({"error": "Bed type not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BedTypeSerializer(bed_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            bed_type = BedType.objects.get(pk=pk)
        except BedType.DoesNotExist:
            return Response({"error": "Bed type not found"}, status=status.HTTP_404_NOT_FOUND)

        bed_type.delete()
        return Response(
            {"message": "Bed type deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class BedGroupAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bed_groups = BedGroup.objects.select_related("floor", "bed_type").order_by("-created_at")
        serializer = BedGroupSerializer(bed_groups, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BedGroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            bed_group = BedGroup.objects.get(pk=pk)
        except BedGroup.DoesNotExist:
            return Response({"error": "Bed group not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BedGroupSerializer(bed_group, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            bed_group = BedGroup.objects.get(pk=pk)
        except BedGroup.DoesNotExist:
            return Response({"error": "Bed group not found"}, status=status.HTTP_404_NOT_FOUND)

        bed_group.delete()
        return Response(
            {"message": "Bed group deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class BedAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        beds = Bed.objects.all().order_by("bed_name")
        serializer = BedSerializer(beds, many=True)
        data = serializer.data
        
        # Add patient info for occupied beds
        try:
            from opd_ipd_module.models import IpdPatient
            active_ipd = IpdPatient.objects.filter(is_discharged=False, bed__isnull=False).select_related('patient')
            bed_patient_map = {ipd.bed_id: ipd for ipd in active_ipd}
            
            for item in data:
                ipd = bed_patient_map.get(item['id'])
                if ipd:
                    item['patient_name'] = f"{ipd.patient.first_name} {ipd.patient.last_name}"
                    item['ipd_id'] = ipd.ipd_id
                else:
                    item['patient_name'] = None
                    item['ipd_id'] = None
        except Exception as e:
            print("Error fetching patient info for beds:", e)
            
        return Response(data)

    def post(self, request):
        serializer = BedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            bed = Bed.objects.get(pk=pk)
        except Bed.DoesNotExist:
            return Response({"error": "Bed not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BedSerializer(bed, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            bed = Bed.objects.get(pk=pk)
        except Bed.DoesNotExist:
            return Response({"error": "Bed not found"}, status=status.HTTP_404_NOT_FOUND)

        bed.delete()
        return Response(
            {"message": "Bed deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )








#***********************************************************************************#
#                      OPERATIONS SETUP APIVIEW                                     #
#***********************************************************************************#


class OperationSetupAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(OperationSetup, pk=pk)
            return Response(OperationSetupSerializer(obj).data)

        qs = OperationSetup.objects.filter()
        return Response(OperationSetupSerializer(qs, many=True).data)

    def post(self, request):
        serializer = OperationSetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        obj = get_object_or_404(OperationSetup, pk=pk)
        serializer = OperationSetupSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def delete(self, request, pk):
        obj = get_object_or_404(OperationSetup, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)









#***********************************************************************************#
#                      OPERATIONS SETUP APIVIEW                                     #
#***********************************************************************************#

class SymptomAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Symptom, pk=pk)
            serializer = SymptomSerializer(obj)
            return Response(serializer.data)

        queryset = Symptom.objects.all().order_by("symptom_title")
        serializer = SymptomSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SymptomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(Symptom, pk=pk)
        serializer = SymptomSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(Symptom, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






#***********************************************************************************#
#                      FINDING SETUP APIVIEW                                     #
#***********************************************************************************#
class FindingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Finding, pk=pk)
            serializer = FindingSerializer(obj)
            return Response(serializer.data)

        queryset = Finding.objects.all().order_by("finding_name")
        serializer = FindingSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FindingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(Finding, pk=pk)
        serializer = FindingSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(Finding, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FindingCategoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(FindingCategory, pk=pk)
            serializer = FindingCategorySerializer(obj)
            return Response(serializer.data)

        queryset = FindingCategory.objects.all().order_by("-created_at")
        serializer = FindingCategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FindingCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(FindingCategory, pk=pk)
        serializer = FindingCategorySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(FindingCategory, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





#***********************************************************************************#
#                      VITALS SETUP APIVIEW                                     #
#***********************************************************************************#

class VitalAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Vital, pk=pk)
            serializer = VitalSerializer(obj)
            return Response(serializer.data)

        queryset = Vital.objects.all().order_by("vital_name")
        serializer = VitalSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VitalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        obj = get_object_or_404(Vital, pk=pk)
        serializer = VitalSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = get_object_or_404(Vital, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


















class SymptomListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = list(Symptom.objects.values("id", "symptom_title", "symptom_type", "description"))
        return Response(data)


class HospitalChargesListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            HospitalCharges.objects.values("id", "charge_category", "charge_name","charge_type", "charge_amount","charge_description", "tax", "unit")
        )


# class BedListAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         status_filter = request.query_params.get('status')
#         beds_qs = Bed.objects.all()
        
#         if status_filter:
#             beds_qs = beds_qs.filter(status=status_filter)
            
#         data = list(beds_qs.values("id", "bed_name", "bed_type", "bed_group", "status", "floor"))
#         return Response(data)


class ChargeCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get unique charge categories from HospitalCharges
        categories = HospitalCharges.objects.values_list('charge_category', flat=True).distinct()
        # Convert to list of dictionaries with id and name
        category_list = [{'id': idx + 1, 'category_name': cat} for idx, cat in enumerate(categories) if cat]
        return Response(category_list)


    