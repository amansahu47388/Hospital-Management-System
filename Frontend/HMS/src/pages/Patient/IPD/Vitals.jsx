import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getPatientVitals } from "../../../api/patientApi";
import { Loader2 } from "lucide-react";

export default function Vitals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    if (user?.patient_id) {
      fetchVitals();
    }
  }, [user]);

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const res = await getPatientVitals(user.patient_id);
      setVitals(res.data || []);
    } catch (error) {
      console.error("Error fetching vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Vitals</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              Total Records: {vitals.length}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6046B5]" size={40} />
            </div>
          ) : vitals.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No vitals recorded yet.</div>
          ) : (
            <>
              {/* TABLE VIEW – DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-2 py-3 text-left">Date</th>
                      <th className="px-2 py-3 text-left">Height</th>
                      <th className="px-2 py-3 text-left">Weight</th>
                      <th className="px-2 py-3 text-left">Pulse</th>
                      <th className="px-2 py-3 text-left">Temperature</th>
                      <th className="px-2 py-3 text-left">BP</th>
                      <th className="px-2 py-3 text-left">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((v) => (
                      <tr key={v.id} className="border-t hover:bg-indigo-50/40 transition">
                        <td className="px-2 py-3 font-medium">{new Date(v.vital_date).toLocaleString()}</td>
                        <td className="px-2 py-3">{v.height ? `${v.height} cm` : "-"}</td>
                        <td className="px-2 py-3">{v.weight ? `${v.weight} kg` : "-"}</td>
                        <td className="px-2 py-3">{v.pulse ? `${v.pulse} bpm` : "-"}</td>
                        <td className="px-2 py-3">{v.temperature ? `${v.temperature} °F` : "-"}</td>
                        <td className="px-2 py-3">{v.systolic || v.diastolic ? `${v.systolic}/${v.diastolic}` : "-"}</td>
                        <td className="px-2 py-3">{v.bmi ? `${v.bmi}` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARD VIEW – MOBILE */}
              <div className="md:hidden p-4 space-y-4">
                {vitals.map((v) => (
                  <div key={v.id} className="border-l-4 border-[#6046B5] bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="font-semibold text-sm text-gray-800 mb-2">
                      {new Date(v.vital_date).toLocaleString()}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <p><b className="text-gray-400">Height:</b> {v.height ? `${v.height} cm` : "-"}</p>
                      <p><b className="text-gray-400">Weight:</b> {v.weight ? `${v.weight} kg` : "-"}</p>
                      <p><b className="text-gray-400">Pulse:</b> {v.pulse ? `${v.pulse} bpm` : "-"}</p>
                      <p><b className="text-gray-400">Temp:</b> {v.temperature ? `${v.temperature} °F` : "-"}</p>
                      <p><b className="text-gray-400">BP:</b> {v.systolic || v.diastolic ? `${v.systolic}/${v.diastolic}` : "-"}</p>
                      <p><b className="text-gray-400">BMI:</b> {v.bmi ? `${v.bmi}` : "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
