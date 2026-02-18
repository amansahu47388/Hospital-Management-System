import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList } from "../../../api/ipdApi";
import { History, Search, User, Bed, Loader2 } from "lucide-react";

export default function TreatmentHistory() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user?.patient_id) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await getIpdPatientList({ patient_id: user.patient_id });
            setData(res.data || []);
        } catch (error) {
            console.error("Error fetching treatment history:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item =>
        item.ipd_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-3 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <History className="text-[#6046B5]" />
                            Treatment History
                        </h2>
                    </div>

                    <div className="p-3 bg-gray-50/30">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by IPD No, Doctor or Symptoms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#6046B5] bg-white"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[#6046B5]" size={40} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto p-2">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-3 py-2 rounded-tl-lg">IPD No</th>
                                        <th className="px-3 py-2">Admission Date</th>
                                        <th className="px-3 py-2 w-1/2">Symptoms</th>
                                        <th className="px-3 py-2">Consultant</th>
                                        <th className="px-3 py-2 rounded-tr-lg">Bed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.map((row) => (
                                        <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group border-b border-gray-200">
                                            <td className="px-3 py-2 font-medium text-[#6046B5] whitespace-nowrap align-top">IPDN{row.id}</td>
                                            <td className="px-3 py-2 text-gray-600 whitespace-nowrap align-top">
                                                {new Date(row.admission_date).toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2 text-gray-700 align-top">
                                                <p className="line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                                    {row.symptoms || "No symptoms recorded."}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600 align-top whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-gray-400" />
                                                    {row.doctor_name || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600 align-top">
                                                <div className="flex items-center gap-2">
                                                    <Bed size={14} className="text-gray-400" />
                                                    {row.bed?.bed_name || "N/A"} ({row.bed?.bed_group || "-"})
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-2 text-center text-gray-500">No matching treatment history records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && data.length > 0 && (
                        <div className="p-4 text-xs text-gray-500 bg-gray-50">
                            Showing {filteredData.length} records.
                        </div>
                    )}
                </div>
            </div>
        </PatientLayout>
    );
}

