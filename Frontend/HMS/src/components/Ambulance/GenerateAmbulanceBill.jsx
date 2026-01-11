import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { createAmbulanceBill, getAmbulances } from "../../api/ambulanceApi";
import { getHospitalCharges, getChargeCategories } from "../../api/setupApi";
import { searchPatient } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";

export default function GenerateAmbulanceBill({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const [ambulances, setAmbulances] = useState([]);
  const [charges, setCharges] = useState([]);
  const [chargeCategories, setChargeCategories] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [selectedChargeCategory, setSelectedChargeCategory] = useState("");
  const [selectedCharge, setSelectedCharge] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      hasFetchedRef.current = false;
      setPatientSearch("");
      setSelectedPatient(null);
      setSelectedAmbulance("");
      setSelectedChargeCategory("");
      setSelectedCharge("");
      setNote("");
      setPaymentMode("cash");
      setDate(new Date().toISOString().split('T')[0]);
      return;
    }
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    loadAmbulances();
    loadCharges();
    loadChargeCategories();
  }, [open]);

  const loadAmbulances = async () => {
    try {
      const res = await getAmbulances();
      setAmbulances(res.data || []);
    } catch (err) {
      console.error("Failed to load ambulances:", err);
    }
  };

  const loadCharges = async () => {
    try {
      const res = await getHospitalCharges();
      setCharges(res.data || []);
    } catch (err) {
      console.error("Failed to load charges:", err);
    }
  };

  const loadChargeCategories = async () => {
    try {
      const res = await getChargeCategories();
      setChargeCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load charge categories:", err);
    }
  };

  const searchPatients = async (query) => {
    if (!query.trim()) {
      setPatients([]);
      setShowPatientDropdown(false);
      return;
    }

    try {
      const res = await searchPatient(query);
      setPatients(res.data || []);
      setShowPatientDropdown(true);
    } catch (err) {
      console.error("Failed to search patients:", err);
      setPatients([]);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.first_name} ${patient.last_name || ''}`.trim());
    setShowPatientDropdown(false);
  };

  const getSelectedCharge = () => {
    return charges.find(charge => charge.id === parseInt(selectedCharge));
  };

  const getFilteredCharges = () => {
    if (!selectedChargeCategory) {
      return [];
    }
    return charges.filter(charge => charge.charge_category === selectedChargeCategory);
  };

  const calculateTotals = () => {
    const charge = getSelectedCharge();
    if (!charge) return { total: 0, discount: 0, tax: 0, net: 0 };

    const total = parseFloat(charge.charge_amount) || 0;
    const discount = 0; // Could add discount input
    const tax = parseFloat(charge.tax) || 0;
    const net = total - discount + tax;

    return { total, discount, tax, net };
  };

  const handleSave = async () => {
    // Detailed validation with specific error messages
    if (!selectedPatient || !selectedPatient.id) {
      notify("error", "Please select a patient");
      return;
    }
    if (!selectedAmbulance || selectedAmbulance === "" || selectedAmbulance === "0") {
      notify("error", "Please select a vehicle model");
      return;
    }
    if (!selectedChargeCategory || selectedChargeCategory === "") {
      notify("error", "Please select a charge category");
      return;
    }
    if (!selectedCharge || selectedCharge === "" || selectedCharge === "0") {
      notify("error", "Please select a charge name");
      return;
    }
    if (!date || date === "") {
      notify("error", "Please select a date");
      return;
    }

    const charge = getSelectedCharge();
    if (!charge) {
      notify("error", "Invalid charge selected. Please select a valid charge.");
      return;
    }

    try {
      setLoading(true);
      const { total, discount, tax, net } = calculateTotals();
      
      // Ensure all IDs are properly converted to integers
      const ambulanceId = parseInt(selectedAmbulance);
      const hospitalChargeId = parseInt(selectedCharge);
      
      if (isNaN(ambulanceId)) {
        notify("error", "Invalid ambulance selected");
        return;
      }
      if (isNaN(hospitalChargeId)) {
        notify("error", "Invalid charge selected");
        return;
      }
      
      const billData = {
        patient: selectedPatient.id,
        ambulance: ambulanceId,
        hospital_charge: hospitalChargeId, // Using hospital_charge from setup module
        date: date,
        note: note || "",
        payment_mode: paymentMode,
        total_amount: total,
        discount: discount,
        tax: tax,
        paid_amount: net, // Assuming full payment
      };

      console.log("Submitting bill data:", billData); // Debug log
      
      await createAmbulanceBill(billData);
      notify("success", "Ambulance bill created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating bill:", error); // Debug log
      console.error("Error response:", error?.response?.data); // Debug log
      
      // Extract error message from response
      let errorMessage = "Failed to create bill";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        // Check for validation errors
        if (errorData.errors) {
          const errorKeys = Object.keys(errorData.errors);
          if (errorKeys.length > 0) {
            const firstError = errorData.errors[errorKeys[0]];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      notify("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { total, discount, tax, net } = calculateTotals();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      
      {/* MODAL */}
      <div className="w-[98%]  max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER (MATCH IMAGE + GRADIENT) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <div className="relative w-[35%]">
            <input
              type="text"
              placeholder="Search Patient"
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                searchPatients(e.target.value);
              }}
              className="w-full px-3 py-2 rounded text-sm text-black"
            />
            {showPatientDropdown && patients.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg max-h-48 overflow-y-auto z-10">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  >
                    {patient.first_name} {patient.last_name} - {patient.phone}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <input
              placeholder="Case ID"
              value={selectedPatient?.id || ""}
              readOnly
              className="w-full px-3 py-2 rounded text-sm text-black bg-gray-100"
            />
          </div>

          <button
            onClick={onClose}
            className="ml-2 hover:bg-white/20 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle Model *</label>
              <select
                value={selectedAmbulance}
                onChange={(e) => setSelectedAmbulance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
              >
                <option value="">Select Ambulance</option>
                {ambulances.map((ambulance) => (
                  <option key={ambulance.id} value={ambulance.id}>
                    {ambulance.vehicle_model} ({ambulance.vehicle_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Driver Name</label>
              <input
                value={ambulances.find(a => a.id === parseInt(selectedAmbulance))?.driver_name || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Charge Category *</label>
              <select
                value={selectedChargeCategory}
                onChange={(e) => {
                  setSelectedChargeCategory(e.target.value);
                  setSelectedCharge(""); // Reset charge selection when category changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
              >
                <option value="">Select Category</option>
                {chargeCategories.map((category) => (
                  <option key={category.id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Charge Name *</label>
              <select
                value={selectedCharge}
                onChange={(e) => setSelectedCharge(e.target.value)}
                disabled={!selectedChargeCategory}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Charge</option>
                {getFilteredCharges().map((charge) => (
                  <option key={charge.id} value={charge.id}>
                    {charge.charge_name} - ${charge.charge_amount}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Standard Charge ($) *</label>
              <input
                type="number"
                value={getSelectedCharge()?.charge_amount || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* NOTE + BILL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">

            {/* NOTE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Note</label>
              <textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent resize-none"
              />
            </div>

            {/* BILL SUMMARY (MATCH IMAGE RIGHT SIDE) */}
            <div className="space-y-3">
              {[
                ["Total ($)", total.toFixed(2)],
                ["Discount ($)", discount.toFixed(2)],
                ["Tax ($)", tax.toFixed(2)],
                ["Net Amount ($)", net.toFixed(2)],
              ].map(([left, right]) => (
                <div
                  key={left}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span className="text-sm">{left}</span>
                  <span className="font-semibold text-gray-400">
                    {right}
                  </span>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 mt-3">
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>

                <input
                  type="number"
                  placeholder="Payment Amount ($)"
                  value={net.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (MATCH IMAGE BUTTONS) */}
        <div className="flex justify-end gap-3 px-6 py-3 bg-gray-100 border-t">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "💾 Save & Print"}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "✔ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
