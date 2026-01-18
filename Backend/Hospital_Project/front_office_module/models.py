from django.db import models
from django.utils import timezone
from users.models import User

class Purpose(models.Model):
    purpose_name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.purpose_name




class ComplaintType(models.Model):
    complaint_type = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.complaint_type



class Source(models.Model):
    source_name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.source_name



class Visitor(models.Model):
    name = models.CharField(max_length=150)
    purpose = models.ForeignKey(Purpose,on_delete=models.PROTECT,related_name="visitors")
    phone = models.CharField(max_length=15, blank=True, null=True)
    id_card = models.CharField( max_length=100, blank=True, null=True)
    visit_to = models.CharField(max_length=150)
    opd_ipd_staff = models.CharField(max_length=50)
    number_of_person = models.PositiveIntegerField(default=1)
    date = models.DateField(default=timezone.now)
    in_time = models.TimeField()
    out_time = models.TimeField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey("users.User", on_delete=models.PROTECT)

    class Meta:
        ordering = ["-date", "-in_time"]

    def __str__(self):
        return f"{self.name} - {self.phone}"


class Complain(models.Model):
    complain_type = models.ForeignKey(ComplaintType,on_delete=models.PROTECT,related_name="complaints")
    source = models.ForeignKey(Source,on_delete=models.PROTECT,related_name="complaints")
    complain_by = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    date = models.DateField(default=timezone.now)
    description = models.TextField(null=True, blank=True)
    action_taken = models.TextField(blank=True, null=True)
    assigned = models.CharField(max_length=150, null=True,blank=True)
    note = models.TextField(blank=True, null=True)
    
    created_by = models.ForeignKey(User,on_delete=models.PROTECT,related_name="complaints_created")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.complain_by} - {self.complain_type.complaint_type}"
    




class PostalDispatch(models.Model):
    reference_no = models.CharField(max_length=100,unique=True,)
    from_title = models.CharField(max_length=150,)
    to_title = models.CharField(max_length=150,)
    address = models.TextField(null=True, blank=True)
    note = models.TextField(blank=True,null=True)
    date = models.DateField(default=timezone.now, null=True, blank=True)

    created_by = models.ForeignKey( User, on_delete=models.PROTECT, related_name="postal_dispatches")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.reference_no} → {self.to_title}"


class PostalReceive(models.Model):
    reference_no = models.CharField(max_length=100,unique=True,)
    from_title = models.CharField(max_length=150,)
    to_title = models.CharField(max_length=150,)
    address = models.TextField(null=True, blank=True)
    note = models.TextField(blank=True,null=True)
    date = models.DateField(default=timezone.now, null=True, blank=True)

    created_by = models.ForeignKey( User, on_delete=models.PROTECT, related_name="postal_Receive")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.reference_no} → {self.to_title}"