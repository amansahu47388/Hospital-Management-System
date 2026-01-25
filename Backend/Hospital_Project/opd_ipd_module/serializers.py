from rest_framework import serializers
from django.db import transaction, models
from django.utils.timezone import now
import uuid

from .models import OpdPatient, IpdPatient, IpdDischarge, Prescription, PrescriptionMedicine, NurseNote
from patient_module.serializers import PatientSerializer
from setup_module.serializers import BedSerializer
from users.serializers import UserSerializer


class NurseNoteSerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source="nurse.full_name", read_only=True)
    formatted_date = serializers.DateTimeField(source="created_at", format="%d/%m/%Y %I:%M %p", read_only=True)

    class Meta:
        model = NurseNote
        fields = "__all__"
        read_only_fields = ("created_by", "created_at", "updated_at")

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)



class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    medicine_name = serializers.CharField(source="medicine.name", read_only=True)
    category_name = serializers.CharField(source="medicine_category.category_name", read_only=True)
    dosage_name = serializers.SerializerMethodField()
    interval_name = serializers.CharField(source="dosage.dosage_interval", read_only=True)
    duration_name = serializers.CharField(source="dosage.dosage_duration", read_only=True)

    class Meta:
        model = PrescriptionMedicine
        exclude = ("prescription",)
        extra_kwargs = {
            "medicine_category": {"required": False, "allow_null": True},
            "medicine": {"required": False, "allow_null": True},
            "medicine_dosage": {"required": False, "allow_null": True},
            "dosage": {"required": False, "allow_null": True},
        }

    def get_dosage_name(self, obj):
        if obj.medicine_dosage:
            return f"{obj.medicine_dosage.dosage} {obj.medicine_dosage.unit.unit_name}"
        return ""


class PrescriptionSerializer(serializers.ModelSerializer):
    medicines = PrescriptionMedicineSerializer(many=True)
    patient_details = serializers.SerializerMethodField()
    prescribed_by_details = serializers.SerializerMethodField()
    consultant_doctor_details = serializers.SerializerMethodField()
    generated_by_details = serializers.SerializerMethodField()
    pathology_details = serializers.SerializerMethodField()
    radiology_details = serializers.SerializerMethodField()
    symptoms_text = serializers.SerializerMethodField()
    finding_name = serializers.CharField(source="findings.finding_name", read_only=True)

    class Meta:
        model = Prescription
        fields = "__all__"
        read_only_fields = ("created_by",)
        extra_kwargs = {
            "patient": {"required": False, "allow_null": True},
            "opd_patient": {"required": False, "allow_null": True},
            "ipd_patient": {"required": False, "allow_null": True},
            "prescribed_by": {"required": False, "allow_null": True},
            "findings": {"required": False, "allow_null": True},
        }

    def get_patient_details(self, obj):
        if obj.patient:
            return {
                "id": obj.patient.id,
                "name": f"{obj.patient.first_name} {obj.patient.last_name}",
                "age": obj.patient.age,
                "gender": obj.patient.gender,
                "blood_group": obj.patient.blood_group,
                "phone": obj.patient.phone,
                "email": obj.patient.email,
            }
        return None

    def get_prescribed_by_details(self, obj):
        if obj.prescribed_by:
            return {
                "id": obj.prescribed_by.id,
                "name": obj.prescribed_by.full_name,
            }
        return None

    def get_consultant_doctor_details(self, obj):
        if obj.ipd_patient and obj.ipd_patient.doctor:
            return {
                "id": obj.ipd_patient.doctor.id,
                "name": obj.ipd_patient.doctor.full_name,
            }
        elif obj.opd_patient and obj.opd_patient.doctor:
            return {
                "id": obj.opd_patient.doctor.id,
                "name": obj.opd_patient.doctor.full_name,
            }
        return None

    def get_generated_by_details(self, obj):
        if obj.created_by:
            return {
                "id": obj.created_by.id,
                "name": obj.created_by.full_name,
            }
        return None

    def get_pathology_details(self, obj):
        return [{"id": t.id, "test_name": t.test_name} for t in obj.pathology.all()]

    def get_radiology_details(self, obj):
        return [{"id": t.id, "test_name": t.test_name} for t in obj.radiology.all()]

    def get_symptoms_text(self, obj):
        if obj.ipd_patient and obj.ipd_patient.symptom:
            return obj.ipd_patient.symptom.symptom_title
        elif obj.opd_patient and obj.opd_patient.symptom:
            return obj.opd_patient.symptom.symptom_title
        return ""

    def validate(self, data):
        opd = data.get("opd_patient")
        ipd = data.get("ipd_patient")
        patient = data.get("patient")

        if opd and ipd:
            raise serializers.ValidationError(
                "Prescription can be either OPD or IPD, not both."
            )

        if not opd and not ipd:
            raise serializers.ValidationError(
                "Either OPD patient or IPD patient is required."
            )

        # Automatically set patient from OPD/IPD if not provided
        if not patient:
            if opd:
                data["patient"] = opd.patient
            elif ipd:
                data["patient"] = ipd.patient
            
            if not data.get("patient"):
                raise serializers.ValidationError({
                    "patient": "Patient could not be determined from the provided OPD/IPD patient."
                })

        return data

    @transaction.atomic
    def create(self, validated_data):
        medicines_data = validated_data.pop("medicines", [])
        pathology_data = validated_data.pop("pathology", [])
        radiology_data = validated_data.pop("radiology", [])

        request = self.context.get("request")
        user = request.user if request else None

        # If prescribed_by is not provided, use current user
        if not validated_data.get("prescribed_by"):
            validated_data["prescribed_by"] = user

        prescription = Prescription.objects.create(
            **validated_data,
            created_by=user
        )

        if pathology_data:
            prescription.pathology.set(pathology_data)
        if radiology_data:
            prescription.radiology.set(radiology_data)

        for med in medicines_data:
            # Filter out empty medicine rows (where everything is null)
            if not any(v for k, v in med.items() if k != 'id'):
                continue
            med.pop("id", None) # Remove ID if present during creation
            PrescriptionMedicine.objects.create(
                prescription=prescription,
                **med
            )

        return prescription

    @transaction.atomic
    def update(self, instance, validated_data):
        medicines_data = validated_data.pop("medicines", None)
        pathology_data = validated_data.pop("pathology", None)
        radiology_data = validated_data.pop("radiology", None)

        instance = super().update(instance, validated_data)

        if pathology_data is not None:
            instance.pathology.set(pathology_data)
        if radiology_data is not None:
            instance.radiology.set(radiology_data)

        if medicines_data is not None:
            existing_ids = []
            for med in medicines_data:
                med_id = med.get("id")
                # Filter out empty medicine rows
                if not any(v for k, v in med.items() if k != 'id'):
                    continue
                
                if med_id:
                    obj = PrescriptionMedicine.objects.get(id=med_id, prescription=instance)
                    # Pop ID so it doesn't try to update it
                    med_copy = med.copy()
                    med_copy.pop("id", None)
                    for attr, value in med_copy.items():
                        setattr(obj, attr, value)
                    obj.save()
                    existing_ids.append(obj.id)
                else:
                    med_copy = med.copy()
                    med_copy.pop("id", None)
                    new_med = PrescriptionMedicine.objects.create(prescription=instance, **med_copy)
                    existing_ids.append(new_med.id)
            instance.medicines.exclude(id__in=existing_ids).delete()

        return instance


# OPD Patient Serializers
class OpdPatientSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    charge_category = serializers.CharField(source="charge.charge_category", read_only=True)
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = UserSerializer(source='doctor', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = OpdPatient
        fields = [
            'opd_id', 'patient', 'patient_detail', 'appointment_date', 'doctor', 'doctor_detail',
            'symptom', 'discount', 'total_amount', 'paid_amount', 'payment_mode','allergies',
            'checkup_id', 'case_id', 'old_patient', 'casualty', 'charge_id', 'charge_category',
            'reference', 'previous_medical_issue', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['opd_id', 'case_id', 'checkup_id',  'created_by', 'created_at', 'updated_at']

class OpdPatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpdPatient
        fields = [
            'patient', 'appointment_date', 'doctor','allergies', 'symptom', 'discount', 'total_amount', 'paid_amount', 
            'payment_mode', 'old_patient', 'casualty', 'reference', 'previous_medical_issue',
        ]

    def create(self, validated_data):
        max_id = OpdPatient.objects.aggregate(max_id=models.Max('opd_id'))['max_id'] or 0
        next_id = max_id + 1
        
        validated_data["case_id"] = f"CAS{next_id:04d}"
        validated_data["checkup_id"] = f"CHK{next_id:04d}"

        return super().create(validated_data)


class OpdPatientListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)    # return nested created_by for list view
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = OpdPatient
        fields = [
            "opd_id","patient_detail","case_id","checkup_id",'allergies', "appointment_date","created_by",
            "doctor_detail","reference","symptom_name","old_patient","previous_medical_issue",
        ]


class OpdPatientUpdateSerializer(serializers.ModelSerializer):
    charge_id = serializers.IntegerField(source="charge.id", read_only=True)
    class Meta:
        model = OpdPatient
        fields = [
            'appointment_date', 'charge_id', 'doctor','allergies','symptom','discount','total_amount','paid_amount',
            'payment_mode','old_patient','casualty','reference','previous_medical_issue',
        ]







# IPD Patient Serializers 
class IpdPatientSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = UserSerializer(source='doctor', read_only=True)
    created_by = UserSerializer(read_only=True)
    bed = BedSerializer(read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)

    class Meta:
        model = IpdPatient
        fields = [
            'ipd_id', 'patient', 'patient_detail', 'admission_date', 'doctor', 'doctor_detail', 'bed' , 'discharge_date',
            'symptom', 'symptom_name', 'allergies','checkup_id', 'case_id', 'old_patient', 'casualty', 'reference', 'previous_medical_issue', 
            'credit_limit', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['ipd_id', 'checkup_id',  'created_by', 'created_at', 'updated_at']


class IpdPatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdPatient
        fields = [
            'patient', 'admission_date', 'doctor','allergies', 'symptom', 'bed', 'credit_limit' , 'case_id',
            'old_patient', 'casualty', 'reference', 'previous_medical_issue',
        ]

    @transaction.atomic
    def create(self, validated_data):
        max_id = IpdPatient.objects.aggregate(max_id=models.Max('ipd_id'))['max_id'] or 0
        next_id = max_id + 1
        
        validated_data["case_id"] = f"CAS-IPD{next_id:04d}"
        if not validated_data.get("checkup_id"):
             validated_data["checkup_id"] = f"CHK-IPD{next_id:04d}"
             
        instance = super().create(validated_data)
        
        # Mark bed as occupied
        if instance.bed:
            instance.bed.status = "occupied"
            instance.bed.save()
            
        return instance


class IpdPatientListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    created_by = UserSerializer(read_only=True)
    bed = BedSerializer(read_only=True)
    symptom_name = serializers.CharField(source="symptom.symptom_title", read_only=True)

    class Meta:
        model = IpdPatient
        fields = [
            "ipd_id","case_id","patient_detail","admission_date","case_id","doctor_detail","bed","symptom_name",
            "previous_medical_issue","credit_limit","created_by","created_at",
        ]



class IpdPatientUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdPatient
        fields = [
            'admission_date', 'doctor','allergies','symptom', 'bed','old_patient','casualty','reference','previous_medical_issue',
            "credit_limit","created_by","created_at",
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        old_bed = instance.bed
        new_bed = validated_data.get('bed')

        # Proceed with update
        instance = super().update(instance, validated_data)

        # Handle bed status change
        if 'bed' in validated_data:
            if old_bed and old_bed != new_bed:
                old_bed.status = "available"
                old_bed.save()
            
            if new_bed:
                new_bed.status = "occupied"
                new_bed.save()

        return instance


class IpdDischargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpdDischarge
        fields = "__all__"
        extra_kwargs = {
            "ipd_patient": {"required": False},
            "patient": {"required": False},
            "death_date": {"required": False, "allow_null": True},
            "guardian_name": {"required": False, "allow_blank": True},
            "referral_date": {"required": False, "allow_null": True},
            "hospital_name": {"required": False, "allow_blank": True},
            "reason": {"required": False, "allow_blank": True},
            "attachment": {"required": False, "allow_null": True},
            "report": {"required": False, "allow_blank": True},
            "diagnosis": {"required": False, "allow_blank": True},
            "investigation": {"required": False, "allow_blank": True},
            "operation": {"required": False, "allow_blank": True},
            "treatment_at_home": {"required": False, "allow_blank": True},
            "discharge_note": {"required": False, "allow_blank": True},
        }

    def validate(self, data):
        status = data.get("discharge_status")

        if status == "death":
            if not data.get("death_date"):
                raise serializers.ValidationError({
                    "death_date": "Death date is required"
                })
            if not data.get("guardian_name"):
                raise serializers.ValidationError({
                    "guardian_name": "Guardian name is required"
                })

        if status == "referral":
            if not data.get("referral_date"):
                raise serializers.ValidationError({
                    "referral_date": "Referral date is required"
                })
            if not data.get("hospital_name"):
                raise serializers.ValidationError({
                    "hospital_name": "Hospital name is required"
                })
            if not data.get("reason"):
                raise serializers.ValidationError({
                    "reason": "Reason is required"
                })

        return data


class IpdDischargedListSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    created_by = UserSerializer(read_only=True)
    discharge = serializers.SerializerMethodField()

    class Meta:
        model = IpdPatient
        fields = [
            "ipd_id","case_id","patient_detail","doctor_detail","created_by","admission_date", "discharge_date","credit_limit","discharge",
        ]

    def get_discharge(self, obj):
        if hasattr(obj, "discharge"):
            return {
                "status": obj.discharge.discharge_status,
                "discharge_date": obj.discharge.discharge_date,
                "death_date": obj.discharge.death_date,
                "guardian_name": obj.discharge.guardian_name,
                "report": obj.discharge.report,
                "referral_date": obj.discharge.referral_date,
                "reason": obj.discharge.reason,
                "hospital_name": obj.discharge.hospital_name
            }
        return None
    
    def get_attachment(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None



