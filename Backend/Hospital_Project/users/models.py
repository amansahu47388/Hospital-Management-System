import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("patient", "Patient"),
        ("admin", "Admin"),
        ("doctor", "Doctor"),
        ("pharmacist", "Pharmacist"),
        ("pathologist", "Pathologist"),
        ("radiologist", "Radiologist"),
        ("accountant", "Accountant"),
        ("receptionist", "Receptionist"),
        ("nurse", "Nurse"),
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, unique=True, null=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="patient")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone']

    objects = UserManager()

    def __str__(self):
        return self.email

