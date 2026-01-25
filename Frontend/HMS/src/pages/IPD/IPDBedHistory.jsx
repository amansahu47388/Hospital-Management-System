import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { getIpdPatientDetail } from "../../api/ipdApi";
import { Loader2, Home } from "lucide-react";

export default function IPDBedHistory() {
  const { ipdId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bedHistory, setBedHistory] = useState([]);

  useEffect(() => {
    const fetchBedHistory = async () => {
      try {
        setLoading(true);
        const res = await getIpdPatientDetail(ipdId);
        const ipdData = res.data;

        // Current assigned bed
        if (ipdData.bed) {
          setBedHistory([
            {
              bed_group: ipdData.bed.bed_group || "N/A",
              bed_name: ipdData.bed.bed_name || "N/A",
              from_date: ipdData.admission_date || ipdData.created_at,
              to_date: ipdData.discharge_date || "",
              is_active: !ipdData.is_discharged,
            },
          ]);
        } else {
          setBedHistory([]);
        }
      } catch (error) {
        console.error("Error fetching bed history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ipdId) fetchBedHistory();
  }, [ipdId]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 pb-10">
        <IPDTabsNavbar />

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-4 flex items-center gap-3">
              <Home className="text-white" size={24} />
              <h2 className="text-white font-bold text-lg">Bed History</h2>
            </div>

            <div className="p-4 md:p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-[#6046B5] mb-4" size={40} />
                  <p className="text-gray-500 font-medium tracking-wide">Loading bed history...</p>
                </div>
              ) : bedHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 uppercase text-[10px] md:text-xs font-bold tracking-wider">
                        <th className="p-3 text-left border-b-2 border-gray-100">Bed Group</th>
                        <th className="p-3 text-left border-b-2 border-gray-100">Bed</th>
                        <th className="p-3 text-left border-b-2 border-gray-100">From Date</th>
                        <th className="p-3 text-left border-b-2 border-gray-100">To Date</th>
                        <th className="p-3 text-left border-b-2 border-gray-100">Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bedHistory.map((item, index) => (
                        <tr key={index} className="hover:bg-purple-50/30 transition-colors">
                          <td className="p-4 text-gray-700 font-medium">{item.bed_group}</td>
                          <td className="p-4">
                            <span className="bg-[#F3EEFF] text-[#6046B5] px-3 py-1.5 rounded-md font-bold border border-purple-100">
                              {item.bed_name}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(item.from_date).toLocaleDateString()} {new Date(item.from_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 text-gray-600 font-mono">
                            {item.to_date ? `${new Date(item.to_date).toLocaleDateString()} ${new Date(item.to_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "--"}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.is_active
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                              }`}>
                              {item.is_active ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Home size={48} className="mx-auto text-gray-300 mb-4 opacity-50" />
                  <p className="text-gray-500 font-semibold text-lg">No bed history information found</p>
                  <p className="text-gray-400 text-sm mt-1">This patient might not be assigned to a bed yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
