set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput

python manage.py migrate --noinput --fake-initial

# if [ "$CREATE_SUPERUSER" = "true" ]; then
#     python manage.py createsuperuser --noinput
# fi

python scripts/ensure_superuser.py