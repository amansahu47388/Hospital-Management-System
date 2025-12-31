from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User
from patient_module.models import Patient
from .models import IpdPatient, IpdDischarge

class IpdDischargeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create a staff user
        self.user = User.objects.create_user(email='admin@example.com', full_name='Admin', password='pass', phone='1234567890', role='admin')
        self.client.force_authenticate(user=self.user)

        # create patient
        self.patient = Patient.objects.create(
            first_name='Test', last_name='Patient', email='p@example.com', phone='9999999999', address='addr', city='c', state='s', zip_code='00000', date_of_birth='1990-01-01', gender='M', blood_group='O+', created_by=self.user
        )

        # create doctor user
        self.doctor = User.objects.create_user(email='doc@example.com', full_name='Doctor', password='pass', phone='1111111111', role='doctor')

    def test_discharge_creates_record_and_deletes_ipd(self):
        ipd = IpdPatient.objects.create(patient=self.patient, doctor=self.doctor, case_id='CASE123')
        url = reverse('ipd-discharge', kwargs={'pk': ipd.pk})
        data = {
            'ipd_patient': ipd.pk,
            'discharge_status': 'normal'
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, 201)
        # discharge exists
        self.assertTrue(IpdDischarge.objects.filter(patient=self.patient).exists())
        # ipd deleted
        self.assertFalse(IpdPatient.objects.filter(pk=ipd.pk).exists())

    def test_double_discharge_blocked(self):
        ipd = IpdPatient.objects.create(patient=self.patient, doctor=self.doctor, case_id='CASE124')
        url = reverse('ipd-discharge', kwargs={'pk': ipd.pk})
        data = {'ipd_patient': ipd.pk, 'discharge_status': 'normal'}
        res1 = self.client.post(url, data, format='multipart')
        self.assertEqual(res1.status_code, 201)
        # attempt second discharge on same ipd (ipd record now deleted) should fail validation or return 400
        res2 = self.client.post(url, data, format='multipart')
        self.assertIn(res2.status_code, (400, 500))

