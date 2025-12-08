from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, phone=None, role='staff'):
        if not email:
            raise ValueError("User must have email")
        
        if not phone:
            phone = "0000000000"  # Default phone if not provided

        user = self.model(
            email=self.normalize_email(email),
            phone=phone,
            full_name=full_name,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password, phone=None):
        if not phone:
            phone = "0000000000"
        user = self.create_user(
            email=email,
            phone=phone,
            full_name=full_name,
            role='admin',
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user
