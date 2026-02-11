import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getPatientCharges } from "../../../api/patientApi";
import { Eye, Loader2 } from "lucide-react";

export default function Charges() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [charge, setCharge] = useState(null);

  useEffect(() => {
    if (user?.patient_id) {
      fetchCharges();
    }
  }, [user]);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const res = await getPatientCharges(user.patient_id);
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching charges:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Charges</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              Total Records: {data.length}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6046B5]" size={40} />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No charges found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">Charge Name</th>
                    <th className="px-2 py-3 text-left">Charge Category</th>
                    <th className="px-2 py-3 text-left">Charge Type</th>
                    <th className="px-2 py-3 text-left">Date</th>
                    <th className="px-2 py-3 text-left">Standard Amount (₹)</th>
                    <th className="px-2 py-3 text-left">Discount (₹)</th>
                    <th className="px-2 py-3 text-left">Tax (₹)</th>
                    <th className="px-2 py-3 text-left">Amount (₹)</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-indigo-50/40 transition">
                      <td className="p-4 font-medium text-gray-800">{c.charge_name}</td>
                      <td className="px-2 py-3 text-left">{c.charge_category}</td>
                      <td className="px-2 py-3 text-left">{c.charge_type}</td>
                      <td className="px-2 py-3 text-left">{new Date(c.charge_date).toLocaleDateString()}</td>
                      <td className="px-2 py-3 text-left">{c.standard_charge}</td>
                      <td className="px-2 py-3 text-left">{c.discount}</td>
                      <td className="px-2 py-3 text-left">{c.tax}</td>
                      <td className="font-semibold text-[#6046B5]">{c.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {open && charge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-5 flex justify-between items-center text-white">
              <h2 className="font-semibold text-lg">Charge Detail View</h2>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Charge Category</p>
                <p className="font-medium">{charge.charge_category || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Type</p>
                <p className="font-medium text-indigo-600">{charge.charge_type}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm md:col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Charge Name</p>
                <p className="font-medium text-base">{charge.charge_name}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Date</p>
                <p className="font-medium">{new Date(charge.charge_date).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Standard Amount</p>
                <p className="font-medium">₹{charge.standard_charge}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm md:col-span-2 bg-indigo-50/30">
                <p className="text-[10px] uppercase tracking-wider text-indigo-400 mb-1">Final Total Amount</p>
                <p className="font-bold text-2xl text-[#6046B5]">₹{charge.amount}</p>
              </div>
              {charge.charge_note && (
                <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm md:col-span-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Note</p>
                  <p className="text-gray-600 italic">"{charge.charge_note}"</p>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-end bg-white border-t border-gray-100">
              <button onClick={() => window.print()} className="bg-[#6046B5] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#4a3691] transition">Print Bill</button>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
