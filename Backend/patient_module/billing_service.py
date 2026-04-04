"""
Hospital case billing: compute outstanding balances and settle all bills for a medical case.
"""
from decimal import Decimal

from django.db import transaction

from pathology_module.models import PathologyBill
from radiology_module.models import RadiologyBill
from pharmacy_module.models import PharmacyBill
from ambulance_module.models import AmbulanceBill
from opd_ipd_module.models import OpdPatient, IpdPatient


def _d(value):
    if value is None:
        return Decimal("0")
    return Decimal(str(value))


def pathology_balance(bill):
    return _d(bill.balance)


def radiology_balance(bill):
    return _d(bill.balance)


def pharmacy_balance(bill):
    return _d(bill.balance_amount)


def ambulance_balance(bill):
    return _d(bill.balance)


def opd_balance(visit):
    return _d(visit.total_amount) - _d(visit.paid_amount)


def ipd_balance(adm):
    total = _d(getattr(adm, "total_amount", None) or 0)
    paid = _d(getattr(adm, "paid_amount", None) or 0)
    return total - paid


def build_case_ledger_lines(case):
    """Structured lines for UI / print (all bill types for one case)."""
    lines = []

    for b in PathologyBill.objects.filter(case=case).order_by("-created_at"):
        net = _d(b.total_amount)
        paid = _d(b.paid_amount)
        bal = _d(b.balance)
        lines.append(
            {
                "module": "Pathology",
                "ref_id": b.id,
                "label": f"Pathology Bill #{b.id}",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    for b in RadiologyBill.objects.filter(case=case).order_by("-created_at"):
        net = _d(b.total_amount)
        paid = _d(b.paid_amount)
        bal = _d(b.balance)
        lines.append(
            {
                "module": "Radiology",
                "ref_id": b.id,
                "label": f"Radiology Bill #{b.id}",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    for b in PharmacyBill.objects.filter(case=case).order_by("-created_at"):
        net = _d(b.net_amount)
        paid = _d(b.paid_amount)
        bal = _d(b.balance_amount)
        lines.append(
            {
                "module": "Pharmacy",
                "ref_id": b.id,
                "label": f"Pharmacy Bill #{b.id}",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    for b in AmbulanceBill.objects.filter(case=case).order_by("-created_at"):
        net = _d(b.net_amount)
        paid = _d(b.paid_amount)
        bal = _d(b.balance)
        lines.append(
            {
                "module": "Ambulance",
                "ref_id": b.id,
                "label": f"Ambulance Bill #{b.id}",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    for v in OpdPatient.objects.filter(case=case).order_by("-created_at"):
        net = _d(v.total_amount)
        paid = _d(v.paid_amount)
        bal = net - paid
        lines.append(
            {
                "module": "OPD",
                "ref_id": v.opd_id,
                "label": f"OPD Visit #{v.opd_id} ({v.checkup_id})",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    for adm in IpdPatient.objects.filter(case=case).order_by("-created_at"):
        net = _d(getattr(adm, "total_amount", None) or 0)
        paid = _d(getattr(adm, "paid_amount", None) or 0)
        bal = net - paid
        lines.append(
            {
                "module": "IPD",
                "ref_id": adm.ipd_id,
                "label": f"IPD Admission #{adm.ipd_id}",
                "net": str(net),
                "paid": str(paid),
                "balance": str(bal),
                "status": "Paid" if bal <= 0 else "Pending",
            }
        )

    return lines


def compute_case_outstanding(case):
    """Sum of all unpaid balances linked to this MedicalCase."""
    total = Decimal("0")

    for b in PathologyBill.objects.filter(case=case):
        bal = pathology_balance(b)
        if bal > 0:
            total += bal

    for b in RadiologyBill.objects.filter(case=case):
        bal = radiology_balance(b)
        if bal > 0:
            total += bal

    for b in PharmacyBill.objects.filter(case=case):
        bal = pharmacy_balance(b)
        if bal > 0:
            total += bal

    for b in AmbulanceBill.objects.filter(case=case):
        bal = ambulance_balance(b)
        if bal > 0:
            total += bal

    for v in OpdPatient.objects.filter(case=case):
        bal = opd_balance(v)
        if bal > 0:
            total += bal

    for adm in IpdPatient.objects.filter(case=case):
        bal = ipd_balance(adm)
        if bal > 0:
            total += bal

    return total


@transaction.atomic
def settle_all_bills_for_case(case):
    """
    Mark every bill / visit for this case as fully paid (real hospital final settlement).
    """
    for b in PathologyBill.objects.select_for_update().filter(case=case):
        if pathology_balance(b) > 0:
            b.paid_amount = b.total_amount
            b.balance = Decimal("0")
            b.save(update_fields=["paid_amount", "balance", "updated_at"])

    for b in RadiologyBill.objects.select_for_update().filter(case=case):
        if radiology_balance(b) > 0:
            b.paid_amount = b.total_amount
            b.balance = Decimal("0")
            b.save(update_fields=["paid_amount", "balance", "updated_at"])

    for b in PharmacyBill.objects.select_for_update().filter(case=case):
        if pharmacy_balance(b) > 0:
            b.paid_amount = b.net_amount
            b.balance_amount = Decimal("0")
            b.save(update_fields=["paid_amount", "balance_amount"])

    for b in AmbulanceBill.objects.select_for_update().filter(case=case):
        if ambulance_balance(b) > 0:
            b.paid_amount = b.net_amount or Decimal("0")
            b.save()

    for v in OpdPatient.objects.select_for_update().filter(case=case):
        if opd_balance(v) > 0:
            v.paid_amount = v.total_amount
            v.save(update_fields=["paid_amount", "updated_at"])

    for adm in IpdPatient.objects.select_for_update().filter(case=case):
        if ipd_balance(adm) > 0:
            total = _d(getattr(adm, "total_amount", None) or 0)
            adm.paid_amount = total
            adm.save(update_fields=["paid_amount", "updated_at"])
