import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function IPDVitalsPage() {
  const [activeTab, setActiveTab] = useState("vitals");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const [vitals, setVitals] = useState([
    {
      id: 1,
      date: "01/19/2026",
      time: "04:42 PM",
      height: "12",
      weight: "",
      pulse: "",
      temperature: "",
      bp: "",
    },
    {
      id: 2,
      date: "01/09/2026",
      time: "04:42 PM",
      height: "",
      weight: "",
      pulse: "13",
      temperature: "",
      bp: "",
    },
  ]);

  const [newVitalForm, setNewVitalForm] = useState({
    vitalName: "",
    vitalValue: "",
    vitalDate: new Date().toISOString().slice(0, 16),
  });

  const vitalOptions = [
    "Height (1 - 200 Centimeters)",
    "Weight (0 - 150 Kilograms)",
    "Pulse (70 - 100 Beats per)",
    "Temperature (95.8 - 99.3 Fahrenheit)",
    "BP (90/60 - 140/90 mmHg)",
  ];

  const handleAddVital = () => {
    if (!newVitalForm.vitalName || !newVitalForm.vitalValue) {
      alert("Please fill all required fields");
      return;
    }

    const dateObj = new Date(newVitalForm.vitalDate);
    const newVital = {
      id: Date.now(),
      date: dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      [newVitalForm.vitalName.toLowerCase().split(" ")[0]]: newVitalForm.vitalValue,
    };

    setVitals([newVital, ...vitals]);
    setNewVitalForm({
      vitalName: "",
      vitalValue: "",
      vitalDate: new Date().toISOString().slice(0, 16),
    });
    setShowAddModal(false);
  };

  const handleEdit = (vital) => {
    setEditingId(vital.id);
    setEditFormData({ ...vital });
  };

  const handleSaveEdit = () => {
    setVitals(
      vitals.map((vital) =>
        vital.id === editingId ? editFormData : vital
      )
    );
    setEditingId(null);
    setEditFormData(null);
  };

  const handleDeleteVital = (id) => {
    if (window.confirm("Are you sure you want to delete this vital record?")) {
      setVitals(vitals.filter((vital) => vital.id !== id));
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
        <div className="mx-4 md:mx-6 mt-6">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vitals</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-medium flex items-center gap-2"
              >
                <Plus size={20} />
                Add Vital
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Height<br />(1 - 200 Centimeters)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Weight<br />(0 - 150 Kilograms)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Pulse<br />(70 - 100 Beats per)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Temperature<br />(95.8 - 99.3 Fahrenheit)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">BP<br />(90/60 - 140/90 mmHg)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.length > 0 ? (
                    vitals.map((vital) => (
                      <tr key={vital.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {vital.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {vital.height && `${vital.height} (${vital.time})`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {vital.weight && `${vital.weight}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {vital.pulse && `${vital.pulse} (${vital.time})`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {vital.temperature && `${vital.temperature}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {vital.bp && `${vital.bp}`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(vital)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteVital(vital.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        No vitals recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Vital Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Vital</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
                >
                  ✕
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vital Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newVitalForm.vitalName}
                    onChange={(e) =>
                      setNewVitalForm({ ...newVitalForm, vitalName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  >
                    <option value="">Select</option>
                    {vitalOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vital Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVitalForm.vitalValue}
                    onChange={(e) =>
                      setNewVitalForm({ ...newVitalForm, vitalValue: e.target.value })
                    }
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newVitalForm.vitalDate}
                    onChange={(e) =>
                      setNewVitalForm({ ...newVitalForm, vitalDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVital}
                  className="px-6 py-2  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white rounded-lg transition font-medium flex items-center gap-2"
                >
                  <span>✓</span>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vital Modal */}
        {editingId !== null && editFormData && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Vital</h2>
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
                    Vital Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.vitalName || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, vitalName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  >
                    <option value="">Select</option>
                    {vitalOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vital Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.vitalValue || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, vitalValue: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vital Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={`${editFormData.date} ${editFormData.time}`
                      .replace(/\//g, "-")
                      .split(" ")
                      .reverse()
                      .join("T")}
                    onChange={(e) => {
                      const dateObj = new Date(e.target.value);
                      setEditFormData({
                        ...editFormData,
                        date: dateObj.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }),
                        time: dateObj.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
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
                  className="px-6 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white rounded-lg transition font-medium flex items-center gap-2"
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
