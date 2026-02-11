import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList } from "../../../api/ipdApi";
import { Bed, Loader2 } from "lucide-react";

export default function BedHistory() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user?.patient_id) {
            fetchBedHistory();
        }
    }, [user]);

    const fetchBedHistory = async () => {
        try {
            setLoading(true);
            const res = await getIpdPatientList({ patient_id: user.patient_id });
            setData(res.data || []);
        } catch (error) {
            console.error("Error fetching bed history:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Bed className="text-[#6046B5]" />
                            Bed History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[#6046B5]" size={40} />
                        </div>
                    ) : (
                        /* Table */
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-4 text-left">Bed Group</th>
                                        <th className="px-4 py-4">Bed</th>
                                        <th className="px-4 py-4">From Date</th>
                                        <th className="px-4 py-4">To Date</th>
                                        <th className="px-4 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map((row) => (
                                        <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-4 py-4 font-medium text-gray-800">{row.bed?.bed_group || "N/A"}</td>
                                            <td className="px-4 py-4 text-[#6046B5] font-medium">{row.bed?.bed_name || "N/A"}</td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {new Date(row.admission_date).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {row.discharge_date ? new Date(row.discharge_date).toLocaleString() : "-"}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${!row.discharge_date ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                    {!row.discharge_date ? "Active" : "Discharged"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-500">No bed history records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && data.length > 0 && (
                        <div className="p-4 border-t text-xs text-gray-500 bg-gray-50">
                            Total Records: {data.length}
                        </div>
                    )}
                </div>
            </div>
        </PatientLayout>
    );
}

