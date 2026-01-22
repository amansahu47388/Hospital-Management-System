import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Plus, Edit2, Trash2, Pencil } from "lucide-react";

export default function IPDVitals() {
  const [activeTab, setActiveTab] = useState("vitals");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
    rows: [{ vitalName: "", vitalValue: "" }],
    vitalDate: new Date().toISOString().slice(0, 16),
  });

  const vitalOptions = [
    "Height (1 - 200 Centimeters)",
    "Weight (0 - 150 Kilograms)",
    "Pulse (70 - 100 Beats per)",
    "Temperature (95.8 - 99.3 Fahrenheit)",
    "BP (90/60 - 140/90 mmHg)",
  ];

  const handleAddRow = () => {
    setNewVitalForm({
      ...newVitalForm,
      rows: [...newVitalForm.rows, { vitalName: "", vitalValue: "" }],
    });
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...newVitalForm.rows];
    updatedRows.splice(index, 1);
    setNewVitalForm({ ...newVitalForm, rows: updatedRows });
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...newVitalForm.rows];
    updatedRows[index][field] = value;
    setNewVitalForm({ ...newVitalForm, rows: updatedRows });
  };

  const handleAddVital = () => {
    const validRows = newVitalForm.rows.filter(r => r.vitalName && r.vitalValue);
    if (validRows.length === 0) {
      alert("Please add at least one valid vital record");
      return;
    }

    const dateObj = new Date(newVitalForm.vitalDate);
    const newEntry = {
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
    };

    validRows.forEach(row => {
      const field = row.vitalName.toLowerCase().split(" ")[0];
      newEntry[field] = row.vitalValue;
    });

    setVitals([newEntry, ...vitals]);
    setNewVitalForm({
      rows: [{ vitalName: "", vitalValue: "" }],
      vitalDate: new Date().toISOString().slice(0, 16),
    });
    setShowAddModal(false);
  };

  const handleEdit = (vital) => {
    setEditingId(vital.id);
    // Convert flat vital object back to rows for editing
    const rows = [];
    if (vital.height) rows.push({ vitalName: "Height (1 - 200 Centimeters)", vitalValue: vital.height });
    if (vital.weight) rows.push({ vitalName: "Weight (0 - 150 Kilograms)", vitalValue: vital.weight });
    if (vital.pulse) rows.push({ vitalName: "Pulse (70 - 100 Beats per)", vitalValue: vital.pulse });
    if (vital.temperature) rows.push({ vitalName: "Temperature (95.8 - 99.3 Fahrenheit)", vitalValue: vital.temperature });
    if (vital.bp) rows.push({ vitalName: "BP (90/60 - 140/90 mmHg)", vitalValue: vital.bp });

    if (rows.length === 0) rows.push({ vitalName: "", vitalValue: "" });

    // Format date for datetime-local
    // Expecting vital.date: "01/19/2026", vital.time: "04:42 PM"
    const [month, day, year] = vital.date.split("/");
    const d = new Date(`${year}-${month}-${day} ${vital.time}`);
    const dateFormatted = d.getTime() ? d.toISOString().slice(0, 16) : "";

    setEditFormData({
      rows,
      vitalDate: dateFormatted,
    });
  };

  const handleEditRowAdd = () => {
    setEditFormData({
      ...editFormData,
      rows: [...editFormData.rows, { vitalName: "", vitalValue: "" }],
    });
  };

  const handleEditRowRemove = (index) => {
    const updatedRows = [...editFormData.rows];
    updatedRows.splice(index, 1);
    setEditFormData({ ...editFormData, rows: updatedRows });
  };

  const handleEditRowChange = (index, field, value) => {
    const updatedRows = [...editFormData.rows];
    updatedRows[index][field] = value;
    setEditFormData({ ...editFormData, rows: updatedRows });
  };

  const handleSaveEdit = () => {
    const validRows = editFormData.rows.filter(r => r.vitalName && r.vitalValue);
    const dateObj = new Date(editFormData.vitalDate);

    const updatedVital = {
      id: editingId,
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
      height: "",
      weight: "",
      pulse: "",
      temperature: "",
      bp: "",
    };

    validRows.forEach(row => {
      const field = row.vitalName.toLowerCase().split(" ")[0];
      updatedVital[field] = row.vitalValue;
    });

    setVitals(
      vitals.map((vital) => (vital.id === editingId ? updatedVital : vital))
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
                  <tr className="bg-gray-100 text-gray-900 font-semibold">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Height<br />(1 - 200 Centimeters)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Weight<br />(0 - 150 Kilograms)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Pulse<br />(70 - 100 Beats per)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Temperature<br />(95.8 - 99.3 Fahrenheit)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">BP<br />(90/60 - 140/90 mmHg)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
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
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(vital)}
                              className="bg-green-100 p-2 rounded text-green-600"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteVital(vital.id)}
                              className="bg-red-100 p-2 rounded text-red-600"
                            >
                              <Trash2 size={16} />
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
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
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
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
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

                <div className="space-y-3">
                  {newVitalForm.rows.map((row, index) => (
                    <div key={index} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Vital Name</label>
                        <select
                          value={row.vitalName}
                          onChange={(e) => handleRowChange(index, "vitalName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                        >
                          <option value="">Select</option>
                          {vitalOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Value</label>
                        <input
                          type="text"
                          value={row.vitalValue}
                          onChange={(e) => handleRowChange(index, "vitalValue", e.target.value)}
                          placeholder="Value"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                        />
                      </div>
                      {newVitalForm.rows.length > 1 && (
                        <button
                          onClick={() => handleRemoveRow(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleAddRow}
                    className="mt-2 text-[#6046B5] hover:text-[#8A63D2] text-sm font-bold flex items-center gap-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVital}
                  className="px-6 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white rounded-lg transition font-medium flex items-center gap-2 text-sm"
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
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
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
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editFormData.vitalDate}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, vitalDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                <div className="space-y-3">
                  {editFormData.rows.map((row, index) => (
                    <div key={index} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Vital Name</label>
                        <select
                          value={row.vitalName}
                          onChange={(e) => handleEditRowChange(index, "vitalName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                        >
                          <option value="">Select</option>
                          {vitalOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Value</label>
                        <input
                          type="text"
                          value={row.vitalValue}
                          onChange={(e) => handleEditRowChange(index, "vitalValue", e.target.value)}
                          placeholder="Value"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                        />
                      </div>
                      {editFormData.rows.length > 1 && (
                        <button
                          onClick={() => handleEditRowRemove(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleEditRowAdd}
                    className="mt-2 text-[#6046B5] hover:text-[#8A63D2] text-sm font-bold flex items-center gap-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditFormData(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white rounded-lg transition font-medium flex items-center gap-2 text-sm"
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
