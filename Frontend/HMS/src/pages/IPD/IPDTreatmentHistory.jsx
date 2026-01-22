import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Search } from "lucide-react";

export default function IPDTreatmentHistory() {
  const [activeTab, setActiveTab] = useState("treatment-history");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [treatmentHistory, setTreatmentHistory] = useState([
    {
      id: 1,
      ipdNo: "IPDN116",
      symptoms:
        "Thirst Thirst is the feeling of needing to drink something. It occurs whenever the body is dehydrated for any reason. Any condition that can result in a loss of body water can lead to thirst or excessive thirst.",
      consultant: "Amit Singh (9009)",
      bed: "TF - 107-Private Ward-3rd Floor",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  const handleSaveEdit = () => {
    setTreatmentHistory(
      treatmentHistory.map((item) =>
        item.id === editingId ? editFormData : item
      )
    );
    setEditingId(null);
    setEditFormData(null);
  };

  const handleDeleteTreatment = (id) => {
    if (window.confirm("Are you sure you want to delete this treatment history?")) {
      setTreatmentHistory(treatmentHistory.filter((item) => item.id !== id));
    }
  };

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
                  placeholder="Search..."
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
                    <th className="px-4 py-3 text-left text-sm font-semibold">Symptoms</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Consultant Doctor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Bed</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {item.ipdNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.symptoms.substring(0, 100)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.consultant}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.bed}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No treatment history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
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
                  <span className="text-sm font-medium text-gray-900">{currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingId !== null && editFormData && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Treatment History</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditFormData(null);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
                >
                  ✕
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IPD No
                  </label>
                  <input
                    type="text"
                    value={editFormData.ipdNo}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ipdNo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    value={editFormData.symptoms}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, symptoms: e.target.value })
                    }
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consultant Doctor
                    </label>
                    <input
                      type="text"
                      value={editFormData.consultant}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, consultant: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bed
                    </label>
                    <input
                      type="text"
                      value={editFormData.bed}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, bed: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditFormData(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white rounded-lg transition font-medium flex items-center gap-2"
                >
                  <span>✓</span>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
