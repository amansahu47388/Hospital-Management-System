from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('setup_module', '0002_findingcategory'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.CreateModel(
                    name='Finding',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('finding_name', models.CharField(max_length=100, unique=True)),
                        ('finding_category', models.CharField(blank=True, max_length=100, null=True)),
                        ('description', models.TextField(blank=True, null=True)),
                    ],
                ),
            ],
            state_operations=[],
        ),
    ]
