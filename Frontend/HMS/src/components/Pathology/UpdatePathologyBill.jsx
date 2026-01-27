import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";
import {
  getPathologyTests,
  getPathologyBillDetail,
  updatePathologyBill,
  searchPrescription,
} from "../../api/pathologyApi";
import { searchPatient, getMedicalCases } from "../../api/patientApi";
import { getDoctors } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";


export default function UpdatePathologyBill({ open, onClose, billId }) {
  if (!open || !billId) return null;

  /* ================= STATES ================= */
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [isSelectingPatient, setIsSelectingPatient] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [cases, setCases] = useState([]); // Add cases state
  const [selectedCase, setSelectedCase] = useState(""); // Add selectedCase state
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

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
          setIsSelectingPatient(true);
          setSelectedPatient({
            id: bill.patient,
            full_name: bill.patient_name,
          });
          setPatientSearch(bill.patient_name || "");
          setTimeout(() => setIsSelectingPatient(false), 500);
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
        setSelectedCase(bill.case || "");

        // Fetch cases for the prefilled patient
        if (bill.patient) {
          getMedicalCases(bill.patient).then((res) => {
            setCases(res.data || []);
          });
        }
      })
      .catch(() => notify("error", "Failed to load bill data"));
  }, [billId]);

  /* ================= SAFE FIND ================= */
  const findTestById = (id) =>
    testsList.find((t) => t.id === Number(id));

  /* ================= PATIENT SEARCH ================= */
  useEffect(() => {
    if (!patientSearch || isSelectingPatient) {
      if (!isSelectingPatient) {
        setPatients([]);
        setShowPatientDropdown(false);
      }
      return;
    }

    let active = true;
    setPatientLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchPatient(patientSearch);
        const payload = res?.data ?? res;
        const data = Array.isArray(payload)
          ? payload
          : payload?.results || payload?.data || [];

        if (!active) return;
        setPatients(data);
        setShowPatientDropdown(true);
      } catch (err) {
        if (!active) return;
        console.error("Patient search failed:", err);
        setPatients([]);
        setShowPatientDropdown(true);
      } finally {
        if (active) setPatientLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
      setPatientLoading(false);
    };
  }, [patientSearch]);

  const filteredPatients = Array.isArray(patients) ? patients : [];

  useEffect(() => {
    if (selectedPatient) {
      getMedicalCases(selectedPatient.id)
        .then((res) => {
          setCases(res.data || []);
          // Only clear if the patient changed from what was initially loaded
          // or handle logic to preserve if it's the same patient
        })
        .catch(() => setCases([]));
    } else {
      setCases([]);
      setSelectedCase("");
    }
  }, [selectedPatient]);

  // Close dropdown on click outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

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

  /* ================= PRESCRIPTION SEARCH ================= */
  const handlePrescriptionSearch = async () => {
    if (!prescriptionSearch.trim()) {
      notify("warning", "Please enter a prescription ID");
      return;
    }

    try {
      setPrescriptionLoading(true);
      const res = await searchPrescription(prescriptionSearch);
      const data = res?.data || res;

      if (data.id) {
        setSelectedPrescription(data);
        notify("success", "Prescription found");
      }
    } catch (err) {
      notify("error", "Prescription not found");
      setSelectedPrescription(null);
    } finally {
      setPrescriptionLoading(false);
    }
  };

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
      case_id: selectedCase || null, // Add case_id
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 px-3 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Patient Search */}
          <div className="relative w-full sm:w-80" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded px-3 py-1 text-black">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Patient..."
                className="w-full text-sm sm:text-base outline-none"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setSelectedPatient(null);
                  setShowPatientDropdown(true);
                }}
              />
            </div>

            {showPatientDropdown && !selectedPatient && (
              <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 text-black">
                {filteredPatients.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {patientLoading ? "Searching..." : "No patient found"}
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSelectingPatient(true);
                        setSelectedPatient({ ...p, full_name: p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() });
                        setPatientSearch(`${p.first_name || ""} ${p.last_name || ""}`.trim());
                        setShowPatientDropdown(false);
                        setTimeout(() => setIsSelectingPatient(false), 0);
                      }}
                      className="px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-[#F3EEFF] text-black"
                    >
                      <div className="flex flex-col">
                        <span>{p.first_name} {p.last_name}</span>
                        <span className="text-[10px] text-gray-400">{p.phone || p.mobile || "No phone"}</span>
                      </div>
                      <span className="text-xs text-gray-400">#{p.id}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Prescription Search */}
          <div className="flex items-center w-full sm:w-72">
            <div className="flex items-center bg-white rounded px-3 py-1 text-black w-full">
              <input
                className="w-full text-sm sm:text-base outline-none"
                placeholder="Prescription ID..."
                value={prescriptionSearch}
                onChange={(e) => setPrescriptionSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePrescriptionSearch()}
              />
              <button
                onClick={handlePrescriptionSearch}
                disabled={prescriptionLoading}
                className="ml-2 text-purple-600 hover:text-purple-800 disabled:opacity-50"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Case Selection */}
          <div className="w-full sm:w-48">
            <select
              className="w-full bg-white text-black px-3 py-1 rounded text-sm sm:text-base outline-none h-[34px]"
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              disabled={!selectedPatient}
            >
              <option value="">Select Case</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.case_id} {c.case_reference_no ? `(${c.case_reference_no})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <X onClick={onClose} className="cursor-pointer hover:opacity-80" />
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
    </div >
  );
}
