import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";
import { Eye, Pencil, X } from "lucide-react";

export default function IPDPaymentPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);

  const payment = {
    transactionId: "TRANID11758",
    date: "12/11/2025 03:57 PM",
    amount: "607.70",
    mode: "Cash",
    note: "no",
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        {/* IPD NAVBAR */}
        <IPDTabsNavbar />

        {/* PAGE */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Payment</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded hover:opacity-90"
              >
                + Add Payment
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Transaction ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Note</th>
                    <th className="p-3 text-left">Payment Mode</th>
                    <th className="p-3 text-right">Paid Amount ($)</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">{payment.transactionId}</td>
                    <td className="p-3">{payment.date}</td>
                    <td className="p-3">{payment.note}</td>
                    <td className="p-3">{payment.mode}</td>
                    <td className="p-3 text-right">{payment.amount}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button onClick={() => setShowView(true)}>
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button onClick={() => setShowAdd(true)}>
                        <Pencil size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TOTAL */}
            <div className="flex justify-end p-4 border-t bg-gray-100 font-semibold">
              Total : ${payment.amount}
            </div>
          </div>
        </div>

        {/* ================= ADD / EDIT PAYMENT MODAL ================= */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-lg overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Add Payment</h3>
                <button onClick={() => setShowAdd(false)}>
                  <X />
                </button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Date *</label>
                    <input className="border p-2 w-full rounded" />
                  </div>
                  <div>
                    <label className="text-sm">Amount ($) *</label>
                    <input className="border p-2 w-full rounded" defaultValue="0" />
                  </div>
                </div>

                <div>
                  <label className="text-sm">Payment Mode</label>
                  <select className="border p-2 w-full rounded">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>UPI</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">Note</label>
                  <textarea className="border p-2 w-full rounded" />
                </div>

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW PAYMENT MODAL ================= */}
        {showView && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-lg overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Payment Details</h3>
                <button onClick={() => setShowView(false)}>
                  <X />
                </button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Date</label>
                    <input
                      className="border p-2 w-full rounded"
                      defaultValue={payment.date}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Amount ($)</label>
                    <input
                      className="border p-2 w-full rounded"
                      defaultValue={payment.amount}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm">Payment Mode</label>
                  <select className="border p-2 w-full rounded">
                    <option selected>{payment.mode}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">Note</label>
                  <textarea
                    className="border p-2 w-full rounded"
                    defaultValue={payment.note}
                  />
                </div>

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
