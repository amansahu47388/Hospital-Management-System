
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { useNavigate } from "react-router-dom";
import {Plus,FileText,FileSpreadsheet,Printer,File, Eye} from "lucide-react";
import { getDischargedIpdPatients  } from "../../api/ipdApi";
import DischargeVisitDetail from "../../components/ipd/DischargeVisitDetails";


export default function DischargedPatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDischarge, setSelectedDischarge] = useState(null);
  const [patients, setPatients] = useState([]);
  const hasFetchedRef = useRef(false);

  
useEffect(() => {
  if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPatients();
  }, []);

   const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getDischargedIpdPatients();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load discharged patients");
    } finally {
      setLoading(false);
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
              <h2 className="text-lg font-semibold">IPD Discharged Patients</h2>
            </div>

            {/* SEARCH + ACTIONS */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[#6046B5] outline-none w-full lg:w-64"
              />

              <div className="flex flex-wrap gap-3 items-center justify-between lg:justify-end">
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[#6046B5] outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                {/* <div className="flex gap-2">
                  <FileText size={18} className="cursor-pointer text-gray-600" />
                  <FileSpreadsheet size={18} className="cursor-pointer text-gray-600" />
                  <File size={18} className="cursor-pointer text-gray-600" />
                  <Printer size={18} className="cursor-pointer text-gray-600" />
                </div> */}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto" >
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 ">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Patient ID</th>
                    <th className="px-3 py-2 text-left">Case ID</th>
                    <th className="px-3 py-2 text-left">Gender</th>
                    <th className="px-3 py-2 text-left">phone</th>
                    <th className="px-3 py-2 text-left">Created By</th>
                    <th className="px-3 py-2 text-left">Consultant Doctor </th>
                    <th className="px-3 py-2 text-left">admidion Date</th>
                    <th className="px-3 py-2 text-left">Discharge Date</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Action</th>
                   
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {patients.map((ipd) => (
                    <tr key={ipd.ipd_id} className="border-b border-gray-300">
                      <td className="p-2 text-left text-blue-600 hover:text-blue-700 cursor-pointer"
                      onClick={() => navigate(`/admin/ipd-patients/${ipd.ipd_id}`)}>
                        {ipd.patient_detail.first_name}{" "}
                        {ipd.patient_detail.last_name}
                      </td>
                      <td className="p-2 text-left">IPDN{ipd.ipd_id}</td>
                      <td className="p-">{ipd.case_id}</td>
                      <td className="p-2 text-left">{ipd.patient_detail.gender}</td>
                      <td className="p-2 text-left">{ipd.patient_detail.phone}</td>
                      <td className="p-2 text-left">{ipd.created_by?.role}</td>
                      <td className="p-2 text-left">
                        {ipd.doctor_detail?.full_name}
                      </td> 
                      <td className="p-2 text-left">
                        {new Date(ipd.appointment_date).toLocaleString()}
                      </td>
                      <td className="p-2 text-left">
                        {new Date(ipd.discharge_date).toLocaleString()}
                      </td>
                      <td className="p-2 text-left">{ipd.discharge.status}</td>
                      <td className="p-2 text-left">
                        <div className="relative inline-flex items-center group">
                          <button
                          title="view"
                            onClick={(e) => {
                              setSelectedDischarge(ipd);
                              setShowDetail(true);
                            }} 
                            className="p-1 text-purple-600 hover:bg-purple-100 rounded cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && patients.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-4 text-center">
                        No discharged patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
     <DischargeVisitDetail
      open={showDetail}
      ipd={selectedDischarge}
      onClose={() => {
        setShowDetail(false);
        fetchPatients();
    }}
      
     />
    </div>
  );
}

