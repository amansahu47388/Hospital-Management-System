import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";
import {
  getPathologyTests,
  getPathologyBillDetail,
  updatePathologyBill,
  searchPrescription,
} from "../../api/pathologyApi";
import { searchPatient } from "../../api/patientApi";
import { getDoctors } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";


export default function UpdatePathologyBill({ open, onClose, billId }) {
  if (!open || !billId) return null;

  /* ================= STATES ================= */
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);

  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [testsList, setTestsList] = useState([]);
  const [tests, setTests] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [note, setNote] = useState("");
  const [previousReportValue, setPreviousReportValue] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");

  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const fetchedRef = useRef(false);

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getPathologyTests(),
      getDoctors(),
      getPathologyBillDetail(billId),
    ])
      .then(([testsRes, doctorsRes, billRes]) => {
        const testData = testsRes?.data || testsRes || [];
        setTestsList(testData);

        const doctorData =
          doctorsRes?.data?.results || doctorsRes?.data || [];
        setDoctors(doctorData);

        const bill = billRes?.data || billRes;

        /* ===== PREFILL DATA (aligned with PathologyBillDetailSerializer) ===== */
        // Patient: backend returns patient (id) + patient_name
        if (bill.patient) {
          setSelectedPatient({
            id: bill.patient,
            full_name: bill.patient_name,
          });
        }

        // Doctor: backend returns doctor as id
        setSelectedDoctor(bill.doctor || "");

        // Prescription: backend returns prescription as id
        if (bill.prescription) {
          setSelectedPrescription({ id: bill.prescription });
        }

        // Tests/items: backend returns "items" with test id
        const items = Array.isArray(bill.items) ? bill.items : [];
        setTests(
          items.map((t) => ({
            id: Date.now() + Math.random(),
            testId: t.test,
          }))
        );

        setDiscount(bill.discount || 0);
        setPaidAmount(bill.paid_amount || "");
        setNote(bill.note || "");
        setPreviousReportValue(!!bill.previous_report_value);
        setPaymentMode(bill.payment_mode || "cash");
      })
      .catch(() => notify("error", "Failed to load bill data"));
  }, [billId]);

  /* ================= SAFE FIND ================= */
  const findTestById = (id) =>
    testsList.find((t) => t.id === Number(id));

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () =>
      tests.reduce((sum, r) => {
        const t = findTestById(r.testId);
        return sum + (t ? Number(t.standard_charge) : 0);
      }, 0),
    [tests, testsList]
  );

  const taxAmount = useMemo(
    () =>
      tests.reduce((sum, r) => {
        const t = findTestById(r.testId);
        return sum + (t ? (t.standard_charge * t.tax) / 100 : 0);
      }, 0),
    [tests, testsList]
  );

  const discountAmount = useMemo(() => {
    if (discountPercent)
      return (subtotal * Number(discountPercent)) / 100;
    return Number(discount || 0);
  }, [discount, discountPercent, subtotal]);

  const netAmount = subtotal + taxAmount - discountAmount;

  /* ================= ROW HANDLERS ================= */
  const addRow = () =>
    setTests([...tests, { id: Date.now(), testId: "" }]);

  const removeRow = (id) =>
    tests.length > 1 && setTests(tests.filter((r) => r.id !== id));

  const updateRow = (id, value) =>
    setTests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, testId: value } : r))
    );

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!selectedPatient)
      return notify("warning", "Patient required");

    const selectedTests = tests.filter((t) => t.testId);
    if (!selectedTests.length) {
      notify("warning", "Please select at least one test");
      return;
    }

    const payload = {
      patient_id: selectedPatient.id,
      doctor_id: selectedDoctor ? Number(selectedDoctor) : null,
      prescription_id: selectedPrescription?.id || null,
      note,
      previous_report_value: previousReportValue,
      payment_mode: paymentMode,
      discount: discountAmount,
      paid_amount: Number(paidAmount || 0),
      tests: selectedTests.map((t) => ({
        test_id: Number(t.testId),
      })),
    };
    try {
      setLoading(true);
      await updatePathologyBill(billId, payload);
      notify("success", "Bill updated successfully");
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : err?.response?.data?.error ||
            err?.message ||
            "Failed to update pathology bill";
      notify("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
        <h2 className="font-semibold text-lg">Update Pathology Bill</h2>
        <X onClick={onClose} className="cursor-pointer" />
      </div>

      {/* BODY – SAME STRUCTURE AS GENERATE PAGE */}
      <div className="p-4 bg-[#f3f3f3] flex-1 overflow-y-auto">
        <div className="bg-white rounded shadow">
            <div className="grid grid-cols-6 gap-3 px-4 py-2  text-sm font-semibold">
            <span className="font-bold">Test Name</span>
            <span className="font-bold">Report Days</span>
            <span className="font-bold">Report Date</span>
            <span className="font-bold">Tax</span>
            <span className="font-bold">Amount</span>
          </div>

          {/* TEST ROWS */}
          <div className="px-4 py-3 space-y-3">
            {tests.map((row) => {
              const test = findTestById(row.testId);
              return (
                <div key={row.id} className="grid grid-cols-6 gap-3 items-center">
                  <select
                    className="border p-2 rounded"
                    value={row.testId}
                    onChange={(e) => updateRow(row.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    {testsList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.test_name}
                      </option>
                    ))}
                  </select>

                  <input className="border p-2 rounded" disabled value={test?.report_days || ""} />
                  <input
                    className="border p-2 rounded"
                    value={
                      test && test.report_days
                        ? new Date(Date.now() + test.report_days * 24 * 60 * 60 * 1000).toLocaleDateString()
                        : ""
                    }
                    disabled
                  />
                  <input className="border p-2 rounded" disabled value={test?.tax || ""} />
                  <input className="border p-2 rounded" disabled value={test?.standard_charge || ""} />

                  <button onClick={() => removeRow(row.id)}>
                    <Trash2 className="text-red-500" size={18} />
                  </button>
                </div>
              );
            })}

            <button
              onClick={addRow}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded"
            >
              + Add
            </button>
          </div>
            <div className="grid md:grid-cols-2 gap-6 border-t p-4">

            {/* LEFT */}
            <div className="space-y-4">
              <div>
                <label>Referral Doctor</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name || doctor.email || `Doctor #${doctor.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Note</label>
                <textarea 
                  className="w-full border p-2 rounded h-24"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter any additional notes..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={previousReportValue}
                    onChange={(e) => setPreviousReportValue(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Previous Report Value
                </label>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ($)</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax ($)</span>
                <span>{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span>Discount</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="border p-1 w-20"
                    placeholder="%"
                    value={discountPercent}
                    onChange={(e) => {
                      setDiscountPercent(e.target.value);
                      setDiscount(0);
                    }}
                  />
                  <span>or</span>
                  <input
                    type="number"
                    className="border p-1 w-20"
                    placeholder="$"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(e.target.value);
                      setDiscountPercent("");
                    }}
                  />
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount Amount ($)</span>
                  <span>-{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Net Amount ($)</span>
                <span>{netAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label>Payment Mode</label>
                  <select
                    className="border p-2 w-full"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="transfer to bank account">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label>Paid Amount ($)</label>
                  <input
                    type="number"
                    className="border p-2 w-full"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {paidAmount && netAmount > 0 && (
                <div className="flex justify-between text-sm mt-2">
                  <span>Balance ($)</span>
                  <span className={netAmount - Number(paidAmount) > 0 ? "text-red-600" : "text-green-600"}>
                    {(netAmount - Number(paidAmount)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>




          {/* FOOTER */}
          <div className="flex justify-end px-4 py-4 border-t bg-gray-100">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
