from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated


# -------------------------------
# CATEGORY CRUD
# -------------------------------
class ItemCategoryAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = ItemCategory.objects.all()
        return Response(ItemCategorySerializer(data, many=True).data)

    def post(self, request):
        serializer = ItemCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        category = get_object_or_404(ItemCategory, pk=pk)
        serializer = ItemCategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = get_object_or_404(ItemCategory, pk=pk)
        category.delete()
        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# -------------------------------
# STORE CRUD
# -------------------------------
class ItemStoreAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(ItemStoreSerializer(ItemStore.objects.all(), many=True).data)

    def post(self, request):
        serializer = ItemStoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, 400)

    def put(self, request, pk):
        store = get_object_or_404(ItemStore, pk=pk)
        serializer = ItemStoreSerializer(store, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        store = get_object_or_404(ItemStore, pk=pk)
        store.delete()
        return Response(
            {"message": "Store deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# -------------------------------
# SUPPLIER CRUD
# -------------------------------
class ItemSupplierAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(ItemSupplierSerializer(ItemSupplier.objects.all(), many=True).data)

    def post(self, request):
        serializer = ItemSupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, 400)

    def put(self, request, pk):
        supplier = get_object_or_404(ItemSupplier, pk=pk)
        serializer = ItemSupplierSerializer(supplier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        supplier = get_object_or_404(ItemSupplier, pk=pk)
        supplier.delete()
        return Response(
            {"message": "Supplier deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )




# -------------------------------
# ITEM CRUD
# -------------------------------
class ItemAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = Item.objects.all()
        return Response(ItemSerializer(data, many=True).data)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = ItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, 400)

    def delete(self, request, pk):
        try:
            Item.objects.get(pk=pk).delete()
            return Response({"message": "Deleted"})
        except:
            return Response({"error": "Item not found"}, status=404)




# -------------------------------
# ADD STOCK
# -------------------------------
class ItemStockAPI(APIView):
    permission_classes = [IsAuthenticated]

    # LIST ALL STOCK
    def get(self, request, pk=None):
        if pk:
            try:
                stock = ItemStock.objects.select_related(
                    "item", "store", "category", "supplier"
                ).get(pk=pk)
                return Response(ItemStockSerializer(stock).data)
            except ItemStock.DoesNotExist:
                return Response({"error": "Stock not found"}, status=404)

        stocks = ItemStock.objects.select_related(
            "item", "store", "category", "supplier"
        ).order_by("-id")

        return Response(ItemStockSerializer(stocks, many=True).data)

    # CREATE
    def post(self, request):
        serializer = ItemStockSerializer(data=request.data)
        if serializer.is_valid():
            stock = serializer.save(created_by=request.user)

            # Store wise stock update
            store_stock, _ = ItemStoreStock.objects.get_or_create(
                item=stock.item,
                store=stock.store
            )
            store_stock.quantity += stock.quantity
            store_stock.save()

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    # UPDATE
    def put(self, request, pk):
        try:
            stock = ItemStock.objects.get(pk=pk)
        except ItemStock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=404)

        old_qty = stock.quantity
        old_item = stock.item
        old_store = stock.store

        serializer = ItemStockSerializer(stock, data=request.data, partial=True)

        if serializer.is_valid():
            updated = serializer.save()

            # 🔴 Reverse old stock
            old_store_stock = ItemStoreStock.objects.get(item=old_item, store=old_store)
            old_store_stock.quantity -= old_qty
            old_store_stock.save()

            # 🟢 Add to new store/item
            new_store_stock, _ = ItemStoreStock.objects.get_or_create(
                item=updated.item,
                store=updated.store
            )
            new_store_stock.quantity += updated.quantity
            new_store_stock.save()

            return Response(ItemStockSerializer(updated).data)

        return Response(serializer.errors, status=400)


   
    # DELETE
    def delete(self, request, pk):
        try:
            stock = ItemStock.objects.select_related("item", "store").get(pk=pk)
        except ItemStock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=404)

        # Get store stock
        try:
            store_stock = ItemStoreStock.objects.get(
                item=stock.item,
                store=stock.store
            )
        except ItemStoreStock.DoesNotExist:
            return Response({"error": "Store stock missing"}, status=400)

        # Prevent negative quantity
        if store_stock.quantity < stock.quantity:
            return Response({"error": "Stock mismatch detected"}, status=400)

        # Reduce quantity
        store_stock.quantity -= stock.quantity
        store_stock.save()

        # Delete stock entry
        stock.delete()

        return Response({"message": "Stock deleted successfully"}, status=200)


# -------------------------------
# ISSUE ITEM
# -------------------------------
class ItemIssueAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = ItemIssue.objects.select_related(
            "issued_to","issued_by"
        ).prefetch_related("items__item")
        return Response(ItemIssueSerializer(data, many=True).data)

    def post(self, request):
        serializer = ItemIssueCreateSerializer(
            data=request.data,
            context={"request":request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Item issued successfully"})
        return Response(serializer.errors,400)

class IssueItemDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            issue = ItemIssue.objects.get(id=pk)
        except ItemIssue.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        with transaction.atomic():
            details = ItemIssueDetail.objects.filter(issue=issue)

            # Restore stock ONLY if issue was not returned
            if issue.status is False:
                for d in details:
                    stock = ItemStock.objects.select_for_update().get(
                        item=d.item
                    )
                    stock.quantity += d.quantity
                    stock.save()

            # Safe to delete
            details.delete()
            issue.delete()

        return Response({"success": True}, status=200)



# -------------------------------
# STORE STOCK API
# -------------------------------
class ItemStoreStockAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get store stock. Query params: item_id, store_id"""
        item_id = request.query_params.get("item_id")
        store_id = request.query_params.get("store_id")
        
        if item_id and store_id:
            try:
                store_stock = ItemStoreStock.objects.get(
                    item_id=item_id,
                    store_id=store_id
                )
                return Response({
                    "quantity": store_stock.quantity
                })
            except ItemStoreStock.DoesNotExist:
                return Response({"quantity": 0})
        
        # Return all store stocks if no filters
        stocks = ItemStoreStock.objects.select_related("item", "store").all()
        return Response(ItemStoreStockSerializer(stocks, many=True).data)


# -------------------------------
# RETURN ITEM
# -------------------------------
class ItemReturnAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        issue = ItemIssue.objects.get(id=request.data["issue_id"])

        for detail in issue.items.all():
            # Need to get store from issue - but issue doesn't have store field
            # For now, get first available store stock
            store_stocks = ItemStoreStock.objects.filter(item=detail.item)
            if store_stocks.exists():
                store_stock = store_stocks.first()
                store_stock.quantity += detail.quantity
                store_stock.save()

        issue.status = True
        issue.save()

        ItemReturn.objects.create(
            issue=issue,
            returned_by=request.user
        )

        return Response({"message":"Items returned successfully"})
