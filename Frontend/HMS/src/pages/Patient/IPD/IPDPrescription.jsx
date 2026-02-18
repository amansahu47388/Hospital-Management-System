import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList, getPrescriptions } from "../../../api/ipdApi";
import { getHeaders } from "../../../api/setupApi";
import { printReport } from "../../../utils/printUtils";
import { Eye, Printer, X, Loader2 } from "lucide-react";

export default function IPDPrescription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    if (user?.patient_id) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const [ipdRes, headerRes] = await Promise.all([
        getIpdPatientList({ patient_id: user.patient_id }),
        getHeaders()
      ]);

      if (headerRes.data && headerRes.data.length > 0) {
        setHeaderData(headerRes.data[0]);
      }

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

  const handlePrint = () => {
    if (!selectedPrescription) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">IPD PRESCRIPTION</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>No: PRE-${selectedPrescription.id}</div>
            <div>Date: ${new Date(selectedPrescription.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${user.full_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Gender</span><span class="data-value">: ${user.gender || "—"}</span></div>
          <div class="data-item"><span class="data-label">Phone</span><span class="data-value">: ${user.phone || "—"}</span></div>
          <div class="data-item"><span class="data-label">Hospital ID</span><span class="data-value">: ${user.patient_id || "—"}</span></div>
          <div class="data-item"><span class="data-label">Prescribed By</span><span class="data-value">: ${selectedPrescription.prescribed_by_details?.name || selectedPrescription.doctor_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Consultant</span><span class="data-value">: ${selectedPrescription.consultant_doctor_details?.name || "—"}</span></div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
          <div>
            <div class="report-section-title">Findings</div>
            <div style="padding:10px; border:1px solid #eee; border-radius:5px;">
              <div style="font-weight:bold;">${selectedPrescription.finding_name || "N/A"}</div>
              <div style="font-style:italic; font-size:12px; color:#666;">${selectedPrescription.finding_description || ""}</div>
            </div>
          </div>
          <div>
            <div class="report-section-title">Symptoms</div>
            <p style="font-size:13px; line-height:1.5; margin:0;">${selectedPrescription.symptoms_text || "None recorded."}</p>
          </div>
        </div>

        <div class="report-section-title">Medicines</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Interval</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${selectedPrescription.medicines?.map((med, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${med.category_name || "—"}</td>
                <td style="font-weight:bold;">${med.medicine_name || "—"}</td>
                <td>${med.dosage_name || med.dosage || "—"}</td>
                <td>${med.interval_name || "—"}</td>
                <td>${med.duration_name || med.duration || "—"}</td>
              </tr>
            `).join("") || '<tr><td colspan="6" style="text-align: center;">No medicines prescribed.</td></tr>'}
          </tbody>
        </table>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
          <div>
            <div class="report-section-title">Pathology Tests</div>
            <ul style="padding-left:20px; font-size:12px; margin:0;">
              ${selectedPrescription.pathology_details?.map(t => `<li style="margin-bottom:4px;">${t.test_name}</li>`).join("") || "<li>None</li>"}
            </ul>
          </div>
          <div>
            <div class="report-section-title">Radiology Tests</div>
            <ul style="padding-left:20px; font-size:12px; margin:0;">
              ${selectedPrescription.radiology_details?.map(t => `<li style="margin-bottom:4px;">${t.test_name}</li>`).join("") || "<li>None</li>"}
            </ul>
          </div>
        </div>
    `;

    printReport({
      title: `Prescription - PRE-${selectedPrescription.id}`,
      headerImg: headerData?.ipd_prescription_header,
      footerText: headerData?.ipd_prescription_footer,
      content: content
    });
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50/30">
        <IPDHeaderNavbar />

        <div className="max-w-[1600px] mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Prescription</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="text-[#6046B5] animate-spin" />
                <p className="text-gray-500 font-medium italic">Loading prescriptions...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Prescription No</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Finding</th>
                      <th className="px-4 py-3 text-left">Prescribed By</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prescriptions.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-[#6046B5]">PRE-{p.id}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                          {p.finding_name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {p.prescribed_by_details?.name || p.doctor_name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => openModal(p)}
                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {prescriptions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-16 text-center text-gray-400 italic bg-gray-50/30">
                          No prescriptions found in your records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* VIEW MODAL */}
        {isModalOpen && selectedPrescription && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-5xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] rounded-xl">
              {/* Header Bar */}
              <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-6 py-3 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold">Prescription Details</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handlePrint} className="hover:bg-white/20 p-2 rounded transition-colors" title="Print">
                    <Printer size={18} />
                  </button>
                  <button onClick={closeModal} className="hover:bg-white/20 p-2 rounded transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-grow overflow-y-auto p-8 bg-white printable-area">
                {/* ID & Date */}
                <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-3 mb-6">
                  <div className="text-[#6046B5]">Prescription No: PRE-{selectedPrescription.id}</div>
                  <div className="text-gray-500">Date: {new Date(selectedPrescription.created_at).toLocaleString('en-GB')}</div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8 bg-gray-50/50 p-6 rounded-xl border border-gray-100 italic">
                  <div className="space-y-2.5">
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Patient Name</span>
                      <span className="text-gray-800 font-medium">: {user.full_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Gender</span>
                      <span className="text-gray-800 font-medium">: {user.gender || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Phone</span>
                      <span className="text-gray-800 font-medium">: {user.phone || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Prescribed By</span>
                      <span className="text-gray-800 font-medium">: {selectedPrescription.prescribed_by_details?.name || selectedPrescription.doctor_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Consultant</span>
                      <span className="text-gray-800 font-medium">: {selectedPrescription.consultant_doctor_details?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-gray-500 font-bold text-[11px] uppercase tracking-wider shrink-0">Hospital ID</span>
                      <span className="text-gray-800 font-medium">: {user.patient_id}</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Findings Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-gray-100 pt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#6046B5] mb-3">Symptoms</h4>
                    <p className="text-sm text-gray-700 leading-relaxed italic">{selectedPrescription.symptoms_text || "No specific symptoms recorded."}</p>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-lg">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#6046B5] mb-3">Findings</h4>
                    <p className="text-sm font-bold text-gray-800 mb-1">{selectedPrescription.finding_name || "N/A"}</p>
                    <p className="text-xs text-gray-600 leading-relaxed italic">{selectedPrescription.finding_description || ""}</p>
                  </div>
                </div>

                {/* Medicines Table */}
                <div className="mb-8">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[#6046B5] mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#6046B5] rounded-full"></div> Medicines
                  </h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 w-12">#</th>
                          <th className="px-4 py-2">Category</th>
                          <th className="px-4 py-2">Medicine Name</th>
                          <th className="px-4 py-2">Dosage</th>
                          <th className="px-4 py-2">Interval</th>
                          <th className="px-4 py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 italic">
                        {selectedPrescription.medicines?.map((med, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-4 py-2.5 text-gray-500 font-medium">{idx + 1}</td>
                            <td className="px-4 py-2.5 text-gray-700">{med.category_name || "N/A"}</td>
                            <td className="px-4 py-2.5 text-gray-900 font-bold">{med.medicine_name || "N/A"}</td>
                            <td className="px-4 py-2.5 text-gray-700">{med.dosage_name || med.dosage || "N/A"}</td>
                            <td className="px-4 py-2.5 text-gray-700">{med.interval_name || "N/A"}</td>
                            <td className="px-4 py-2.5 text-gray-700">{med.duration_name || med.duration || "N/A"}</td>
                          </tr>
                        ))}
                        {(!selectedPrescription.medicines || selectedPrescription.medicines.length === 0) && (
                          <tr>
                            <td colSpan="6" className="px-4 py-6 text-center text-gray-400 italic">No medicines prescribed in this entry.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#6046B5] mb-4">Pathology Tests</h4>
                    <div className="space-y-1.5">
                      {selectedPrescription.pathology_details?.map((test, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-gray-700 items-start">
                          <span className="font-bold text-[#6046B5]">{idx + 1}.</span>
                          <span>{test.test_name}</span>
                        </div>
                      )) || <p className="text-sm text-gray-400 italic">None prescribed</p>}
                      {selectedPrescription.pathology_details?.length === 0 && <p className="text-sm text-gray-400 italic">None prescribed</p>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#6046B5] mb-4">Radiology Tests</h4>
                    <div className="space-y-1.5">
                      {selectedPrescription.radiology_details?.map((test, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-gray-700 items-start">
                          <span className="font-bold text-[#6046B5]">{idx + 1}.</span>
                          <span>{test.test_name}</span>
                        </div>
                      )) || <p className="text-sm text-gray-400 italic">None prescribed</p>}
                      {selectedPrescription.radiology_details?.length === 0 && <p className="text-sm text-gray-400 italic">None prescribed</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

