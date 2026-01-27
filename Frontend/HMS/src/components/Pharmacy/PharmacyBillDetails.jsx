import { X } from "lucide-react";

export default function PharmacyBillDetail({ bill, onClose }) {
  return (

 <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-5xl rounded shadow-lg overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-4 py-2 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="font-semibold text-lg">Pharmacy Bill</h2>
          <div className="flex gap-3">
            {/* <Printer className="cursor-pointer" onClick={printBill} /> */}
            <X onClick={onClose} className="cursor-pointer" />
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-4 text-sm print:p-0">

          {/* BILL INFO */}
          <div className="flex justify-between border-b pb-2 mb-3">
            <div>
              <div><b>Bill No:</b> {bill.id}</div>
            </div>
            <div>
              <b>Date:</b> {new Date(bill.bill_date || bill.created_at || Date.now()).toLocaleString()}
            </div>
          </div>

          {/* PATIENT / DOCTOR INFO */}
          <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-4">
            <div className="space-y-1">
              <div><b>Name:</b> {bill.patient_name}</div>
              <div><b>Doctor:</b> {bill.doctor_name}</div>
              <div><b>Prescription:</b> {bill.case_id || "-"}</div>
            </div>
            <div className="space-y-1 text-right">
              <div><b>Phone:</b> {bill.patient_phone || "-"}</div>
              <div><b>Case ID:</b> {bill.case_id || "-"}</div>
            </div>
          </div>

          {/* ================= MEDICINE TABLE ================= */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Medicine Name</th>
                <th className="text-left py-1">Batch No</th>
                <th className="text-left py-1">Expiry Date</th>
                <th className="text-center py-1">Quantity</th>
                <th className="text-center py-1">Tax</th>
                <th className="text-center py-1">Discount</th>
                <th className="text-right py-1">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((i, idx) => (
                <tr key={idx} className="">
                  <td className="py-1">{i.medicine_name}</td>
                  <td>{i.batch_no}</td>
                  <td>{i.expiry_date || "-"}</td>
                  <td className="text-center">{i.quantity}</td>
                  <td className="text-center">{i.tax_percentage}%</td>
                  <td className="text-center">{i.discount_percentage}%</td>
                  <td className="text-right">{Number(i.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= FOOTER ================= */}
          <div className="flex justify-between mt-4 pt-3">

            <div>
              <div><b>Collected By:</b> {bill.created_by_name}</div>
            </div>

            <div className="w-72 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total ($)</span>
                <span>{Number(bill.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount ($)</span>
                <span>{Number(bill.discount_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tax ($)</span>
                <span>{Number(bill.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Net Amount ($)</span>
                <span>{Number(bill.net_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid ($)</span>
                <span>{Number(bill.paid_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Due ($)</span>
                <span>{Number(bill.balance_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}