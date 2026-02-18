import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";

import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList, getNurseNotes } from "../../../api/ipdApi";
import { FileText, Loader2 } from "lucide-react";

export default function NurseNotes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user?.patient_id) {
      fetchNurseNotes();
    }
  }, [user]);

  const fetchNurseNotes = async () => {
    try {
      setLoading(true);
      const ipdRes = await getIpdPatientList({ patient_id: user.patient_id });
      if (ipdRes.data && ipdRes.data.length > 0) {
        const activeIpd = ipdRes.data[0];
        const notesRes = await getNurseNotes({ ipd_patient: activeIpd.ipd_id });
        setNotes(notesRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching nurse notes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <IPDHeaderNavbar />
      <div className="min-h-screen bg-gray-50/30">
        <div className="p-1 md:p-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Nurse Notes</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="text-purple-500 animate-spin" />
                <p className="text-gray-500 font-medium italic">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">No nurse notes recorded for this patient.</p>
              </div>
            ) : (
              /* TIMELINE */
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
                {notes.map((n) => (
                  <div key={n.id} className="relative pl-10 group transition-all">
                    {/* DOT */}
                    <div className="absolute left-2 top-2 w-4 h-4 bg-[#6046B5] rounded-full z-10 border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>

                    {/* DATE */}
                    <span className="inline-block mb-2 text-[10px] font-black bg-[#6046B5] text-white px-3 py-1 rounded shadow-sm">
                      {n.formatted_date || new Date(n.created_at).toLocaleString()}
                    </span>

                    {/* CARD */}
                    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-md transition-all group-hover:border-purple-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#6046B5] text-sm">
                            {n.nurse_name || "N/A"}
                          </h4>
                          <p className="text-sm text-gray-600 font-bold  mt-0.5">
                            Assigned Nurse
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm space-y-2">
                        <div className="flex gap-2">
                          <b className="w-16 shrink-0 text-gray-500 text-sm py-1">Note:</b>
                          <p className="text-gray-800 font-medium flex-grow leading-relaxed">{n.note}</p>
                        </div>
                        {n.comment && (
                          <div className="flex gap-2 bg-gray-50 p-2 rounded-md">
                            <b className="w-16 shrink-0 text-gray-500 text-sm py-1">Comment:</b>
                            <p className="text-gray-600 flex-grow italic text-xs">{n.comment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
