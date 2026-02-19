from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('patient_module', '0013_alter_patient_phone'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE patient_module_patient DROP CONSTRAINT IF EXISTS patient_module_patient_phone_5e82cc87_uniq;"
        ),
        migrations.RunSQL(
            "DROP INDEX IF EXISTS patient_module_patient_phone_5e82cc87_uniq;"
        ),
    ]
