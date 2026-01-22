import { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Eye } from "lucide-react";

export default function Charges() {
  const [open, setOpen] = useState(false);
  const [charge, setCharge] = useState(null);

  const data = [
    {
      name: "Operation Service",
      qty: 5,
      standard: 132,
      applied: 660,
      tax: "10%",
      amount: 638.88,
    },
  ];

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6 ">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Charges</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Charge Name</th>
                  <th>Qty</th>
                  <th>Applied</th>
                  <th>Amount</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c, i) => (
                  <tr key={i} className="border-t hover:bg-indigo-50/40 transition">
                    <td className="p-4 font-medium text-gray-800">{c.name}</td>
                    <td>{c.qty}</td>
                    <td>{c.applied}</td>
                    <td>{c.amount}</td>
                    <td className="text-center">
                      <button
                        onClick={() => {
                          setCharge(c);
                          setOpen(true);
                        }}
                        className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 hover:scale-110 transition"
                        title="Show Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {open && charge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-6 rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-xl">Charge Details</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-white text-black p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Charge Name</p>
                <p className="font-medium">{charge.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{charge.qty}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Standard</p>
                <p className="font-medium">{charge.standard}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Applied</p>
                <p className="font-medium">{charge.applied}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Tax</p>
                <p className="font-medium">{charge.tax}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-indigo-600">{charge.amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
