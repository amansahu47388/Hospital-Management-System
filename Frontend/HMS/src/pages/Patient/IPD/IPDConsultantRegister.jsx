import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getPatientConsultants } from "../../../api/patientApi";
import { Search, Loader2 } from "lucide-react";

export default function IPDConsultantRegister() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    if (user?.patient_id) {
      fetchConsultants();
    }
  }, [user]);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const res = await getPatientConsultants(user.patient_id);
      setConsultants(res.data || []);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen">
        <IPDHeaderNavbar />

        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Consultant Register</h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#6046B5]" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Applied Date</th>
                      <th className="px-3 py-2 text-left">Consultant Doctor</th>
                      <th className="px-3 py-2 text-left">Instruction</th>
                      <th className="px-3 py-2 text-left">Consultant Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultants.map((c) => (
                      <tr key={c.id} className="align-top border-b hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          {new Date(c.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-3">{c.doctor_name || "N/A"}</td>
                        <td className="px-3 py-3">{c.instruction}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {new Date(c.consultant_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {consultants.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-3 py-8 text-center text-gray-500">No consultant records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
