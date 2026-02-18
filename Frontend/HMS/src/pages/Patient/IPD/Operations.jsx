import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getPatientOperations } from "../../../api/patientApi";
import { Eye, X, Calendar, User, Activity, ClipboardList, Scissors } from "lucide-react";

export default function Operations() {
  const { user } = useAuth();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const patientId = user?.patient_id || user?.id;

  useEffect(() => {
    if (patientId) {
      fetchOperations();
    }
  }, [patientId]);

  const fetchOperations = async () => {
    setLoading(true);
    try {
      const response = await getPatientOperations(patientId);
      setOperations(response.data);
    } catch (error) {
      console.error("❌ Error fetching operations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "N/A";
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleOpenModal = (operation) => {
    setSelectedOperation(operation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOperation(null);
  };

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-4  flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Operations</h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6046B5]"></div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Reference No</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Operation</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">OT Technician</th>
                    <th className="px-3 py-2 text-left">Anesthesia</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.length > 0 ? operations.map((d, i) => (
                    <tr key={i} className="border-b border-gray-200  hover:bg-indigo-50/40 transition">
                      <td className="px-3 py-2 font-medium text-[#6046B5]">OTREF{d.id}</td>
                      <td className="px-3 py-2">{formatDate(d.operation_date)}</td>
                      <td className="px-3 py-2">{d.operation_name}</td>
                      <td className="px-3 py-2">{d.operation_type}</td>
                      <td className="px-3 py-2">{d.ot_technician}</td>
                      <td className="px-3 py-2">{d.anesthesia_type}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleOpenModal(d)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500 italic">No operation records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Operation Details Modal */}
      {isModalOpen && selectedOperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#6046B5] px-3 py-2 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Scissors className="p-2 bg-white/20 rounded-lg" size={40} />
                <div>
                  <h3 className="text-xl font-bold">Operation Details</h3>
                  <p className="text-sm text-indigo-100 italic">Ref: OTREF{selectedOperation.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date</p>
                      <p className="font-semibold text-gray-800">{formatDate(selectedOperation.operation_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Activity className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Operation Name</p>
                      <p className="font-semibold text-gray-800">{selectedOperation.operation_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Scissors className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Operation Type</p>
                      <p className="font-semibold text-gray-800">{selectedOperation.operation_type}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Doctor</p>
                      <p className="font-semibold text-gray-800">{selectedOperation.doctor_name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <ClipboardList className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">OT Technician</p>
                      <p className="font-semibold text-gray-800">{selectedOperation.ot_technician || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Activity className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Anesthesia Type</p>
                      <p className="font-semibold text-gray-800">{selectedOperation.anesthesia_type || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Details */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-indigo-600 pl-2">Medical Staff</h4>
                <div className="grid grid-cols-2 gap-4 text-sm bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div>
                    <p className="text-xs text-gray-500">Assistant Consultant 1</p>
                    <p className="font-medium text-gray-800">{selectedOperation.assistant_consultant_1 || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assistant Consultant 2</p>
                    <p className="font-medium text-gray-800">{selectedOperation.assistant_consultant_2 || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">OT Assistant</p>
                    <p className="font-medium text-gray-800">{selectedOperation.ot_assistant || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Anesthetist</p>
                    <p className="font-medium text-gray-800">{selectedOperation.anesthetist || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Remark and Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-orange-800 mb-2">Remarks</h4>
                  <p className="text-gray-700 leading-relaxed italic">
                    {selectedOperation.remark || "No remarks available."}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">Operation Result</h4>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {selectedOperation.result || "Ongoing / Pending report."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-3 py-2 bg-[#6046B5] text-white rounded font-semibold hover:bg-[#4d3794] transition shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
