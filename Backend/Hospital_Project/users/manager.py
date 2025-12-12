from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, phone=None, role='patient', is_staff=False, is_superuser=False, **extra_fields):
        if not email:
            raise ValueError("User must have email")

        phone = phone or None

        user = self.model(
            email=self.normalize_email(email),
            phone=phone,
            full_name=full_name,
            role=role,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password, phone=None, **extra_fields):
        return self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            phone=phone,
            role='admin',
            is_staff=True,
            is_superuser=True,
            **extra_fields
        )
