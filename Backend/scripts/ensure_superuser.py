"""
Idempotent superuser creation for deploy (e.g. Render build command).

Enable with environment variable:
  CREATE_SUPERUSER=true   (or 1 / yes)

Required when enabled:
  DJANGO_SUPERUSER_EMAIL
  DJANGO_SUPERUSER_PASSWORD

Optional:
  DJANGO_SUPERUSER_FULL_NAME  (default: Administrator)
  DJANGO_SUPERUSER_PHONE
"""
import os
import sys
from pathlib import Path

# Repo layout: Backend/scripts/this_file.py → project root is parent of scripts/
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

import django

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Hospital_Project.settings")
    django.setup()

    from django.contrib.auth import get_user_model

    flag = (os.environ.get("CREATE_SUPERUSER") or "").strip().lower()
    if flag not in ("1", "true", "yes"):
        print("CREATE_SUPERUSER not enabled; skipping superuser step.")
        sys.exit(0)

    User = get_user_model()
    if User.objects.filter(is_superuser=True).exists():
        print("Superuser already exists; skipping.")
        sys.exit(0)

    email = (os.environ.get("DJANGO_SUPERUSER_EMAIL") or "").strip()
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
    full_name = (os.environ.get("DJANGO_SUPERUSER_FULL_NAME") or "Administrator").strip()
    phone_raw = (os.environ.get("DJANGO_SUPERUSER_PHONE") or "").strip()
    phone = phone_raw or None

    if not email or not password:
        print(
            "ERROR: CREATE_SUPERUSER is set but DJANGO_SUPERUSER_EMAIL and "
            "DJANGO_SUPERUSER_PASSWORD must be defined in the environment.",
            file=sys.stderr,
        )
        sys.exit(1)

    User.objects.create_superuser(
        email=email,
        full_name=full_name,
        password=password,
        phone=phone,
    )
    print(f"Created superuser: {email}")
