import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
import { Plus, Edit2, Trash2, X, Save, CheckCircle, Calendar, ChevronDown, Trash, } from "lucide-react";

export default function OPDVitals() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVital, setSelectedVital] = useState(null);

    const [vitals, setVitals] = useState([
        {
            id: 1,
            date: "12/29/2025",
            time: "10:02 AM",
            height: "",
            weight: "13",
            pulse: "",
            temperature: "",
            bp: "",
        },
    ]);

    const [newVitalForm, setNewVitalForm] = useState({
        rows: [{ vitalName: "", vitalValue: "" }],
        vitalDate: new Date().toISOString().slice(0, 16),
    });

    const [editFormData, setEditFormData] = useState({
        rows: [{ vitalName: "", vitalValue: "" }],
        vitalDate: "",
    });

    const vitalOptions = ["Weight", "Height", "Pulse", "Temperature", "BP"];

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
            const field = row.vitalName.toLowerCase();
            newEntry[field] = row.vitalValue;
        });

        setVitals([newEntry, ...vitals]);
        setNewVitalForm({
            rows: [{ vitalName: "", vitalValue: "" }],
            vitalDate: new Date().toISOString().slice(0, 16),
        });
        setShowAddModal(false);
    };

    const handleOpenEdit = (vital) => {
        setSelectedVital(vital);
        // Convert flat vital object back to rows for editing
        const rows = [];
        if (vital.height) rows.push({ vitalName: "Height", vitalValue: vital.height });
        if (vital.weight) rows.push({ vitalName: "Weight", vitalValue: vital.weight });
        if (vital.pulse) rows.push({ vitalName: "Pulse", vitalValue: vital.pulse });
        if (vital.temperature) rows.push({ vitalName: "Temperature", vitalValue: vital.temperature });
        if (vital.bp) rows.push({ vitalName: "BP", vitalValue: vital.bp });

        if (rows.length === 0) rows.push({ vitalName: "", vitalValue: "" });

        const [month, day, year] = vital.date.split("/");
        const d = new Date(`${year}-${month}-${day} ${vital.time}`);
        const dateFormatted = d.getTime() ? d.toISOString().slice(0, 16) : "";

        setEditFormData({
            rows,
            vitalDate: dateFormatted,
        });
        setShowEditModal(true);
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
            id: selectedVital.id,
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
            const field = row.vitalName.toLowerCase();
            updatedVital[field] = row.vitalValue;
        });

        setVitals(
            vitals.map((v) => (v.id === selectedVital.id ? updatedVital : v))
        );
        setShowEditModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this vital record?")) {
            setVitals(vitals.filter((v) => v.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">
                <div className="mx-4 md:mx-6">
                    <OPDTabsNavbar />
                </div>

                <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]">
                    {/* Page Header */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Vitals</h2>
                        </div>
                        <button
                            onClick={() => {
                                setNewVitalForm({
                                    rows: [{ vitalName: "", vitalValue: "" }],
                                    vitalDate: new Date().toISOString().slice(0, 16),
                                });
                                setShowAddModal(true);
                            }}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold text-sm"
                        >
                            <Plus size={18} />
                            Add Vital
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    {[
                                        "Date",
                                        "Height\n(1 - 200 Centimeters)",
                                        "Weight\n(0 - 150 Kilograms)",
                                        "Pulse\n(70 - 100 Beats per)",
                                        "Temperature\n(95.8 - 99.3 Fahrenheit)",
                                        "BP\n(90/60 - 140/90 mmHg)",
                                        "Action",
                                    ].map((head, idx) => (
                                        <th key={idx} className="px-6 py-4 text-sm font-bold whitespace-pre-wrap">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vitals.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{row.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.height ? `${row.height} (${row.time})` : "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.weight ? `${row.weight} (${row.time})` : "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.pulse ? `${row.pulse} (${row.time})` : "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.temperature ? `${row.temperature} (${row.time})` : "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.bp ? `${row.bp} (${row.time})` : "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Vital Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                Add Vital
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="mb-6 flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={newVitalForm.vitalDate}
                                            onChange={(e) => setNewVitalForm({ ...newVitalForm, vitalDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-6">
                                {newVitalForm.rows.map((row, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-end bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative">
                                        <div className="col-span-12 md:col-span-6 flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-gray-700 underline decoration-[#6046B5]">Vital Name</label>
                                            <select
                                                value={row.vitalName}
                                                onChange={(e) => handleRowChange(index, "vitalName", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                                            >
                                                <option value="">Select</option>
                                                {vitalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-12 md:col-span-5 flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-gray-700 underline decoration-[#6046B5]">Value</label>
                                            <input
                                                type="text"
                                                value={row.vitalValue}
                                                onChange={(e) => handleRowChange(index, "vitalValue", e.target.value)}
                                                placeholder="Enter value"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-1 flex justify-center items-center h-full pt-6">
                                            {newVitalForm.rows.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveRow(index)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all group active:scale-95"
                                                    title="Remove Row"
                                                >
                                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-start">
                                <button
                                    onClick={handleAddRow}
                                    className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-5 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-md transition-all active:scale-95 focus:ring-2 focus:ring-blue-300"
                                >
                                    <Plus size={16} /> Add More Rows
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold text-xs transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddVital}
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-xs"
                            >
                                <CheckCircle size={16} />
                                Save Records
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Vital Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                Edit Vital
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="mb-6 flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={editFormData.vitalDate}
                                            onChange={(e) => setEditFormData({ ...editFormData, vitalDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-6">
                                {editFormData.rows.map((row, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-end bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative">
                                        <div className="col-span-12 md:col-span-6 flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-gray-700 underline decoration-[#6046B5]">Vital Name</label>
                                            <select
                                                value={row.vitalName}
                                                onChange={(e) => handleEditRowChange(index, "vitalName", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                                            >
                                                <option value="">Select</option>
                                                {vitalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-12 md:col-span-5 flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-gray-700 underline decoration-[#6046B5]">Value</label>
                                            <input
                                                type="text"
                                                value={row.vitalValue}
                                                onChange={(e) => handleEditRowChange(index, "vitalValue", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-1 flex justify-center items-center h-full pt-6">
                                            {editFormData.rows.length > 1 && (
                                                <button
                                                    onClick={() => handleEditRowRemove(index)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all group"
                                                    title="Remove Row"
                                                >
                                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleEditRowAdd}
                                    className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-5 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-md transition-all active:scale-95"
                                >
                                    <Plus size={16} /> Add More Rows
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-xs"
                            >
                                <CheckCircle size={16} />
                                Update Records
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
