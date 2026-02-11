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
      <div className="min-h-screen p-1 md:p-6">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Nurse Notes</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6046B5]" size={40} />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No nurse notes found.</div>
          ) : (
            /* Timeline */
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gray-300"></div>

              {notes.map((item, index) => (
                <div key={item.id} className="mb-8 relative">
                  {/* Date Badge */}
                  <div className="absolute -left-2 top-0">
                    <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-xs px-3 py-1 rounded-md shadow">
                      {item.formatted_date || new Date(item.date).toLocaleString()}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute left-[-10px] top-10 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-full p-2 shadow">
                    <FileText size={14} />
                  </div>

                  {/* Card */}
                  <div className="ml-8 bg-gray-50 border rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium mb-3">{item.nurse_name}</h4>

                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700">Note</p>
                      <p className="text-sm text-gray-600">{item.note}</p>
                    </div>

                    {item.comment && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Comment</p>
                        <p className="text-sm text-gray-600">{item.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
