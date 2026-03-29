from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta, datetime

from patient_module.models import Patient
from opd_ipd_module.models import OpdPatient, IpdPatient
from appointment_module.models import Appointment
from pharmacy_module.models import Medicine, PharmacyBill, MedicineStock
from pathology_module.models import PathologyBill
from radiology_module.models import RadiologyBill
from finance_module.models import Income, Expense
from users.models import User
from setup_module.models import Bed
from utils.mixins import StandardResponseMixin
from utils.response import success_response, handle_exception

class DashboardAPIView(StandardResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            role = getattr(user, 'role', 'admin')
            
            # Common timeframes
            today = timezone.now().date()
            start_of_month = today.replace(day=1)
            prev_month_start = (start_of_month - timedelta(days=1)).replace(day=1)

            # --- STATS (General) ---
            total_patients = Patient.objects.count()
            today_appointments = Appointment.objects.filter(appointment_date__date=today).count()
            active_ipd = IpdPatient.objects.filter(is_discharged=False).count()
            
            # Financial Stats (Current Month)
            def get_month_income(start_date, end_date):
                inc = Income.objects.filter(date__gte=start_date, date__lte=end_date).aggregate(total=Sum('amount'))['total'] or 0
                phar = PharmacyBill.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date).aggregate(total=Sum('net_amount'))['total'] or 0
                path = PathologyBill.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date).aggregate(total=Sum('total_amount'))['total'] or 0
                rad = RadiologyBill.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date).aggregate(total=Sum('total_amount'))['total'] or 0
                return float(inc) + float(phar) + float(path) + float(rad)

            total_monthly_income = get_month_income(start_of_month, today)
            prev_monthly_income = get_month_income(prev_month_start, start_of_month - timedelta(days=1))

            stats = [
                {"id": 1, "title": "Total Patients", "value": total_patients, "icon": "Users", "color": "blue"},
                {"id": 2, "title": "Today's Appointments", "value": today_appointments, "icon": "Calendar", "color": "purple"},
                {"id": 3, "title": "Active IPD", "value": active_ipd, "icon": "Bed", "color": "green"},
                {"id": 4, "title": "Monthly Income", "value": f"${total_monthly_income:,.2f}", "icon": "DollarSign", "color": "orange"},
            ]

            # --- EFFICIENCY DATA ---
            total_beds = Bed.objects.count()
            occupied_beds = Bed.objects.filter(status='occupied').count()
            bed_occupancy = (occupied_beds / total_beds * 100) if total_beds > 0 else 0
            
            # Revenue Trend (Last 6 Months)
            revenue_trend = []
            for i in range(5, -1, -1):
                m_start = (start_of_month - timedelta(days=i*30)).replace(day=1)
                m_end = (m_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                rev = get_month_income(m_start, m_end)
                revenue_trend.append({"month": m_start.strftime('%b'), "revenue": rev})

            # Operational Efficiency
            avg_appointments = Appointment.objects.filter(appointment_date__date__gte=today - timedelta(days=30)).count() / 30
            
            efficiency = {
                "bed_occupancy": round(bed_occupancy, 1),
                "revenue_growth": round(((total_monthly_income - prev_monthly_income) / prev_monthly_income * 100) if prev_monthly_income > 0 else 0, 1),
                "avg_daily_appointments": round(avg_appointments, 1),
                "revenue_trend": revenue_trend,
                "total_beds": total_beds,
                "occupied_beds": occupied_beds
            }

            # --- CHART DATA (Patient Registrations last 7 days) ---
            days = []
            reg_counts = []
            for i in range(6, -1, -1):
                d = today - timedelta(days=i)
                count = Patient.objects.filter(created_at__date=d).count()
                days.append(d.strftime('%a'))
                reg_counts.append(count)
            
            chart_data = {
                "labels": days,
                "values": reg_counts
            }

            # --- TABLES / LISTS ---
            recent_appointments_qs = Appointment.objects.select_related('patient', 'doctor')
            if role == 'doctor':
                recent_appointments_qs = recent_appointments_qs.filter(doctor=user)
            recent_appointments = recent_appointments_qs.order_by('-appointment_date')[:5]
            
            appointments_list = [
                {
                    "id": app.id,
                    "patient_name": app.patient.full_name if app.patient else "N/A",
                    "doctor_name": app.doctor.full_name if app.doctor else "N/A",
                    "date": app.appointment_date.strftime('%Y-%m-%d %H:%M'),
                    "status": app.status
                }
                for app in recent_appointments
            ]

            low_stock = Medicine.objects.annotate(
                total_qty=Coalesce(Sum('medicinestock__available_qty'), 0)
            ).filter(total_qty__lt=50).order_by('total_qty')[:5]
            
            stock_list = [{"id": m.id, "name": m.name, "qty": m.total_qty, "unit": m.unit.unit_name if m.unit else ""} for m in low_stock]

            doctors = User.objects.filter(role='doctor')[:5]
            doctors_list = [{"id": d.id, "name": d.full_name, "phone": d.phone, "status": "online" if d.is_active else "offline", "img": None} for d in doctors]

            # --- COMBINED RESPONSE ---
            data = {
                "stats": stats,
                "chart": chart_data,
                "appointments": appointments_list,
                "stock": stock_list,
                "doctors": doctors_list,
                "efficiency": efficiency,
                "role": role
            }

            return success_response(data)

        except Exception as e:
            return handle_exception(e)
