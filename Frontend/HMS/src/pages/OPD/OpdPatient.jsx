import React, { useState, useMemo } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, FileSpreadsheet, Printer, File, Eye, Share2, X, Calendar, User, Phone, Mail, MapPin, Info, CheckCircle } from "lucide-react";
import { getOpdPatientList } from "../../api/opdApi";
import { getPatientList } from "../../api/patientApi";
import { useEffect } from "react";
import OPDVisitDetail from "../../components/OPDComponent/OPDVisitDetail";

const tabs = [
  { label: "Today OPD", value: "today" },
  { label: "Upcoming OPD", value: "upcoming" },
  { label: "Old OPD", value: "old" },
  { label: "Patient View", value: "patient" },
];


export default function OpdPatient() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOpd, setSelectedOpd] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedMovePatient, setSelectedMovePatient] = useState(null);

  useEffect(() => {
    if (activeTab === "patient") {
      featchPatientList();
    } else {
      fetchOpd();
    }
  }, [activeTab]);



  const fetchOpd = async () => {
    try {
      setLoading(true);
      const res = await getOpdPatientList({ tab: activeTab });
      setOpdList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const featchPatientList = async () => {
    try {
      setLoading(true);
      const res = await getPatientList();
      setPatientList(res.data); // ✅ THIS WAS MISSING
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const filteredOpdList = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return opdList;

    return opdList.filter((opd) => {
      const patientName = `${opd.patient_detail?.first_name || ""} ${opd.patient_detail?.last_name || ""}`.toLowerCase();

      return (
        String(opd.opd_id).includes(q) ||
        patientName.includes(q) ||
        String(opd.case_id || "").toLowerCase().includes(q) ||
        String(opd.doctor_detail?.full_name || "").toLowerCase().includes(q) ||
        String(opd.symptom_name || "").toLowerCase().includes(q) ||
        String(opd.reference || "").toLowerCase().includes(q) ||
        String(opd.previous_medical_issue || "").toLowerCase().includes(q)
      );
    });
  }, [search, opdList]);


  const filteredPatientList = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return patientList;

    return patientList.filter((patient) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();

      return (
        fullName.includes(q) ||
        String(patient.id).includes(q) ||
        String(patient.phone || "").includes(q) ||
        String(patient.email || "").toLowerCase().includes(q) ||
        String(patient.gender || "").toLowerCase().includes(q) ||
        String(patient.blood_group || "").toLowerCase().includes(q)
      );
    });
  }, [search, patientList]);



  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">

            {/* TABS + ADD BUTTON */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`pb-2 transition-colors duration-200 ${activeTab === tab.value
                      ? "text-[#6046B5] border-b-2 border-[#6046B5] font-semibold"
                      : "text-gray-600 hover:text-[#6046B5]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Add Patient */}
              <button
                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                            text-white px-4 py-2 rounded
                            flex items-center gap-2
                            w-full lg:w-auto justify-center"
                onClick={() => navigate('/admin/opd-patients/add-opd')}
              >
                <Plus size={18} /> Add Patient
              </button>
            </div>

            {/* SEARCH + ACTIONS */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full lg:w-64"
              />

              {/* Actions */}
              <div className="flex flex-wrap gap-3 items-center justify-between lg:justify-end">
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="border px-2 py-2 rounded text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <div className="flex gap-2">
                  <FileText size={18} className="cursor-pointer text-gray-600" />
                  <FileSpreadsheet size={18} className="cursor-pointer text-gray-600" />
                  <File size={18} className="cursor-pointer text-gray-600" />
                  <Printer size={18} className="cursor-pointer text-gray-600" />
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200">
                  {activeTab === "patient" ? (
                    /* ================= PATIENT TABLE HEADER ================= */
                    <tr>
                      <th className="px-2 py-4 text-left">Patient ID</th>
                      <th className="px-2 py-4 text-left">Patient Name</th>
                      <th className="px-2 py-4 text-left">Email</th>
                      <th className="px-2 py-4 text-left">Gender</th>
                      <th className="px-2 py-4 text-left">Age</th>
                      <th className="px-2 py-4 text-left">Phone</th>
                      <th className="px-2 py-4 text-left">DOB</th>
                      <th className="px-2 py-4 text-left">Blood Group</th>
                      <th className="px-2 py-4 text-left">Action</th>
                    </tr>
                  ) : (
                    /* ================= OPD TABLE HEADER ================= */
                    <tr>
                      <th className="px-2 py-4 text-left">OPD No</th>
                      <th className="px-2 py-4 text-left">Patient Name</th>
                      <th className="px-2 py-4 text-left">Case ID</th>
                      <th className="px-2 py-4 text-left">Appointment Date</th>
                      <th className="px-2 py-4 text-left">Generated By</th>
                      <th className="px-2 py-4 text-left">Doctor</th>
                      <th className="px-2 py-4 text-left">Reference</th>
                      <th className="px-2 py-4 text-left">Symptoms</th>
                      <th className="px-2 py-4 text-left">Old Patient</th>
                      <th className="px-2 py-4 text-left">Previous Medical Issue</th>
                      <th className="px-2 py-4 text-left">Action</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="12" className="text-center py-6">Loading...</td>
                    </tr>
                  ) : activeTab === "patient" ? (
                    patientList.length === 0 ? (
                      <tr>
                        <td colSpan="12" className="text-center py-10 text-gray-400">
                          No Patients Found
                        </td>
                      </tr>
                    ) : (
                      filteredPatientList.slice(0, limit).map((patient) => (
                        <tr key={patient.id} className="border-t">
                          <td className="p-2">PTN{patient?.id}</td>
                          <td className="p-2 text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/admin/patients/${patient.id}`)}>
                            {patient.first_name} {patient.last_name}
                          </td>
                          <td className="p-2">{patient.email || "-"}</td>
                          <td className="p-2">{patient.gender || "-"}</td>
                          <td className="p-2">{patient.age || "-"}</td>
                          <td className="p-2">{patient.phone || "-"}</td>
                          <td className="p-2">{patient.date_of_birth || "-"}</td>
                          <td className="p-2">{patient.blood_group || "-"}</td>
                          <td className="p-2">
                            <button
                              className=" hover:text-blue-600 text-sm"
                              onClick={() => navigate(`/admin/patients/${patient.id}`)}
                            >
                              <Eye />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    filteredOpdList.slice(0, limit).map((opd) => (
                      <tr key={opd.opd_id} className="border-t">
                        <td className="p-2">OPDN{opd.opd_id}</td>
                        <td
                          className="p-2 text-blue-600 cursor-pointer"
                          onClick={() => navigate(`/admin/opd-patients/${opd.opd_id}/profile`)}
                        >
                          {opd.patient_detail.first_name} {opd.patient_detail.last_name}
                        </td>
                        <td className="p-2">{opd.case_id}</td>
                        <td className="p-2">
                          {opd.appointment_date
                            ? new Date(opd.appointment_date).toLocaleString()
                            : "-"}
                        </td>
                        <td className="p-4">{opd.created_by?.role}</td>
                        <td className="p-4">{opd.doctor_detail?.full_name || "-"}</td>
                        <td className="p-4">{opd.reference || "-"}</td>
                        <td className="p-4">{opd.symptom_name || "-"}</td>
                        <td className="p-4">{opd.old_patient ? "Yes" : "No"}</td>
                        <td className="p-4">{opd.previous_medical_issue || "-"}</td>
                        <td className="p-4">
                          <button
                            className=" hover:text-blue-600 text-sm"
                            title="view"
                            onClick={() => {
                              setSelectedOpd(opd);
                              setShowDetail(true);
                            }}
                          >
                            <Eye />
                          </button>
                          <button
                            className=" hover:text-blue-600 text-sm ml-2"
                            title="Move in IPD"
                            onClick={() => {
                              setSelectedMovePatient(opd);
                              setShowMoveModal(true);
                            }}
                          >
                            <Share2 size={18} />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Records: 0 to 0 of 0</span>
              <div className="flex gap-2">
                <button className="px-2">‹</button>
                <button className="px-2">›</button>
              </div>
            </div>

          </div>
        </main>
      </div>
      <OPDVisitDetail open={showDetail} opd={selectedOpd} onClose={() => setShowDetail(false)} onDelete={(id) => setOpdList(prev => prev.filter(item => item.opd_id !== id))} />

      {/* Move Patient to IPD Modal */}
      {showMoveModal && selectedMovePatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl my-8 overflow-hidden transform transition-all scale-100 flex flex-col h-fit lg:h-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#3daadd] px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-white text-xl font-bold">Move Patient to IPD</h3>
              <button
                onClick={() => setShowMoveModal(false)}
                className="text-white hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-0 lg:p-0 flex flex-col lg:flex-row">
              {/* Left Column: Patient Info */}
              <div className="w-full lg:w-2/5 p-6 lg:border-r border-gray-100 bg-gray-50/30">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 flex-shrink-0 overflow-hidden text-gray-400 text-[10px] text-center px-1 font-bold">
                    NO IMAGE AVAILABLE
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedMovePatient.patient_detail.first_name} {selectedMovePatient.patient_detail.last_name} ({selectedMovePatient.patient_detail.id})
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 font-bold"><User size={14} className="text-gray-400" /> {selectedMovePatient.patient_detail.gender}</div>
                      <div className="flex items-center gap-1.5 font-bold"><Calendar size={14} className="text-gray-400" /> {selectedMovePatient.patient_detail.age} Year, 0 Month, 0 Day</div>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 font-bold"><Phone size={14} className="text-gray-400" /> {selectedMovePatient.patient_detail.phone}</div>
                      <div className="flex items-center gap-1.5 font-bold"><Mail size={14} className="text-gray-400" /> {selectedMovePatient.patient_detail.email}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Any Known Allergies", value: selectedMovePatient.patient_detail.known_allergies },
                    { label: "Remarks", value: "" },
                    { label: "TPA", value: selectedMovePatient.patient_detail.tpa },
                    { label: "TPA ID", value: selectedMovePatient.patient_detail.tpa_id },
                    { label: "TPA Validity", value: "" },
                    { label: "National Identification Number", value: "" },
                  ].map((field, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-800">{field.label}</span>
                      <span className="text-sm text-gray-500 min-h-[1.25rem]">{field.value || ""}</span>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Symptoms Type</label>
                      <input type="text" className="w-full p-2 border border-blue-100 bg-white rounded outline-none h-10 shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Symptoms Title</label>
                      <input type="text" className="w-full p-2 border border-blue-100 bg-white rounded outline-none h-10 shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Symptoms Description</label>
                      <textarea className="w-full p-2 border border-blue-100 bg-white rounded outline-none h-10 shadow-sm resize-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-xs font-bold text-gray-700">Note</label>
                    <textarea className="w-full p-2 border border-blue-100 bg-white rounded outline-none h-10 shadow-sm resize-none" />
                  </div>
                </div>
              </div>

              {/* Right Column: Admission Form */}
              <div className="w-full lg:w-3/5 p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Admission Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" defaultValue="01/20/2026 10:02 AM" className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Case</label>
                    <input type="text" className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Casualty</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-whiteappearance-none cursor-pointer">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Old Patient</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-white appearance-none cursor-pointer">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Credit Limit ($) <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue="20000" className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Reference</label>
                    <input type="text" className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm" />
                  </div>

                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Consultant Doctor <span className="text-red-500">*</span></label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-white appearance-none cursor-pointer">
                      <option>{selectedMovePatient.doctor_detail?.full_name || "Select"}</option>
                    </select>
                  </div>

                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Bed Group</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-white appearance-none cursor-pointer font-bold">
                      <option>Select</option>
                    </select>
                  </div>

                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Bed Number <span className="text-red-500">*</span></label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-white appearance-none cursor-pointer">
                      <option>Select</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Live Consultation</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#3daadd] outline-none text-sm h-10 shadow-sm bg-white appearance-none cursor-pointer">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <label className="text-xs font-bold text-gray-700">Is For Antenatal</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-6 py-2 rounded text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                className="bg-[#3daadd] hover:bg-[#3498c5] text-white px-8 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-sm"
              >
                <CheckCircle size={16} />
                Move
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
