from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('radiology_module', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql='ALTER TABLE radiology_module_radiologyparameter DROP COLUMN IF EXISTS radiology_test_id CASCADE;',
            reverse_sql='ALTER TABLE radiology_module_radiologyparameter ADD COLUMN IF NOT EXISTS radiology_test_id INTEGER;',
        ),
    ]
