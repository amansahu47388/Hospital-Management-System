import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getPathologyBills } from "../../../api/pathologyApi";
import { getRadiologyBills } from "../../../api/radiologyApi";
import { Eye, Loader2 } from "lucide-react";

export default function IPDLabInvestigation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (user?.patient_id) {
      fetchLabInvestigations();
    }
  }, [user]);

  const fetchLabInvestigations = async () => {
    try {
      setLoading(true);
      const [pathologyRes, radiologyRes] = await Promise.all([
        getPathologyBills("", user.patient_id),
        getRadiologyBills("", user.patient_id)
      ]);

      const labs = [
        ...(pathologyRes.data || []).flatMap(bill => (bill.items || []).map(item => ({
          ...item,
          lab: "Pathology",
          doctor: bill.doctor_name || "N/A",
          bill_date: bill.date,
          created_by: bill.created_by_name || "N/A",
          bill_id: bill.id
        }))),
        ...(radiologyRes.data || []).flatMap(bill => (bill.items || []).map(item => ({
          ...item,
          lab: "Radiology",
          doctor: bill.doctor_name || "N/A",
          bill_date: bill.date,
          created_by: bill.created_by_name || "N/A",
          bill_id: bill.id
        })))
      ];
      setData(labs);
    } catch (error) {
      console.error("Error fetching lab investigations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Lab Investigation</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              Total: {data.length}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6046B5]" size={40} />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No lab investigations found.</div>
          ) : (
            <>
              {/* TABLE – DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="p-4 text-left">Test</th>
                      <th className="text-left">Lab</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Approved By</th>
                      <th className="text-left">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="border-t hover:bg-indigo-50/40 transition">
                        <td className="p-4 font-medium text-gray-800">{row.test_name}</td>
                        <td>{row.lab}</td>
                        <td>{new Date(row.bill_date).toLocaleDateString()}</td>
                        <td>{row.created_by}</td>
                        <td>
                          <span className={`${row.report_date ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-1 text-xs rounded-full`}>
                            {row.report_date ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => {
                              setSelected(row);
                              setOpen(true);
                            }}
                            className="w-9 h-9 rounded-full bg-[#6046B5] text-white flex items-center justify-center hover:bg-[#4a3691] transition mx-auto"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARD – MOBILE */}
              <div className="md:hidden p-4 space-y-4">
                {data.map((row, i) => (
                  <div key={i} className="border-l-4 border-[#6046B5] rounded-xl p-4 shadow-sm bg-white border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm text-gray-800">{row.test_name}</h3>
                      <span className={`${row.report_date ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-1 text-xs rounded-full`}>
                        {row.report_date ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Lab: {row.lab}</p>
                    <p className="text-xs text-gray-500">Date: {new Date(row.bill_date).toLocaleDateString()}</p>
                    <button
                      onClick={() => {
                        setSelected(row);
                        setOpen(true);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-[#6046B5] text-white py-2 rounded-lg text-xs hover:bg-[#4a3691] transition"
                    >
                      <Eye size={16} /> View Report
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden bg-white shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-white">
              <h2 className="font-semibold text-lg">{selected.test_name} Report</h2>
              <button onClick={() => setOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white transition">✕</button>
            </div>

            {/* REPORT BODY */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Test Name</b>
                <p className="font-medium">{selected.test_name}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Status</b>
                <p className={`font-semibold ${selected.report_date ? 'text-green-600' : 'text-yellow-600'}`}>
                  {selected.report_date ? "Approved" : "Pending"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Bill Reference</b>
                <p className="font-medium">#BILL-{selected.bill_id}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Doctor</b>
                <p className="font-medium">{selected.doctor}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Bill Date</b>
                <p className="font-medium">{new Date(selected.bill_date).toLocaleDateString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Approved By</b>
                <p className="font-medium">{selected.created_by}</p>
              </div>
              {selected.report_date && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 md:col-span-2">
                  <b className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Report Date</b>
                  <p className="font-medium">{new Date(selected.report_date).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
              <button
                onClick={() => window.print()}
                className="bg-[#6046B5] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#4a3691] transition"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
