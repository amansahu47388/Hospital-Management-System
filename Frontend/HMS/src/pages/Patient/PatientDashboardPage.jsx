import React, { useState, useEffect, useCallback } from "react";
import PatientLayout from "../../layout/PatientLayout";
import {
    Stethoscope,
    Bed,
    Pill,
    FlaskConical,
    FolderGit2,
    Droplet,
    Ambulance,
    ChevronRight,
    Loader
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getPatientDashboard } from "../../api/patientApi";
import { getCurrentUser } from "../../api/authApi";

const iconMap = {
    "OPD": Stethoscope,
    "IPD": Bed,
    "Pharmacy": Pill,
    "Pathology": FlaskConical,
    "Radiology": FolderGit2,
    "Consultation": Stethoscope,
    "Ambulance": Ambulance,
};

const COLORS = ["#26648E", "#4FB0C6", "#E15D44", "#542437", "#53777A", "#C02942", "#D95B43", "#ECD078"];

export default function PatientDashboardPage() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [missingPatientProfile, setMissingPatientProfile] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        stats: [],
        history: [],
        findings: [],
        symptoms: []
    });

    const fetchDashboardData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setMissingPatientProfile(false);

        let patientId = user.patient_id;

        if (!patientId && user.role === "patient") {
            try {
                const meRes = await getCurrentUser();
                const refreshed = meRes.data;
                if (refreshed?.patient_id) {
                    patientId = refreshed.patient_id;
                    setUser((prev) => (prev ? { ...prev, ...refreshed } : prev));
                }
            } catch (e) {
                console.error("Error refreshing user profile:", e);
            }
        }

        if (!patientId) {
            setMissingPatientProfile(true);
            setDashboardData({
                stats: [],
                history: [],
                findings: [],
                symptoms: []
            });
            setLoading(false);
            return;
        }

        try {
            const res = await getPatientDashboard(patientId);
            setDashboardData(res.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [user, setUser]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <PatientLayout>
                <div className="min-h-[80vh] flex items-center justify-center">
                    <Loader size={40} className="animate-spin text-indigo-600" />
                </div>
            </PatientLayout>
        );
    }

    if (missingPatientProfile) {
        return (
            <PatientLayout>
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                    <p className="text-gray-700 max-w-md">
                        Your account is not linked to a hospital patient record yet, so the dashboard cannot load.
                        If you recently registered, try logging out and back in. Otherwise, please contact reception
                        so they can link your profile.
                    </p>
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {dashboardData.stats.map(({ label, count }) => {
                        const Icon = iconMap[label] || Stethoscope;
                        return (
                            <div key={label} className="bg-white text-gray-800 rounded-lg shadow-sm flex overflow-hidden hover:shadow-md transition-shadow">
                                <div
                                    className="w-14 h-full flex items-center justify-center text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
                                >
                                    <Icon size={22} />
                                </div>
                                <div className="flex-1 p-3">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
                                    <div className="text-2xl font-bold mt-1 text-gray-800">{count}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MEDICAL HISTORY CHART */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-center text-gray-600 font-semibold mb-6">Medical History</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend iconType="rect" align="center" verticalAlign="top" height={50} />
                                <Line type="monotone" dataKey="OPD" stroke="#6046B5" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="IPD" stroke="#8A63D2" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Pharmacy" stroke="#047857" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Pathology" stroke="#991b1b" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Radiology" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Consultation" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Ambulance" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BOTTOM ANALYSIS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* FINDINGS BAR CHART */}
                    <div className="bg-white rounded-lg  shadow-lg p-6">
                        <h3 className="text-center text-gray-600 font-semibold mb-6">Top 10 Findings</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.findings} margin={{ bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        {dashboardData.findings.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* SYMPTOMS PIE CHART */}
                    <div className="bg-white rounded-lg  shadow-lg p-6">
                        <h3 className="text-center text-gray-600 font-semibold mb-6">Top 10 Symptoms</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.symptoms}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {dashboardData.symptoms.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="horizontal" align="center" verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </PatientLayout>
    );
}
