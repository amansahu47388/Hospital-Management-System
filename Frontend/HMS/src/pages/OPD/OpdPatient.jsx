import React, { useState, useMemo } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { useNavigate } from "react-router-dom";
import {Plus,FileText,FileSpreadsheet,Printer,File, Eye} from "lucide-react";
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
      const res = await getOpdPatientList(activeTab);
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
                  className={`pb-2 transition-colors duration-200 ${
                    activeTab === tab.value
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
                    <Eye/>
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
                onClick={() => navigate(`/admin/opd-patients/${opd.opd_id}`)}
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
                  <Eye/>
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

    </div>
  );
}
