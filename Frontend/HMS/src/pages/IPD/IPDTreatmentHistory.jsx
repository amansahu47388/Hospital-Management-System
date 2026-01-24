import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { getIpdPatientDetail, getIpdPatientList } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";

export default function IPDTreatmentHistory() {
  const { ipdId } = useParams();
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
      if (ipdId) {
        setLoading(true);
        try {
          const ipdRes = await getIpdPatientDetail(ipdId);
          const pid = ipdRes.data.patient;
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
  }, [ipdId]);

  const fetchHistory = async (pid) => {
    setLoading(true);
    try {
      const response = await getIpdPatientList({ patient_id: pid });
      const formattedData = response.data.map(item => ({
        id: item.ipd_id,
        ipdNo: `IPD-${item.ipd_id}`,
        symptoms: item.symptom_name || "N/A",
        consultant: item.doctor_detail?.full_name || "N/A",
        bed: item.bed?.bed_name || "N/A",
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
      item.ipdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.consultant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pt-1 md:pt-6 pb-6">
        {/* Navbar */}
        <div className="mx-4 md:mx-6">
          <IPDTabsNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="mx-4 md:mx-6 mt-6 ">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Treatment History</h2>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by IPD No, Symptoms, Doctor or Bed..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-900">
                    <th className="px-4 py-3 text-left text-sm font-semibold">IPD No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Symptoms</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Consultant Doctor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Bed</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Loader2 className="animate-spin" size={32} />
                          <span>Loading treatment history...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-bold text-[#6046B5]">
                          {item.ipdNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                          {item.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                          {item.symptoms}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.consultant}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium tracking-wide">
                            {item.bed}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-gray-500 italic">
                        No treatment history records found for this patient.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {filteredData.length > 0 && (
              <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Records: {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length}
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-bold text-[#6046B5] bg-purple-50 w-8 h-8 flex items-center justify-center rounded-full border border-purple-100">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
