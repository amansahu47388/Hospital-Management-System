from decimal import Decimal

from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .billing_service import (
    build_case_ledger_lines,
    compute_case_outstanding,
    settle_all_bills_for_case,
)
from .models import MedicalCase, PatientPayment


class CaseBillingLedgerView(APIView):
    """
    GET ?patient_id=&case_id=
    Returns consolidated ledger lines + totals for hospital billing desk.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        patient_id = request.query_params.get("patient_id")
        case_id = request.query_params.get("case_id")
        if not patient_id or not case_id:
            return Response(
                {"detail": "Query params patient_id and case_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            case = MedicalCase.objects.select_related("patient").get(
                case_id=str(case_id).strip(),
                patient_id=int(patient_id),
            )
        except (MedicalCase.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Medical case not found for this patient and case ID."},
                status=status.HTTP_404_NOT_FOUND,
            )

        lines = build_case_ledger_lines(case)
        outstanding = compute_case_outstanding(case)
        total_net = sum(Decimal(x["net"]) for x in lines)
        total_paid = sum(Decimal(x["paid"]) for x in lines)

        return Response(
            {
                "case_id": case.case_id,
                "case_pk": case.id,
                "patient_id": case.patient_id,
                "patient_name": case.patient.full_name if case.patient else "",
                "lines": lines,
                "totals": {
                    "net": str(total_net),
                    "paid": str(total_paid),
                    "outstanding": str(outstanding),
                },
            }
        )


class CaseBillingPaymentView(APIView):
    """
    POST JSON:
      patient_id, case_id (string), paid_amount, payment_mode, note (opt),
      payment_date (YYYY-MM-DD opt), settle_all (bool)

    When settle_all is true: records one PatientPayment against the case and
    marks pathology, radiology, pharmacy, ambulance, OPD, IPD lines as fully paid.
    paid_amount must be >= outstanding (within 0.01) unless outstanding is 0.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        patient_id = data.get("patient_id")
        case_id = data.get("case_id")
        settle_all = str(data.get("settle_all", "")).lower() in (
            "1",
            "true",
            "yes",
        )

        if patient_id is None or case_id is None:
            return Response(
                {"detail": "patient_id and case_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            case = MedicalCase.objects.get(
                case_id=str(case_id).strip(),
                patient_id=int(patient_id),
            )
        except (MedicalCase.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Medical case not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            paid_amount = Decimal(str(data.get("paid_amount", "0")))
        except Exception:
            return Response(
                {"detail": "Invalid paid_amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if paid_amount <= 0:
            return Response(
                {"detail": "paid_amount must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_mode = data.get("payment_mode") or "Cash"
        note = data.get("note") or ""
        payment_date = data.get("payment_date") or None

        with transaction.atomic():
            outstanding = compute_case_outstanding(case)

            if settle_all:
                if outstanding <= 0:
                    return Response(
                        {
                            "detail": "Nothing to settle; outstanding balance is already zero.",
                            "outstanding": str(outstanding),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if paid_amount + Decimal("0.01") < outstanding:
                    return Response(
                        {
                            "detail": f"Amount too low for full settlement. Outstanding: {outstanding}",
                            "outstanding": str(outstanding),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                settle_all_bills_for_case(case)

            payment = PatientPayment.objects.create(
                patient_id=case.patient_id,
                case=case,
                payment_date=payment_date,
                paid_amount=paid_amount,
                payment_mode=payment_mode,
                note=note or ("Full case settlement" if settle_all else "Case payment"),
                service_type="General",
                created_by=request.user,
            )

        lines = build_case_ledger_lines(case)
        new_outstanding = compute_case_outstanding(case)

        return Response(
            {
                "payment_id": payment.id,
                "settle_all": settle_all,
                "lines": lines,
                "outstanding_after": str(new_outstanding),
            },
            status=status.HTTP_201_CREATED,
        )
