import { useState } from "react";
import usePharmacyBill from "../../hooks/usePharmacyBill";

import MedicineRow from "../../components/Pharmacy/MedicineRow";
import { BillSummary } from "../../components/Pharmacy/BillSummary";
import { PaymentSection } from "../../components/Pharmacy/PaymentSection";
import { ActionButtons } from "../../components/Pharmacy/ActionButtons";
import BillHeader from "../../components/Pathology/BillHeader";
import AddPatient from "../../components/PatientComponent/AddPatient";
export default function PharmacyGenerateBill() {
  const {
    rows,
    addRow,
    removeRow,
    updateRow,
    total,
    paymentMode,
    setPaymentMode,
    paymentAmount,
    setPaymentAmount
  } = usePharmacyBill();

  // ✅ HEADER-RELATED STATE
  const [applyTPA, setApplyTPA] = useState(false);
  //const [openAddPatient, setOpenAddPatient] = useState(false);
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const closePage = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen ">

      {/* ================= BILL HEADER ================= */}
      <BillHeader
        title="Pharmacy Bill"
        applyTPA={applyTPA}
        setApplyTPA={setApplyTPA}
        onClose={closePage}
        onAddPatient={() => setOpenAddPatient(true)}
        showPrescription={true}
        showTPA={true}
      />

      {/* ================= PAGE BODY ================= */}
      <div className="p-4">

        <div className="bg-white rounded shadow p-4">

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-10 gap-2 text-sm font-semibold border-b pb-2">
            <span>Medicine Category *</span>
            <span>Medicine Name *</span>
            <span>Batch No *</span>
            <span>Expiry Date *</span>
            <span>Qty</span>
            <span>Sale Price *</span>
            <span>Tax %</span>
            <span>Discount %</span>
            <span>Amount *</span>
            <span></span>
          </div>

          {/* ROWS */}
          <div className="space-y-2 mt-2">
            {rows.map((row) => (
              <MedicineRow
                key={row.id}
                row={row}
                onChange={(field, value) =>
                  updateRow(row.id, field, value)
                }
                onRemove={() => removeRow(row.id)}
              />
            ))}
          </div>

          {/* ADD ROW BUTTON */}
          <button
            onClick={addRow}
            className="mt-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded"
          >
            + Add
          </button>

          {/* LOWER SECTION */}
          <div className="grid md:grid-cols-2 gap-6 border-t mt-6 pt-4">

            {/* LEFT SIDE */}
            <div>
              <label className="text-sm font-medium">Hospital Doctor</label>
              <select className="border p-2 rounded w-full">
                <option>Select</option>
              </select>

              <label className="block mt-3 text-sm font-medium">
                Note
              </label>
              <textarea className="border p-2 rounded w-full h-24" />
            </div>

            {/* RIGHT SIDE */}
            <div>
              <BillSummary total={total} />

              <PaymentSection
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                paymentAmount={paymentAmount}
                setPaymentAmount={setPaymentAmount}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end mt-6">
            <ActionButtons />
          </div>
        </div>
      </div>

      {/* OPTIONAL: Add Patient Modal */}
      {openAddPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-4xl p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold text-lg">Add Patient</h2>
              <button
                onClick={() => setOpenAddPatient(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* Your AddPatient component can go here */}
            <div className="p-4 text-gray-500">
              Add Patient Form Here
            </div>
          </div>
        </div>



      )}

      {openAddPatient && (
  <AddPatient
    open={openAddPatient}
    onClose={() => setOpenAddPatient(false)}
  />
)}

    </div>
  );
}
