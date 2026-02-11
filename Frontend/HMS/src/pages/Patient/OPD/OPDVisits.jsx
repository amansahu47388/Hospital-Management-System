import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import OPDHeaderNavbar from "../../../components/Patient_module/OPD/OPDHeader";
import { useAuth } from "../../../context/AuthContext";
import { getOpdPatientList } from "../../../api/opdApi";
import { Eye, X, Calendar, User, FileText, ClipboardList, Activity, DollarSign, Clock, ShieldCheck } from "lucide-react";

export default function OPDVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const patientId = user?.patient_id || user?.id;

  useEffect(() => {
    if (patientId) {
      fetchVisits();
    }
  }, [patientId]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await getOpdPatientList({ patient_id: patientId });
      setVisits(response.data);
    } catch (error) {
      console.error("❌ Error fetching visits:", error);
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
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  const handleOpenModal = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVisit(null);
  };

  return (
    <PatientLayout>
      <OPDHeaderNavbar />

      <div className="min-h-screen p-4 md:p-6 ">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Visits</h2>
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
                    <th className="p-4 text-left">OPD No</th>
                    <th className="p-4 text-left">Checkup ID</th>
                    <th className="p-4 text-left">Appointment Date</th>
                    <th className="p-4 text-left">Consultant Doctor</th>
                    <th className="p-4 text-left">Symptoms</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.length > 0 ? visits.map((d, i) => (
                    <tr key={i} className="border-t hover:bg-indigo-50/40 transition">
                      <td className="p-4 font-medium text-[#6046B5]">OPDN{d.opd_id}</td>
                      <td className="p-4">{d.checkup_id}</td>
                      <td className="p-4">{formatDate(d.appointment_date)}</td>
                      <td className="p-4 font-medium">{d.doctor_name}</td>
                      <td className="p-4">{d.symptom_details?.symptom_title || "N/A"}</td>
                      <td className="p-4 text-center">
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
                      <td colSpan="6" className="p-8 text-center text-gray-500 italic">No visit records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Visit Details Modal */}
      {isModalOpen && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#6046B5] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="p-2 bg-white/20 rounded-lg" size={40} />
                <div>
                  <h3 className="text-xl font-bold">Visit Details</h3>
                  <p className="text-sm text-indigo-100 italic">Checkup ID: {selectedVisit.checkup_id}</p>
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
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Core Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Appointment Date</p>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(selectedVisit.appointment_date, true)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Consultant Doctor</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedVisit.doctor_name || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Patient Condition */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-2">
                  Clinical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <Activity size={16} />
                      <span className="text-xs font-bold uppercase">Symptoms</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {selectedVisit.symptom_details?.symptom_title || "None recorded"}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                      <ClipboardList size={16} />
                      <span className="text-xs font-bold uppercase">Prev Medical Issues</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {selectedVisit.previous_medical_issue || "None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedVisit.casualty && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full border border-red-200">Casualty</span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full border border-gray-200">
                  {selectedVisit.old_patient ? "Re-visit" : "New Patient"}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full border border-indigo-200">
                  OPD #{selectedVisit.opd_id}
                </span>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                  <DollarSign className="text-green-400" size={20} />
                  <h4 className="text-sm font-bold uppercase tracking-widest">Billing Summary</h4>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className="text-lg font-bold">₹{parseFloat(selectedVisit.total_amount || 0).toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Discount</p>
                    <p className="text-lg font-bold text-orange-400">₹{parseFloat(selectedVisit.discount || 0).toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Paid Amount</p>
                    <p className="text-xl font-black text-green-400">₹{parseFloat(selectedVisit.paid_amount || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center bg-gray-800/50 p-3 rounded-xl">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Payment Mode</span>
                  <span className="text-xs font-bold uppercase bg-white/10 px-3 py-1 rounded-full">{selectedVisit.payment_mode || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center px-6">
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
                <Clock size={12} />
                ID: {selectedVisit.case_id || "No Case Linked"}
              </div>
              <button
                onClick={handleCloseModal}
                className="px-8 py-2.5 bg-[#6046B5] text-white rounded-xl font-bold hover:bg-[#4d3794] transition shadow-md"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
