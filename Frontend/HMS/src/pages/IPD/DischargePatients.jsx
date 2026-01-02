
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { useNavigate } from "react-router-dom";
import {Plus,FileText,FileSpreadsheet,Printer,File, Eye} from "lucide-react";
import { getDischargedIpdPatients  } from "../../api/ipdApi";
import IPDVisitDetail from "../../components/ipd/IPDVisitDetails";


export default function DischargedPatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [ipdList, setIpdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIpd, setSelectedIpd] = useState(null);
  const [patients, setPatients] = useState([]);
  const hasFetchedRef = useRef(false);

  
useEffect(() => {
  if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPatients();
  }, []);

  // const fetchIpd = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getIpdPatientList();
  //     setIpdList(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                    <th className="px-2 py-4 text-center">Name</th>
                    <th className="px-2 py-4 text-center">Patient ID</th>
                    <th className="px-2 py-4 text-center">Case ID</th>
                    <th className="px-2 py-4 text-center">Gender</th>
                    <th className="px-2 py-4 text-center">phone</th>
                    <th className="px-2 py-4 text-center">Created By</th>
                    <th className="px-2 py-4 text-center">Consultant Doctor </th>
                    <th className="px-2 py-4 text-center">admidion Date</th>
                    <th className="px-2 py-4 text-center">Discharge Date</th>
                    <th className="px-2 py-4 text-center">Status</th>
                    <th className="px-2 py-4 text-center">Action</th>
                   
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {patients.map((ipd) => (
                    <tr key={ipd.ipd_id}>
                      <td className="p-2 text-center">
                        {ipd.patient_detail.first_name}{" "}
                        {ipd.patient_detail.last_name}
                      </td>
                      <td className="p-2 text-center">IPDN{ipd.ipd_id}</td>
                      <td className="p-">{ipd.case_id}</td>
                      <td className="p-2 text-center">{ipd.patient_detail.gender}</td>
                      <td className="p-2 text-center">{ipd.patient_detail.phone}</td>
                      <td className="p-2 text-center">{ipd.created_by?.role}</td>
                      <td className="p-2 text-center">
                        {ipd.doctor_detail?.full_name}
                      </td> 
                      <td className="p-2 text-center">
                        {new Date(ipd.appointment_date).toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        {new Date(ipd.discharge_date).toLocaleString()}
                      </td>
                      <td className="p-2 text-center">{ipd.status}</td>

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
     <IPDVisitDetail
      open={showDetail}
      ipd={selectedIpd}
      onClose={() => setShowDetail(false)}
      onDelete={(id) => setIpdList(prev => prev.filter(item => item.ipd_id !== id))}
      onDischarge={() => { setShowDetail(false); fetchIpd(); }}
     />
    </div>
  );
}

