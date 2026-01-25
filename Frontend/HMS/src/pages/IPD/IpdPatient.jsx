import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { useNavigate } from "react-router-dom";
import {Plus,FileText,FileSpreadsheet,Printer,File, Eye, Pencil, Trash, ClipboardPenLine} from "lucide-react";
import { getIpdPatientList } from "../../api/ipdApi";
import IPDVisitDetail from "../../components/ipd/IPDVisitDetails";
import { deleteIpdPatient } from "../../api/ipdApi";
import AddDischargePatient from "../../components/ipd/AddDischargePatient";
import { useNotify } from "../../context/NotificationContext";


export default function IpdPatient() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [ipdList, setIpdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIpd, setSelectedIpd] = useState(null);
  const hasFetchedRef = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const [dischargePatient, setDischargePatient] = useState(false);


  
useEffect(() => {
  if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchIpd();
  }, []);

  const fetchIpd = async () => {
    try {
      setLoading(true);
      const res = await getIpdPatientList();
      setIpdList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredIpdList = React.useMemo(() => {
  const query = search.toLowerCase().trim();

  if (!query) return ipdList;

  return ipdList.filter((ipd) => {
    const patientName = ipd.patient_detail
      ? `${ipd.patient_detail.first_name} ${ipd.patient_detail.last_name}`
      : "";

    return (
      String(ipd.ipd_id).includes(query) ||
      patientName.toLowerCase().includes(query) ||
      String(ipd.case_id || "").toLowerCase().includes(query) ||
      String(ipd.patient_detail?.gender || "").toLowerCase().includes(query) ||
      String(ipd.patient_detail?.phone || "").includes(query) ||
      String(ipd.doctor_detail?.full_name || "").toLowerCase().includes(query) ||
      String(ipd.bed?.bed_name || "").toLowerCase().includes(query)
    );
  });
}, [search, ipdList]);


const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this IPD?")) return;

    try {
      setDeleting(true);
      const res = await deleteIpdPatient(id);
      setIpdList(prev => prev.filter(item => item.ipd_id !== id));
      notify("success", res.data?.detail || "IPD deleted successfully");
      if (selectedIpd?.ipd_id === id) {
        setShowDetail(false);
        setSelectedIpd(null);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Delete failed";
      notify("error", msg);
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div className="h-screen w-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">IPD Patient</h2>

              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                              onClick={() => navigate('/admin/ipd-patients/add-ipd')}
                >
                  <Plus size={16} /> Add Patient
                   
                </button>

                <button   
                  onClick={() => navigate('/admin/ipd-patients/discharge-patients')}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                >
                  Discharged Patient
                </button>
              </div>
            </div>

            {/* SEARCH + ACTIONS */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full lg:w-64"
              />

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
            <div className="overflow-x-auto" >
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 ">
                  <tr>
                    <th className="px-2 py-4 text-center">IPD No</th>
                    <th className="px-2 py-4 text-center">Name</th>
                    <th className="px-2 py-4 text-center">Case ID</th>
                    <th className="px-2 py-4 text-center">Gender</th>
                    <th className="px-2 py-4 text-center">phone</th>
                    <th className="px-2 py-4 text-center">Created By</th>
                    <th className="px-2 py-4 text-center">Doctor </th>
                    <th className="px-2 py-4 text-center">Bed</th>
                    <th className="px-2 py-4 text-center">Admision Date</th>
                    <th className="px-2 py-4 text-center">Previous Medical Issue</th>
                    <th className="px-2 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredIpdList.slice(0, limit).map((ipd) => (
                  <tr key={ipd.ipd_id} className="border-t">
                    <td className="p-2 text-center">IPDN{ipd.ipd_id}</td>
                    <td
                      className="p-2 text-center text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/admin/ipd-patients/${ipd.ipd_id}/profile`)}
                    >
                      {ipd.patient_detail
                          ? `${ipd.patient_detail.first_name} ${ipd.patient_detail.last_name}`
                          : "-"}
                    </td>
                    <td className="p-2 py-4 text-center">{ipd.case_id}</td>
                    <td className="p-2 py-4 text-center">{ipd.patient_detail.gender}</td>
                    <td className="p-2 py-4 text-center">{ipd.patient_detail.phone}</td>
                    <td className="p-2 py-4 text-center">{ipd.created_by?.full_name || "-"}</td>
                    <td className="p-2 py-4 text-center">{ipd.doctor_detail?.full_name || "-"}</td>
                    <td className="p-2 py-4 text-center">{ipd.bed ? `${ipd.bed.bed_name} - ${ipd.bed.bed_type} - ${ipd.bed.floor ?? ""}` : "-"}</td>
                    <td className="p-2 py-4 text-center">{new Date(ipd.created_at).toLocaleString("en-IN")}</td>
                    <td className="p-2 py-4 text-center">{ipd.previous_medical_issue || "-"}</td>
                    <td className="p-2 py-4 text-center flex gap-2">
                    <button
                    title="view"
                      onClick={(e) => {
                        setSelectedIpd(ipd);
                        setShowDetail(true);
                      }} 
                    >
                    <Eye size={16} />
                  </button>

                  <button className="cursor-pointer hover:opacity-80"  
                    title="Edit"
                    onClick={() => navigate(`/admin/ipd-patients/${ipd.ipd_id}/update`)}>
                    <Pencil size={18} />
                  </button>

                  <button
                    title="Delete IPD"
                    className={`cursor-pointer hover:opacity-80 ${deleting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => handleDelete(ipd.ipd_id)}
                    disabled={deleting}
                  >
                    <Trash size={18} />
                  </button>

                  <button
                    className="cursor-pointer hover:opacity-80"  
                    title="Discharge Patient"
                    onClick={(e) => {
                      setSelectedIpd(ipd);
                      setDischargePatient(true);
                    }}>
                    <ClipboardPenLine size={18} />
                  </button>
                  </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
     <IPDVisitDetail
      open={showDetail}
      ipd={selectedIpd}
      onClose={() => setShowDetail(false)}
     />
      <AddDischargePatient
          open={dischargePatient}
          onClose={() => setDischargePatient(false)}
          ipd={selectedIpd}
          onDischarged={() => {
            setDischargePatient(false);
            fetchIpd();
          }}
        />
    </div>
  );
}
