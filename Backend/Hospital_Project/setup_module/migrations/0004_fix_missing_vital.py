from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('setup_module', '0003_fix_missing_finding'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.CreateModel(
                    name='Vital',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('vital_name', models.CharField(max_length=100, unique=True)),
                        ('reference_range', models.CharField(blank=True, max_length=100, null=True)),
                        ('unit', models.CharField(blank=True, max_length=50, null=True)),
                    ],
                ),
            ],
            state_operations=[],
        ),
    ]
