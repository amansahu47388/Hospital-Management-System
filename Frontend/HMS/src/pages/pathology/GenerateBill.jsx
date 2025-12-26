import { useState } from "react";
import BillHeader from "../../components/Pathology/BillHeader";
import TestRow from "../../components/Pathology/TestRow";
import { BillSummary } from "../../components/Pathology/BillSummary";
import { PaymentSection } from "../../components/Pathology/PaymentSection";
import { BillActions } from "../../components/Pathology/BillActions";
import AddPatient from "../../components/PatientComponent/AddPatient";
import usePathologyBill from "../../hooks/usePathologyBill";

export default function PathologyBill() {
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const {
    tests,
    addRow,
    removeRow,
    updateRow,

    applyTPA,
    setApplyTPA,

    total,
    discount,
    setDiscount,
    discountPercent,
    setDiscountPercent,
    taxAmount,
    netAmount,

    paymentMode,
    setPaymentMode,
    paidAmount,
    setPaidAmount,

    closePage
  } = usePathologyBill();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex flex-col">

      {/* ================= HEADER ================= */}
      <BillHeader
        applyTPA={applyTPA}
        setApplyTPA={setApplyTPA}
        onClose={closePage}
        onAddPatient={() => setOpenAddPatient(true)}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 bg-[#f3f3f3] px-3 md:px-6 py-4 overflow-auto">
        <div className="bg-white w-full rounded shadow">

          {/* BILL META INFO */}
          <div className="flex flex-wrap justify-between items-center border-b px-4 py-3 text-sm font-semibold text-gray-700">
            <div>
              Bill No <span className="font-bold ml-1">PATHOB617</span>
            </div>
            <div>Case ID</div>
            <div>
              Date <span className="ml-1">12/25/2025 09:46 AM</span>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-6 gap-3 px-4 py-2 text-sm font-semibold text-gray-600 border-b">
            <span>Test Name *</span>
            <span>Report Days</span>
            <span>Report Date *</span>
            <span>Tax</span>
            <span>Amount</span>
            <span></span>
          </div>

          {/* TEST ROWS */}
          <div className="px-4 py-3 space-y-3">
            {tests.map((row) => (
              <TestRow
                key={row.id}
                row={row}
                onChange={(field, value) =>
                  updateRow(row.id, field, value)
                }
                onRemove={() => removeRow(row.id)}
              />
            ))}

            <button
              onClick={addRow}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded text-sm"
            >
              + Add
            </button>
          </div>

          {/* LOWER SECTION */}
          <div className="grid md:grid-cols-2 gap-6 border-t p-4">

            {/* LEFT SIDE */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Referral Doctor</label>
                <select className="w-full border p-2 rounded">
                  <option>Select</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Doctor Name</label>
                <input className="w-full border p-2 rounded" />
              </div>

              <div>
                <label className="text-sm font-medium">Note</label>
                <textarea className="w-full border p-2 rounded h-24" />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Previous Report Value
                </label>
                <input className="w-full border p-2 rounded" />
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="space-y-3">
              <BillSummary
                total={total}
                discount={discount}
                setDiscount={setDiscount}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                taxAmount={taxAmount}
                netAmount={netAmount}
              />

              <PaymentSection
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                paidAmount={paidAmount}
                setPaidAmount={setPaidAmount}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 px-4 py-4 border-t bg-gray-50">
            <BillActions />
          </div>
        </div>
      </div>

      {/* ================= ADD PATIENT MODAL ================= */}
      {openAddPatient && (
        <AddPatient
          open={openAddPatient}
          onClose={() => setOpenAddPatient(false)}
        />
      )}
    </div>
  );
}
