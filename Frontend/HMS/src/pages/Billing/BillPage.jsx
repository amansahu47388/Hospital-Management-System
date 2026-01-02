import { useState } from "react";
import BillHeader from "../../components/Pathology/BillHeader";
import TestRow from "../../components/Pathology/TestRow";
import { BillSummary } from "../../components/Pathology/BillSummary";
import { PaymentSection } from "../../components/Pathology/PaymentSection";
import { BillActions } from "../../components/Pathology/BillActions";
import AddPatient from "../../components/PatientComponent/AddPatient";
import useBill from "../../hooks/useBill";
import { useNavigate } from "react-router-dom";
export default function BillPage({ type }) {
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const navigate = useNavigate();
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
    closePage,
   
  } = useBill(type);
  const handleClose = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex flex-col">

      <BillHeader
        title={type === "radiology" ? "Radiology Bill" : "Pathology Bill"}
        applyTPA={applyTPA}
        setApplyTPA={setApplyTPA}
        onClose={handleClose}
        onAddPatient={() => setOpenAddPatient(true)}
      />

      <div className="flex-1 bg-[#f3f3f3] px-3 md:px-6 py-4 overflow-auto">
        <div className="bg-white w-full rounded shadow">
          
          {/* META */}
          <div className="flex flex-wrap justify-between items-center border-b px-4 py-3 text-sm font-semibold text-gray-700">
            <div>
              Bill No <span className="font-bold ml-1">
                {type === "radiology" ? "RAD" : "PATH"}-001
              </span>
            </div>
            <div>Case ID</div>
            <div>Date {new Date().toLocaleString()}</div>
          </div>

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-6 gap-3 px-4 py-2 text-sm font-semibold text-gray-600 border-b">
            <span>{type === "radiology" ? "Test / Scan" : "Test Name"} *</span>
            <span>Report Days</span>
            <span>Report Date *</span>
            <span>Tax</span>
            <span>Amount</span>
            <span></span>
          </div>

          {/* ROWS */}
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

          {/* LOWER */}
          <div className="grid md:grid-cols-2 gap-6 border-t p-4">
            <div className="space-y-4">
              <label className="text-sm font-medium">Referral Doctor</label>
              <input className="w-full border p-2 rounded" />

              <label className="text-sm font-medium">Doctor Name</label>
              <input className="w-full border p-2 rounded" />

              <label className="text-sm font-medium">Note</label>
              <textarea className="w-full border p-2 rounded h-24" />
            </div>

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

          <div className="flex justify-end gap-3 px-4 py-4 border-t bg-gray-50">
            <BillActions />
          </div>
        </div>
      </div>

      {openAddPatient && (
        <AddPatient
          open={openAddPatient}
          onClose={() => setOpenAddPatient(false)}
        />
      )}

      
    </div>
  );
}
