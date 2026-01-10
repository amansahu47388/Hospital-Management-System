# Generated manually
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ambulance_module', '0002_alter_ambulance_year_made'),
        ('setup_module', '0002_hospitalcharges_symptom'),
    ]

    operations = [
        migrations.AddField(
            model_name='ambulancebill',
            name='hospital_charge',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ambulance_bills', to='setup_module.hospitalcharges'),
        ),
    ]

