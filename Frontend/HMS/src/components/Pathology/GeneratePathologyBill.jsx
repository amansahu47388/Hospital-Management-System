import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";
import { createPathologyBill, getPathologyTests, searchPrescription } from "../../api/pathologyApi";
import { searchPatient } from "../../api/patientApi";
import { getDoctors } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";
import AddPatient from "../../components/PatientComponent/AddPatient";


export default function GeneratePathologyBill({ open, onClose }) {
  if (!open) return null;

  /* ================= STATES ================= */
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [testsList, setTestsList] = useState([]); // ALWAYS ARRAY
  const [tests, setTests] = useState([{ id: Date.now(), testId: "" }]);

  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [note, setNote] = useState("");
  const [previousReportValue, setPreviousReportValue] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [loading, setLoading] = useState(false);
  const hasFetchedTestsRef = useRef(false);
  const hasFetchedDoctorsRef = useRef(false);
  const notify = useNotify();



  /* ================= LOAD TESTS ================= */
useEffect(() => {
  if (hasFetchedTestsRef.current) return;
  hasFetchedTestsRef.current = true;

  getPathologyTests()
    .then((res) => {
      const data = Array.isArray(res)
        ? res
        : res?.results || res?.data || [];
      setTestsList(data);
    })
    .catch(() => setTestsList([]));
}, []);


  /* ================= LOAD DOCTORS ================= */
useEffect(() => {
  if (hasFetchedDoctorsRef.current) return;
  hasFetchedDoctorsRef.current = true;

  getDoctors()
    .then((res) => {
      const data = Array.isArray(res?.data)
        ? res.data
        : res?.data?.results || res?.results || [];
      setDoctors(data);
    })
    .catch(() => setDoctors([]));
}, []);


  /* ================= PATIENT SEARCH ================= */
  useEffect(() => {
    if (!patientSearch) {
      setPatients([]);
      setShowPatientDropdown(false);
      setPatientLoading(false);
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
        setShowPatientDropdown(true); // show so user sees "No patient found"
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


  /* ================= SAFE FIND ================= */
  const findTestById = (id) => {
    if (!Array.isArray(testsList)) return null;
    return testsList.find((t) => t.id === Number(id)) || null;
  };

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(() => {
    return tests.reduce((sum, row) => {
      const test = findTestById(row.testId);
      return sum + (test ? Number(test.standard_charge) : 0);
    }, 0);
  }, [tests, testsList]);

  const taxAmount = useMemo(() => {
    return tests.reduce((sum, row) => {
      const test = findTestById(row.testId);
      return (
        sum +
        (test
          ? (Number(test.standard_charge) * Number(test.tax)) / 100
          : 0)
      );
    }, 0);
  }, [tests, testsList]);

  // Calculate discount amount if percentage is provided
  const discountAmount = useMemo(() => {
    if (discountPercent) {
      return (subtotal * Number(discountPercent)) / 100;
    }
    return Number(discount || 0);
  }, [discount, discountPercent, subtotal]);

  const netAmount = subtotal + taxAmount - discountAmount;

  /* ================= ROW HANDLERS ================= */
  const addRow = () =>
    setTests([...tests, { id: Date.now(), testId: "" }]);

  const removeRow = (id) => {
    if (tests.length === 1) return;
    setTests(tests.filter((r) => r.id !== id));
  };

  const updateRow = (id, value) => {
    setTests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, testId: value } : r
      )
    );
  };

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
        // If prescription has patient info, set it
        if (data.patient_id && !selectedPatient) {
          // Optionally auto-select patient if available
        }
      }
    } catch (err) {
      notify("error", "Prescription not found");
      setSelectedPrescription(null);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSave = async () => {
    if (!selectedPatient) {
      notify("warning", "Please select a patient");
      return;
    }

    if (!paidAmount) {
      notify("warning", "Paid amount is required");
      return;
    }

    const payload = {
      patient_id: selectedPatient.id,
      doctor_id: selectedDoctor ? Number(selectedDoctor) : null,
      prescription_id: selectedPrescription?.id || null,
      note: note || "",
      previous_report_value: previousReportValue,
      payment_mode: paymentMode || "cash",
      discount: discountAmount,
      paid_amount: Number(paidAmount),
      tests: tests
        .filter((t) => t.testId)
        .map((t) => ({ test_id: Number(t.testId) })),
    };

    if (!payload.tests.length) {
      notify("warning", "Please select at least one test");
      return;
    }

    try {
      setLoading(true);
      const res = await createPathologyBill(payload);
      const data = res?.data || res;
      notify("success",`Bill created successfully (Bill No: ${data.bill_no || data.bill_id})`);
      // Reset form
      setSelectedPatient(null);
      setSelectedPrescription(null);
      setSelectedDoctor("");
      setTests([{ id: Date.now(), testId: "" }]);
      setDiscount(0);
      setDiscountPercent("");
      setPaidAmount("");
      setNote("");
      setPreviousReportValue(false);
      setPaymentMode("cash");
      onClose();
    } catch (err) {
  const errorMsg =
    err?.response?.data?.errors
      ? Object.values(err.response.data.errors).flat().join(", ")
      : err?.response?.data?.error
      || err?.message
      || "Failed to create pathology bill";

  notify("error", errorMsg);
}};

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".patient-search")) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
        <div className="flex items-center gap-3 justify-between">
          <div className="relative w-full max-w-md patient-search flex gap-4">
            <input
              type="text"
              placeholder="Search patient by name or phone"
              value={
                selectedPatient
                  ? selectedPatient.full_name || selectedPatient.name
                  : patientSearch
              }
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setSelectedPatient(null);
                setShowPatientDropdown(true);
              }}
              className="w-full px-3 py-2 bg-white rounded text-black"
            />

            {showPatientDropdown && !selectedPatient && (
              <div className="absolute z-30  w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {patientLoading ? "Searching..." : "No patient found"}
                  </div>
                ) : (
                  filteredPatients.map((patient) => {
                    const fullName = patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
                    const contact = patient.phone || patient.mobile || patient.contact || `#${patient.id}`;
                    return (
                      <div
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient({ ...patient, full_name: fullName });
                          setShowPatientDropdown(false);
                          setPatientSearch("");
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm flex gap-4"
                      >
                        <div className="font-medium text-black">{fullName || `#${patient.id}`}</div>
                        <div className="text-xs text-black">{contact}</div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <div className="flex items-center min-w-[220px]">
              <input 
                className="px-3 py-2 rounded text-black w-full bg-white" 
                placeholder="Search by prescription Id"
                value={prescriptionSearch}
                onChange={(e) => setPrescriptionSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePrescriptionSearch()}
              />
              <button 
                className="bg-gray-100 p-2 h-10"
                onClick={handlePrescriptionSearch}
                disabled={prescriptionLoading}
              >
                <Search size={18} />
              </button>
            </div>
            {selectedPrescription && (
              <div className="text-xs bg-white px-2 py-1 rounded text-black">
                Prescription #{selectedPrescription.id} found
              </div>
            )}
          </div>

            {/* RIGHT ACTIONS */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="bg-white text-[#6046B5]
                          px-4 py-2 text-sm rounded
                          flex items-center gap-2
                          shadow-sm hover:bg-gray-100"
              >
                <Plus size={14} /> New Patient
              </button>

              <X
                onClick={onClose}
                className="text-white cursor-pointer hover:opacity-80"
              />
            </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 bg-[#f3f3f3] flex-1 overflow-y-auto">
        <div className="bg-white rounded shadow">
          <div className="grid grid-cols-6 gap-3 px-4 py-2  text-sm font-semibold">
            <span className="font-bold">Test Name</span>
            <span className="font-bold">Report Days</span>
            <span className="font-bold">Report Date</span>
            <span className="font-bold">Tax</span>
            <span className="font-bold">Amount</span>
          </div>

          <div className="px-4 py-3 space-y-3">
            {tests.map((row) => {
              const test = findTestById(row.testId);
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-6 gap-3 items-center"
                >
                  <select
                    className="border p-2 rounded"
                    value={row.testId}
                    onChange={(e) =>
                      updateRow(row.id, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {testsList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.test_name}
                      </option>
                    ))}
                  </select>

                  <input
                    className="border p-2 rounded"
                    value={test ? `${test.report_days} days` : ""}
                    disabled
                  />
                  <input
                    className="border p-2 rounded"
                    value={
                      test && test.report_days
                        ? new Date(Date.now() + test.report_days * 24 * 60 * 60 * 1000).toLocaleDateString()
                        : ""
                    }
                    disabled
                  />
                  <input
                    className="border p-2 rounded"
                    value={test?.tax ?? ""}
                    disabled
                  />
                  <input
                    className="border p-2 rounded"
                    value={test?.standard_charge ?? ""}
                    disabled
                  />

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

          <div className="flex justify-end px-4 py-4 border-t bg-gray-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      <AddPatient open={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
    </div>
  );
}
