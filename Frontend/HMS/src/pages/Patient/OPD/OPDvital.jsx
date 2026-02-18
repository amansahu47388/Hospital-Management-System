import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import OPDHeaderNavbar from "../../../components/Patient_module/OPD/OPDHeader";
import { useAuth } from "../../../context/AuthContext";
import { getPatientVitals } from "../../../api/patientApi";
import { Eye, X, Activity, Thermometer, Heart, Wind, Scaling, Weight, Clock, HeartPulse } from "lucide-react";

export default function OPDVitals() {
    const { user } = useAuth();
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVital, setSelectedVital] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const patientId = user?.patient_id || user?.id;

    useEffect(() => {
        if (patientId) {
            fetchVitals();
        }
    }, [patientId]);

    const fetchVitals = async () => {
        setLoading(true);
        try {
            const response = await getPatientVitals(patientId);
            setVitals(response.data);
        } catch (error) {
            console.error("❌ Error fetching vitals:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return "N/A";
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = true;
        }
        return new Date(dateString).toLocaleString('en-GB', options);
    };

    const handleOpenModal = (vital) => {
        setSelectedVital(vital);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVital(null);
    };

    return (
        <PatientLayout>
            <OPDHeaderNavbar />

            <div className="min-h-screen p-4 md:p-6 ">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-5 py-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Vitals History</h2>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6046B5]"></div>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-left">Weight</th>
                                        <th className="px-3 py-2 text-left">BP</th>
                                        <th className="px-3 py-2 text-left">Pulse</th>
                                        <th className="px-3 py-2 text-left">Temperature</th>
                                        <th className="px-3 py-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vitals.length > 0 ? vitals.map((d, i) => (
                                        <tr key={i} className="border-b border-gray-200 hover:bg-indigo-50/40 transition">
                                            <td className="px-3 py-2 font-medium text-[#6046B5]">{formatDate(d.vital_date)}</td>
                                            <td className="px-3 py-2 font-semibold">{d.weight ? `${d.weight} kg` : "N/A"}</td>
                                            <td className="px-3 py-2">{d.bp || "N/A"}</td>
                                            <td className="px-3 py-2">{d.pulse || "N/A"}</td>
                                            <td className="px-3 py-2">{d.temperature ? `${d.temperature}°F` : "N/A"}</td>
                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    onClick={() => handleOpenModal(d)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500 italic">No vital records found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Vital Details Modal */}
            {isModalOpen && selectedVital && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#6046B5] p-5 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <HeartPulse className="p-2 bg-white/20 rounded-lg text-white" size={40} />
                                <div>
                                    <h3 className="text-xl font-bold">Health Metrics</h3>
                                    <p className="text-sm text-indigo-100 italic">Recorded on: {formatDate(selectedVital.vital_date, true)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 grid grid-cols-2 gap-6 bg-gray-50">
                            {/* Height */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                    <Scaling size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Height</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.height || "N/A"} <span className="text-xs text-gray-400 font-normal">cm</span></p>
                                </div>
                            </div>

                            {/* Weight */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                    <Weight size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weight</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.weight || "N/A"} <span className="text-xs text-gray-400 font-normal">kg</span></p>
                                </div>
                            </div>

                            {/* Blood Pressure */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Blood Pressure</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.bp || "N/A"} <span className="text-xs text-gray-400 font-normal">mmHg</span></p>
                                </div>
                            </div>

                            {/* Pulse */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pulse Rate</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.pulse || "N/A"} <span className="text-xs text-gray-400 font-normal">bpm</span></p>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                                    <Thermometer size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Temperature</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.temperature || "N/A"} <span className="text-xs text-gray-400 font-normal">°F</span></p>
                                </div>
                            </div>

                            {/* Respiration */}
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-xl">
                                    <Wind size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Respiration</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedVital.respiration || "N/A"} <span className="text-xs text-gray-400 font-normal">bpm</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-200 bg-white flex justify-between items-center px-8">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                <Clock size={12} />
                                Comprehensive Health Check
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="px-8 py-2 bg-[#6046B5] text-white rounded hover:bg-[#4d3794] transition shadow-lg shadow-indigo-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
