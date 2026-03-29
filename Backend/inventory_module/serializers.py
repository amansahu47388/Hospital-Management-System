from rest_framework import serializers
from django.db import transaction
from .models import *

# -------------------------------
# Category
# -------------------------------
class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = "__all__"


# -------------------------------
# Store
# -------------------------------
class ItemStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemStore
        fields = "__all__"


# -------------------------------
# Supplier
# -------------------------------
class ItemSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSupplier
        fields = "__all__"


# -------------------------------
# Item
# -------------------------------
class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    available_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = "__all__"
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def get_available_quantity(self, obj):
        from django.db.models import Sum

        total = ItemStoreStock.objects.filter(item=obj).aggregate(
            total=Sum("quantity")
        )["total"]

        return total or 0


# -------------------------------
# Store Stock
# -------------------------------
class ItemStoreStockSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.item_name", read_only=True)
    store_name = serializers.CharField(source="store.store_name", read_only=True)

    class Meta:
        model = ItemStoreStock
        fields = "__all__"


# -------------------------------
# Item Stock (Purchase)
# -------------------------------
class ItemStockSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.item_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    store_name = serializers.CharField(source="store.store_name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.supplier_name", read_only=True)

    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ItemStock
        fields = [
            "id",
            "item",
            "item_name",
            "category",
            "category_name",
            "supplier",
            "supplier_name",
            "store",
            "store_name",
            "quantity",
            "purchase_price",
            "stock_date",
            "description",
            "document",
            "created_by",
            "created_by_name",
            "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]

    def validate(self, data):
        if data["quantity"] <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero")
        return data

    # ✅ MUST be inside the class
    def get_created_by_name(self, obj):
        user = obj.created_by

        if not user:
            return "System"

        # Full name
        full_name = f"{user.full_name}".strip()
        if full_name:
            return full_name

        # Fallback
        return f"User-{user.id}"


# -------------------------------
# Issue Details
# -------------------------------
class ItemIssueDetailSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.item_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ItemIssueDetail
        fields = [
            "id",
            "item",
            "item_name",
            "category",
            "category_name",
            "quantity",
        ]



# -------------------------------
# Issue
# -------------------------------
class ItemIssueSerializer(serializers.ModelSerializer):
    issued_to_name = serializers.CharField(source="issued_to.full_name", read_only=True)
    issued_by_name = serializers.CharField(source="issued_by.full_name", read_only=True)
    items = ItemIssueDetailSerializer(many=True)

    class Meta:
        model = ItemIssue
        fields = [
            "id",
            "user_type",
            "issued_to",
            "issued_to_name",
            "issued_by",
            "issued_by_name",
            "issue_date",
            "return_date",
            "note",
            "status",
            "items",
        ]
    

class ItemIssueCreateSerializer(serializers.Serializer):
    user_type = serializers.CharField()
    issued_to = serializers.IntegerField()
    issue_date = serializers.DateField()
    return_date = serializers.DateField(required=False)
    note = serializers.CharField(required=False, allow_blank=True)
    store = serializers.IntegerField()
    items = serializers.ListField()

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        items_data = validated_data.pop("items")
        store_id = validated_data.pop("store")
        
        # Convert issued_to from integer ID to User instance
        issued_to_id = validated_data.pop("issued_to")
        from users.models import User
        try:
            issued_to_user = User.objects.get(id=issued_to_id)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with ID {issued_to_id} not found")

        issue = ItemIssue.objects.create(
            issued_by=request.user,
            issued_to=issued_to_user,
            **validated_data
        )

        for row in items_data:
            item = Item.objects.get(id=row["item"])
            qty = int(row["quantity"])

            # Validate stock - get store-specific stock
            try:
                store_stock = ItemStoreStock.objects.select_for_update().get(
                    item=item,
                    store_id=store_id
                )
            except ItemStoreStock.DoesNotExist:
                raise serializers.ValidationError(
                    f"No stock found for {item.item_name} in selected store"
                )

            if store_stock.quantity < qty:
                raise serializers.ValidationError(
                    f"Not enough stock for {item.item_name}. Available: {store_stock.quantity}, Requested: {qty}"
                )

            # Reduce stock
            store_stock.quantity -= qty
            store_stock.save()

            ItemIssueDetail.objects.create(
                issue=issue,
                item=item,
                category=item.category,
                quantity=qty
            )

        return issue
    


# -------------------------------
# Return
# -------------------------------
class ItemReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemReturn
        fields = "__all__"

    def create(self, validated_data):
        issue = validated_data["issue"]

        for detail in issue.items.all():
            store_stock = ItemStoreStock.objects.get(item=detail.item)
            store_stock.quantity += detail.quantity
            store_stock.save()

        issue.status = True
        issue.save()

        return super().create(validated_data)
