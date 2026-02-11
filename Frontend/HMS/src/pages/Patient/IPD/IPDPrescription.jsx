import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList, getPrescriptions } from "../../../api/ipdApi";
import { Eye, Printer, X, Loader2 } from "lucide-react";

export default function IPDPrescription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.patient_id) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const ipdRes = await getIpdPatientList({ patient_id: user.patient_id });
      if (ipdRes.data && ipdRes.data.length > 0) {
        const activeIpd = ipdRes.data[0];
        const prescRes = await getPrescriptions({ ipd_patient: activeIpd.ipd_id });
        setPrescriptions(prescRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <PatientLayout>
      <div className="min-h-screen">
        <IPDHeaderNavbar />

        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Prescription</h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#6046B5]" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Prescription No</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Finding</th>
                      <th className="px-3 py-3 text-left">Doctor</th>
                      <th className="px-3 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((p) => (
                      <tr key={p.id} className="align-top border-b hover:bg-gray-50">
                        <td className="px-3 py-3">PRES{p.id}</td>
                        <td className="px-3 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-3 py-3 max-w-xs">{p.finding_description || p.finding_name}</td>
                        <td className="px-3 py-3">{p.doctor_name || "N/A"}</td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => openModal(p)}
                            className="text-[#6046B5] hover:text-[#8A63D2]"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {prescriptions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-3 py-8 text-center text-gray-500">No prescriptions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && selectedPrescription && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2">
            <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-y-auto max-h-[95vh]">
              <div className="flex justify-between items-center bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-3">
                <h3 className="font-semibold">Prescription Detail</h3>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} title="Print">
                    <Printer size={18} />
                  </button>
                  <button onClick={closeModal}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 text-sm space-y-6">
                <div className="border-b pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Smart Hospital</h2>
                    <p className="text-gray-600">Health and Research Center</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">Prescription No: PRES{selectedPrescription.id}</p>
                    <p className="text-gray-500">Date: {new Date(selectedPrescription.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-500">Patient Name</p>
                    <p className="font-semibold text-base">{user.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Prescribed By</p>
                    <p className="font-semibold text-base">{selectedPrescription.doctor_name || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-2">Findings</h4>
                  <div className="bg-indigo-50 p-3 rounded border border-indigo-100 italic">
                    {selectedPrescription.finding_description || selectedPrescription.finding_name || "No findings recorded."}
                  </div>
                </div>

                {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-2">Medicines</h4>
                    <table className="min-w-full border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2 text-left">Medicine Name</th>
                          <th className="border px-3 py-2 text-left">Dosage</th>
                          <th className="border px-3 py-2 text-left">Interval</th>
                          <th className="border px-3 py-2 text-left">Duration</th>
                          <th className="border px-3 py-2 text-left">Instruction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrescription.medicines.map((m, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="border px-3 py-2">{m.medicine_name}</td>
                            <td className="border px-3 py-2">{m.dosage}</td>
                            <td className="border px-3 py-2">{m.interval_name}</td>
                            <td className="border px-3 py-2">{m.duration}</td>
                            <td className="border px-3 py-2">{m.instruction || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedPrescription.header_note && (
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-1">Header Note</h4>
                    <p className="text-gray-600">{selectedPrescription.header_note}</p>
                  </div>
                )}

                {selectedPrescription.footer_note && (
                  <div className="pt-2">
                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-1">Footer Note</h4>
                    <p className="text-gray-600">{selectedPrescription.footer_note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

