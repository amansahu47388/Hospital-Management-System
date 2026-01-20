import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    CheckCircle,
    Calendar,
    Layout,
    Clock,
    Upload,
} from "lucide-react";

export default function OPDTimelinePage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTimeline, setSelectedTimeline] = useState(null);

    const timelineData = [
        {
            id: 1,
            date: "10/17/2025 01:06 PM",
            title: "Daily Routine Check up",
            description: "Daily Routine Check up",
            visibleToPerson: true,
        },
    ];

    const handleOpenEdit = (item) => {
        setSelectedTimeline(item);
        setShowEditModal(true);
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
                            <h2 className="text-xl font-bold text-gray-800">Timeline</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold text-sm"
                        >
                            <Plus size={18} />
                            Add Timeline
                        </button>
                    </div>

                    {/* Timeline Content */}
                    <div className="p-6 md:p-8">
                        {timelineData.map((item, idx) => (
                            <div key={idx} className="relative pl-8 pb-10 group">
                                {/* Vertical Line */}
                                {idx !== timelineData.length - 1 && (
                                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-200"></div>
                                )}

                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#3daadd] flex items-center justify-center z-10 shadow-sm border-2 border-white">
                                    <Layout size={12} className="text-white" />
                                </div>

                                {/* Date Badge */}
                                <div className="mb-4">
                                    <span className="bg-[#007099] text-white px-3 py-1 rounded text-[11px] font-bold shadow-sm">
                                        {item.date}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-[#3daadd] font-bold text-lg">{item.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(item)}
                                                className="p-1 hover:bg-white rounded text-gray-500 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-1 hover:bg-white rounded text-gray-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 bg-white p-3 border-t border-gray-100 italic">
                                        {item.description}
                                    </div>
                                </div>

                                {/* Bottom icon for empty/extra state (as per screenshot) */}
                                <div className="absolute left-[3px] bottom-0 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center z-10 border-2 border-white">
                                    <Clock size={8} className="text-gray-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add/Edit Timeline Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {showAddModal ? "Add Timeline" : "Edit Timeline"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    placeholder=""
                                    defaultValue={showEditModal ? selectedTimeline.title : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                                        defaultValue={showEditModal ? selectedTimeline.date : "01/20/2026 09:58 AM"}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <textarea
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[100px]"
                                    defaultValue={showEditModal ? selectedTimeline.description : ""}
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Attach Document</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-[#3daadd] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#eef8fe]">
                                        <Upload size={20} className="text-gray-400 group-hover:text-[#3daadd]" />
                                    </div>
                                    <span className="text-sm text-gray-500 group-hover:text-[#3daadd]">Drop a file here or click</span>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-[#3daadd] focus:ring-[#3daadd]"
                                    defaultChecked={showEditModal ? selectedTimeline.visibleToPerson : true}
                                />
                                <span className="text-sm font-bold text-gray-700">Visible to this person</span>
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-8 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm"
                            >
                                <CheckCircle size={18} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
