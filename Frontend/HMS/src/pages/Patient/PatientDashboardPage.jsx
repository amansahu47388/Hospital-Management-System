import React from "react";
import PatientLayout from "../../layout/PatientLayout";
import {
    Stethoscope,
    Bed,
    Pill,
    FlaskConical,
    FolderGit2,
    Droplet,
    Ambulance,
    ChevronRight
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

const stats = [
    { label: "OPD", count: 11, Icon: Stethoscope },
    { label: "IPD", count: 3, Icon: Bed },
    { label: "Pharmacy", count: 14, Icon: Pill },
    { label: "Pathology", count: 9, Icon: FlaskConical },
    { label: "Radiology", count: 7, Icon: FolderGit2 },
    { label: "Consultation", count: 5, Icon: Stethoscope },
    { label: "Ambulance", count: 9, Icon: Ambulance },
];

const medicalHistoryData = [
    { year: "2023", OPD: 0, IPD: 0, Pharmacy: 0, Pathology: 0, Radiology: 0, Consultation: 0, Ambulance: 0 },
    { year: "2024", OPD: 0, IPD: 0, Pharmacy: 0, Pathology: 0, Radiology: 0, Consultation: 0, Ambulance: 0 },
    { year: "2025", OPD: 10, IPD: 2, Pharmacy: 12, Pathology: 7, Radiology: 5, Consultation: 4, Ambulance: 0 },
    { year: "2026", OPD: 1, IPD: 2, Pharmacy: 2, Pathology: 2, Radiology: 2, Consultation: 1, Ambulance: 0 },
];

const findingsData = [
    { name: "Rosacea", value: 5, fill: "#2D6A4F" },
    { name: "Stomach pain", value: 3, fill: "#34A0A4" },
    { name: "Damaged Hair", value: 3, fill: "#D4A373" },
    { name: "Heart Burn", value: 3, fill: "#6A4C93" },
    { name: "Acne", value: 2, fill: "#4CAF50" },
    { name: "Fever", value: 2, fill: "#F4A261" },
    { name: "Skin Rush", value: 1, fill: "#E9C46A" },
    { name: "Cough", value: 1, fill: "#E63946" },
];

const symptomsData = [
    { name: "Thirst", value: 35 },
    { name: "Atopic dermatitis", value: 25 },
    { name: "Feeling sad", value: 20 },
    { name: "Cramps", value: 10 },
    { name: "Bladder leakage", value: 5 },
    { name: "Abdominal pain", value: 3 },
    { name: "Asthma", value: 2 },
];

const COLORS = ["#26648E", "#4FB0C6", "#E15D44", "#542437", "#53777A", "#C02942", "#D95B43", "#ECD078"];

export default function PatientDashboardPage() {
    return (
        <PatientLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {stats.map(({ label, count, Icon }) => (
                        <div key={label} className="bg-white border text-gray-800 rounded-lg shadow-sm flex overflow-hidden hover:shadow-md transition-shadow">
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
                    ))}
                </div>

                {/* MEDICAL HISTORY CHART */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h3 className="text-center text-gray-600 font-semibold mb-6">Medical History</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={medicalHistoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                        <h3 className="text-center text-gray-600 font-semibold mb-6">Top 10 Findings</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={findingsData} margin={{ bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        {findingsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* SYMPTOMS PIE CHART */}
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                        <h3 className="text-center text-gray-600 font-semibold mb-6">Top 10 Symptoms</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={symptomsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {symptomsData.map((entry, index) => (
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
