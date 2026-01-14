from django.db import models

class ItemCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ItemStore(models.Model):
    store_name = models.CharField(max_length=200, unique=True)
    store_code = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name



class ItemSupplier(models.Model):
    supplier_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    contact_person = models.CharField(max_length=150)
    contact_person_phone = models.CharField(max_length=20)
    contact_person_email = models.EmailField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.supplier_name


class Item(models.Model):
    item_name = models.CharField(max_length=200)
    category = models.ForeignKey(ItemCategory, on_delete=models.PROTECT, related_name="items")
    unit = models.PositiveIntegerField(help_text="Unit per stock entry")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey("users.User", on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["item_name", "category"]

    def __str__(self):
        return self.item_name



class ItemStock(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="stocks")
    category = models.ForeignKey(ItemCategory, on_delete=models.PROTECT)
    supplier = models.ForeignKey(ItemSupplier, on_delete=models.PROTECT)
    store = models.ForeignKey(ItemStore, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    stock_date = models.DateField()
    document = models.FileField(upload_to="inventory_docs/", blank=True, null=True)

    created_by = models.ForeignKey("users.User", on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item} - {self.quantity}"




class ItemStoreStock(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    store = models.ForeignKey(ItemStore, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ["item", "store"]

    def __str__(self):
        return f"{self.item} - {self.store}"


class ItemIssue(models.Model):
    user_type = models.CharField(max_length=20)
    issued_to = models.ForeignKey("users.User", on_delete=models.PROTECT, related_name="issued_items")
    issued_by = models.ForeignKey("users.User", on_delete=models.PROTECT, related_name="issued_by")
    issue_date = models.DateField()
    return_date = models.DateField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=False)  

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Issue #{self.id}"


class ItemIssueDetail(models.Model):
    issue = models.ForeignKey(ItemIssue, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    category = models.ForeignKey(ItemCategory, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.item} ({self.quantity})"



class ItemReturn(models.Model):
    issue = models.ForeignKey(ItemIssue, on_delete=models.CASCADE)
    return_date = models.DateField(auto_now_add=True)
    returned_by = models.ForeignKey("users.User", on_delete=models.PROTECT)

    def __str__(self):
        return f"Return #{self.id}"
