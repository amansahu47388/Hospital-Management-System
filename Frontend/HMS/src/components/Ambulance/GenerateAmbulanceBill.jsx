import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { createAmbulanceBill, getAmbulances } from "../../api/ambulanceApi";
import { getHospitalCharges } from "../../api/setupApi";
import { searchPatient, getMedicalCases } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";

export default function GenerateAmbulanceBill({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  /* ================= PATIENT ================= */
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  /* ================= DATA ================= */
  const [ambulances, setAmbulances] = useState([]);
  const [charges, setCharges] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");

  /* ================= SELECTION ================= */
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [selectedChargeCategory, setSelectedChargeCategory] = useState("");
  const [selectedCharge, setSelectedCharge] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");

  /* ================= BILL STATES ================= */
  const [totalAmount, setTotalAmount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  /* ================= CALCULATIONS ================= */
  const total = parseFloat(totalAmount) || 0;

  const discountValue =
    discountPercent !== ""
      ? (total * parseFloat(discountPercent)) / 100
      : 0;

  const taxValue =
    taxPercent !== "" ? (total * parseFloat(taxPercent)) / 100 : 0;

  const netAmount = total - discountValue + taxValue;

  const hasFetchedRef = useRef(false);

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (!open) {
      hasFetchedRef.current = false;
      setPatientSearch("");
      setSelectedPatient(null);
      setSelectedAmbulance("");
      setSelectedChargeCategory("");
      setSelectedCharge("");
      setNote("");
      setPaymentMode("cash");
      setTotalAmount("");
      setDiscountPercent("");
      setTaxPercent("");
      setPaymentAmount("");
      setCases([]);
      setSelectedCase("");
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    loadAmbulances();
    loadCharges(); // ✅ ONLY THIS
  }, [open]);

  useEffect(() => {
    if (selectedPatient) {
      getMedicalCases(selectedPatient.id)
        .then((res) => {
          setCases(res.data || []);
          setSelectedCase("");
        })
        .catch(() => setCases([]));
    } else {
      setCases([]);
      setSelectedCase("");
    }
  }, [selectedPatient]);


  /* ================= API ================= */
  const loadAmbulances = async () => {
    const res = await getAmbulances();
    setAmbulances(res.data || []);
  };

  const loadCharges = async () => {
    const res = await getHospitalCharges();
    setCharges(res.data || []);
  };


  const getChargeCategoriesFromCharges = () => {
    const categories = charges.map((c) => c.charge_category);
    return [...new Set(categories)];
  };



  const searchPatients = async (query) => {
    if (!query.trim()) {
      setPatients([]);
      setShowPatientDropdown(false);
      return;
    }
    const res = await searchPatient(query);
    setPatients(res.data || []);
    setShowPatientDropdown(true);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(
      `${patient.first_name} ${patient.last_name || ""}`.trim()
    );
    setShowPatientDropdown(false);
  };

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

  const getFilteredCharges = () => {
    if (!selectedChargeCategory) return [];
    return charges.filter(
      (c) => c.charge_category === selectedChargeCategory
    );
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!selectedPatient) return notify("error", "Select patient");
    if (!selectedAmbulance) return notify("error", "Select vehicle");
    if (!selectedChargeCategory) return notify("error", "Select charge category");
    if (!selectedCharge) return notify("error", "Select charge");
    if (!totalAmount) return notify("error", "Enter total amount");
    if (!paymentAmount) return notify("error", "Enter payment amount");

    try {
      setLoading(true);

      const billData = {
        patient: selectedPatient.id,
        case: selectedCase || null,
        ambulance: parseInt(selectedAmbulance),
        hospital_charge: parseInt(selectedCharge),
        date,
        note,
        payment_mode: paymentMode,
        total_amount: total,
        discount: discountValue,
        tax: taxValue,
        paid_amount: paymentAmount,
      };

      await createAmbulanceBill(billData);

      notify("success", "Ambulance bill created successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      notify("error", "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
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
                    searchPatients(e.target.value);
                  }}
                />
              </div>

              {showPatientDropdown && (
                <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 text-black">
                  {patients.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No patient found</div>
                  ) : (
                    patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handlePatientSelect(p)}
                        className="px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-[#F3EEFF] text-black"
                      >
                        <div className="flex flex-col">
                          <span>{p.first_name} {p.last_name}</span>
                          <span className="text-[10px] text-gray-400">{p.phone || "No phone"}</span>
                        </div>
                        <span className="text-xs text-gray-400">#{p.id}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Case Selection */}
            <div className="w-full sm:w-48">
              <select
                className="w-full bg-white text-black px-3 py-1 rounded text-sm sm:text-base outline-none h-[34px]"
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                disabled={!selectedPatient}
              >
                <option value="">Select Case ID</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.case_id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ml-auto">
            <X onClick={onClose} className="cursor-pointer hover:opacity-80" size={24} />
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 p-6 overflow-y-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ambulance</label>
              <select
                value={selectedAmbulance}
                onChange={(e) => setSelectedAmbulance(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Ambulance</option>
                {ambulances.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.vehicle_model} ({a.vehicle_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
              <input
                readOnly
                value={
                  ambulances.find(
                    (a) => a.id === parseInt(selectedAmbulance)
                  )?.driver_name || ""
                }
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Charge Category</label>
              <select
                value={selectedChargeCategory}
                onChange={(e) => {
                  setSelectedChargeCategory(e.target.value);
                  setSelectedCharge("");
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {getChargeCategoriesFromCharges().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>



            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Charge Name</label>
              <select
                value={selectedCharge}
                onChange={(e) => {
                  const chargeId = e.target.value;
                  setSelectedCharge(chargeId);
                  const chargeObj = charges.find(c => c.id === parseInt(chargeId));
                  if (chargeObj) {
                    setTotalAmount(chargeObj.charge_amount || "");
                    setTaxPercent(chargeObj.tax || "");
                  } else {
                    setTotalAmount("");
                    setTaxPercent("");
                  }
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Charge</option>
                {getFilteredCharges().map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.charge_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Charge ($)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* NOTE + BILL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional notes here..."
                className="w-full border rounded p-3"
              />
            </div>

            {/* BILL SUMMARY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Bill Summary</label>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-1">
                  <span>Total ($)</span>
                  <span className="font-semibold">
                    {total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span>Discount ($)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="%"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-14 border-b outline-none text-right"
                    />
                    <span className="font-semibold w-20 text-right">
                      {discountValue.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span>Tax ($)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Tax %"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(e.target.value)}
                      className="w-14 border-b outline-none text-right"
                    />
                    <span className="font-semibold w-20 text-right">
                      {taxValue.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span>Net Amount ($)</span>
                  <span className="font-semibold">
                    {netAmount.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="border px-3 py-2 rounded"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Payment Amount ($)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="border px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-3 bg-gray-100 border-t">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
