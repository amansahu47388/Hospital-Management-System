import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import OPDNavbar from "../../components/OPDComponent/OPDNavbar";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { getOpdPatientDetail, getOpdPatientList } from "../../api/opdApi";
import { useNotify } from "../../context/NotificationContext";

export default function OPDTreatmentHistory() {
  const { opdId } = useParams();
  const notify = useNotify();
  const [activeTab, setActiveTab] = useState("treatment-history");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (opdId) {
        setLoading(true);
        try {
          const opdRes = await getOpdPatientDetail(opdId);
          const pid = opdRes.data.patient;
          setPatientId(pid);
          fetchHistory(pid);
        } catch (error) {
          console.error("Error initializing treatment history:", error);
          notify("error", "Failed to load patient records");
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [opdId]);

  const fetchHistory = async (pid) => {
    setLoading(true);
    try {
      const response = await getOpdPatientList({ patient_id: pid });
      const formattedData = response.data.map(item => ({
        id: item.opd_id,
        opdNo: `OPD-${item.opd_id}`,
        caseId: `CASE-${item.case_id}`,
        appointmentDate: new Date(item.appointment_date).toLocaleDateString(),
        symptoms: item.symptom_name || "N/A",
        consultant: item.doctor_detail?.full_name || "N/A",
        date: new Date(item.created_at).toLocaleDateString()
      }));
      setTreatmentHistory(formattedData);
    } catch (error) {
      console.error("Error fetching treatment history:", error);
      notify("error", "Failed to fetch treatment history");
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const filteredData = treatmentHistory.filter(
    (item) =>
      item.opdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.consultant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.appointmentDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-6">
        <OPDNavbar />

        {/* Main Content */}
        <div className="mx-4 md:mx-6 mt-6 ">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden min-h-[550px]">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-2xl font-bold text-gray-800">Treatment History</h2>

              {/* Search Bar */}
              <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-[#6046B5] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search OPD No, Symptoms, Doctor..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className=" w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-[#6046B5] focus:bg-white transition-all text-sm group"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-3 py-2 bg-gray-200">OPD No</th>
                    <th className="px-3 py-2 bg-gray-200 text-center">Case ID</th>
                    <th className="px-3 py-2 bg-gray-200">Appointment Date</th>
                    <th className="px-3 py-2 bg-gray-200">Symptoms</th>
                    <th className="px-3 py-2 bg-gray-200">Consultant Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-[#6046B5]">
                          <Loader2 className="animate-spin" size={32} />
                          <span className="font-bold text-sm tracking-wide">Retrieving Medical Records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-purple-50/20 transition-all border-b border-gray-50">
                        <td className="px-3 py-2 text-gray-600">
                          <span className=" px-3 py-1 rounded">
                            {item.opdNo}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.caseId}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.appointmentDate}
                        </td>
                        <td className="px-3 py-2 text-gray-600 max-w-xs truncate ">
                          {item.symptoms}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          <div className="flex items-center gap-2">
                           
                            <span className=" text-gray-600">{item.consultant}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                        No previous medical records found for this patient profile.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
