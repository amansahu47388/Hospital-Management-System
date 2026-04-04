import api from "./axiosInstance";

/** Consolidated case ledger (pathology, radiology, pharmacy, ambulance, OPD, IPD). */
export const getCaseBillingLedger = (patientId, caseId) =>
  api.get("billing/case-ledger/", {
    params: { patient_id: patientId, case_id: String(caseId).trim() },
  });

/**
 * Record payment; optional full settlement updates all bill rows for the case on the server.
 * Body: patient_id, case_id (string), paid_amount, payment_mode, note?, payment_date?, settle_all
 */
export const postCaseBillingPayment = (body) => api.post("billing/case-payment/", body);
