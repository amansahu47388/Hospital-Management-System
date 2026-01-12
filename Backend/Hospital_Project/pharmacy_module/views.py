from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum, Q
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import *
from .serializers import *



# ----------------- CATEGORY LIST -----------------
class MedicineCategoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = MedicineCategory.objects.filter(is_active=True)
        return Response(MedicineCategorySerializer(data, many=True).data)

    def post(self, request):
        serializer = MedicineCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)



# ----------------- COMPANY LIST -----------------
class CompanyListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Company.objects.all().order_by("company_name")
        serializer = CompanySerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- GROUP LIST -----------------
class MedicineGroupListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MedicineGroup.objects.all().order_by("group_name")
        serializer = MedicineGroupSerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- UNIT LIST -----------------
class UnitListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Unit.objects.all().order_by("unit_name")
        serializer = UnitSerializer(qs, many=True)
        return Response(serializer.data)




# ----------------- SUPPLIER LIST -----------------
class SupplierListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Supplier.objects.filter(is_active=True).order_by("supplier_name")
        serializer = SupplierSerializer(qs, many=True)
        return Response(serializer.data)





# ----------------- MEDICINE DOSAGE LIST -----------------
class MedicineDosageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MedicineDosage.objects.filter(is_active=True)\
            .select_related("category_name", "unit")\
            .order_by("category_name", "dosage")

        serializer = MedicineDosageSerializer(qs, many=True)
        return Response(serializer.data)





# ----------------- DOSAGE LIST -----------------
class DosageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Dosage.objects.filter(is_active=True).order_by("dosage_interval")
        serializer = DosageSerializer(qs, many=True)
        return Response(serializer.data)



# ----------------- MEDICINES CRUD -----------------
class MedicineListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search")

        qs = (
            Medicine.objects.select_related("category", "company", "group", "unit")
            .annotate(available_qty=Coalesce(Sum("medicinestock__available_qty"), 0))
            .order_by("name")
        )

        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(composition__icontains=search)
                | Q(category__category_name__icontains=search)
            )

        serializer = MedicineSerializer(qs, many=True)
        return Response(serializer.data)


class MedicineCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = MedicineCreateUpdateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        medicine = serializer.save()
        return Response(MedicineSerializer(medicine).data, status=status.HTTP_201_CREATED)


class MedicineUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def _update(self, request, pk, partial):
        instance = get_object_or_404(Medicine, pk=pk)
        serializer = MedicineCreateUpdateSerializer(
            instance, data=request.data, partial=partial, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        medicine = serializer.save()
        return Response(MedicineSerializer(medicine).data)


class MedicineDetaisAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        medicine = (
            Medicine.objects.select_related("category", "company", "group", "unit")
            .annotate(available_qty=Coalesce(Sum("medicinestock__available_qty"), 0))
            .filter(pk=pk)
            .first()
        )
        if not medicine:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(MedicineSerializer(medicine).data)


class MedicineDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)

        # 🔒 Check if used in stock
        if MedicineStock.objects.filter(medicine=medicine).exists():
            return Response(
                {"detail": "Medicine has stock and cannot be deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔒 Check if used in purchases
        if PharmacyPurchaseItem.objects.filter(medicine=medicine).exists():
            return Response(
                {"detail": "Medicine used in purchase records"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔒 Check if used in bills
        if PharmacyBillItem.objects.filter(medicine=medicine).exists():
            return Response(
                {"detail": "Medicine used in pharmacy bills"},
                status=status.HTTP_400_BAD_REQUEST
            )

        medicine.delete()
        return Response({"message": "Medicine deleted"}, status=200)




class MedicineStockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        stocks = MedicineStock.objects.select_related("batch").filter(medicine_id=pk)
        serializer = MedicineStockDetailSerializer(stocks, many=True)
        return Response(serializer.data)









# ----------------- PURCHASE CRUD -----------------
class PharmacyPurchaseListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search")
        qs = (
            PharmacyPurchase.objects.select_related("supplier")
            .prefetch_related("items")
            .order_by("-purchase_date")
        )

        # if search:
        #     qs = qs.filter(
        #         Q(purchase_no__icontains=search)
        #         | Q(bill_no__icontains=search)
        #         | Q(supplier__supplier_name__icontains=search)
        #     )

        serializer = PharmacyPurchaseSerializer(qs, many=True)
        return Response(serializer.data)






class PharmacyPurchaseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PharmacyPurchaseCreateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        purchase = serializer.save()
        return Response(PharmacyPurchaseSerializer(purchase).data, status=status.HTTP_201_CREATED)






class PharmacyPurchaseDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        purchase = get_object_or_404(
            PharmacyPurchase.objects.select_related("supplier").prefetch_related("items"),
            pk=pk,
        )
        return Response(PharmacyPurchaseSerializer(purchase).data)







class PharmacyPurchaseDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        purchase = get_object_or_404(PharmacyPurchase, pk=pk)
        purchase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






# ----------------- PHARMACY BILL CRUD -----------------
class PharmacyBillListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search")

        qs = PharmacyBill.objects.select_related(
            "patient",
            "doctor",
            "created_by"
        ).order_by("-id")

        # if search:
        #     qs = qs.filter(
        #         Q(patient__name__icontains=search) |
        #         Q(doctor__username__icontains=search)
        #     )

        return Response(PharmacyBillSerializer(qs, many=True).data)







class PharmacyBillCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PharmacyBillCreateSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        bill = serializer.save()
        return Response(PharmacyBillSerializer(bill).data, status=201)








class PharmacyBillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        bill = get_object_or_404(
            PharmacyBill.objects.select_related("patient", "doctor").prefetch_related("items"),
            pk=pk,
        )
        return Response(PharmacyBillSerializer(bill).data)
    





class PharmacyBillUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        bill = get_object_or_404(PharmacyBill, pk=pk)

        serializer = PharmacyBillCreateSerializer(
            bill,
            data=request.data,
            context={"request": request},
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        new_items = serializer.validated_data.get("items", [])

        with transaction.atomic():

            # 1️⃣ Restore old stock
            for old in bill.items.all():
                stock = MedicineStock.objects.select_for_update().get(
                    medicine=old.medicine,
                    batch=old.batch
                )
                stock.available_qty += old.quantity
                stock.save()

            # 2️⃣ Delete old bill items
            bill.items.all().delete()

            # 3️⃣ Update bill header
            serializer.validated_data.pop("items", None)
            for attr, value in serializer.validated_data.items():
                setattr(bill, attr, value)
            bill.save()

            # 4️⃣ Deduct new stock and insert new items
            for item in new_items:
                stock = MedicineStock.objects.select_for_update().get(
                    medicine=item["medicine"],
                    batch=item["batch"]
                )

                if stock.available_qty < item["quantity"]:
                    raise ValidationError(
                        f"Not enough stock for {item['medicine'].name} - {item['batch'].batch_no}"
                    )

                stock.available_qty -= item["quantity"]
                stock.save()

                PharmacyBillItem.objects.create(
                    bill=bill,
                    **item
                )

        return Response(PharmacyBillSerializer(bill).data)






class PharmacyBillDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        bill = get_object_or_404(PharmacyBill, pk=pk)
        bill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    




class PharmacyBillingMedicineAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        medicines = Medicine.objects.annotate(
            available_qty=Coalesce(Sum("medicinestock__available_qty"), 0)
        ).filter(available_qty__gt=0)

        return Response(
            [
                {
                    "id": m.id,
                    "name": m.name,
                    "category_id": m.category.id,
                    "category": m.category.category_name,
                    "available_qty": m.available_qty,
                }
                for m in medicines
            ]
        )


class PharmacyBillingBatchAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, medicine_id):
        stocks = MedicineStock.objects.select_related("batch").filter(
            medicine_id=medicine_id, available_qty__gt=0
        )

        return Response([
            {
                "id": s.id,
                "batch_id": s.batch.id,
                "batch_no": s.batch.batch_no,
                "expiry": s.batch.expiry_date,
                "mrp": s.batch.mrp,
                "sale_price": s.batch.sale_price,
                "tax_percentage": s.batch.tax_percentage,
                "available_qty": s.available_qty
            }
            for s in stocks
        ])
