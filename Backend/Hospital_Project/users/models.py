import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
    ("admin","Admin"),
    ("doctor","Doctor"),
    ("pharmacist","Pharmacist"),
    ("pathologist","Pathologist"),
    ("radiologist","Radiologist"),
    ("accountant","Accountant"),
    ("receptionist","Receptionist"),
    ("staff","Staff"),
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'full_name']

    objects = UserManager()

    def __str__(self):
        return self.email

