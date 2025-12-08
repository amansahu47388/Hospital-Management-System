from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, phone, full_name, role, password=None):
        if not email:
            raise ValueError("User must have email")

        user = self.model(
            email=self.normalize_email(email),
            phone=phone,
            full_name=full_name,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, full_name, password):
        user = self.create_user(
            email=email,
            phone=phone,
            full_name=full_name,
            role='ADMIN',
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user
