import React, { useEffect, useState } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import {
  Users,
  Calendar,
  Bed,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getDashboardData } from "../../api/dashboardApi";
import { useNotify } from "../../context/NotificationContext";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "efficiency"
  const notify = useNotify();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDashboardData();
        // StandardResponseMixin returns { data: { ... } }
        setData(res.data?.data || res.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        notify("error", "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#6046B5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Analyzing Hospital Data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, chart, appointments, stock, doctors, efficiency } = data;

  return (
    <div className="h-screen w-screen flex bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-8 thin-scrollbar animate-in fade-in duration-500">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Real-time {activeTab} of the hospital ecosystem</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === "overview" ? "text-white bg-[#6046B5] shadow-lg shadow-[#6046B5]/20" : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("efficiency")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === "efficiency" ? "text-white bg-[#6046B5] shadow-lg shadow-[#6046B5]/20" : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                Efficiency
              </button>
            </div>
          </div>

          {activeTab === "overview" ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon === 'Users' && <Users size={24} />}
                        {item.icon === 'Calendar' && <Calendar size={24} />}
                        {item.icon === 'Bed' && <Bed size={24} />}
                        {item.icon === 'DollarSign' && <DollarSign size={24} />}
                      </div>
                      <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={14} className="mr-1" />
                        +12%
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray-500 text-sm font-medium">{item.title}</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle Section: Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp size={20} className="text-[#6046B5]" />
                      Patient Registration Trend
                    </h2>
                    <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg px-3 py-1.5 outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-80 w-full min-h-[320px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={chart.labels.map((l, i) => ({ name: l, patients: chart.values[i] }))}>
                        <defs>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6046B5" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6046B5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          cursor={{ stroke: '#6046B5', strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="patients" stroke="#6046B5" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Clock size={20} className="text-orange-500" />
                      Live Appointments
                    </h2>
                    <span className="bg-orange-100 text-orange-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Coming Up</span>
                  </div>
                  <div className="space-y-4 flex-1 overflow-y-auto thin-scrollbar pr-2">
                    {appointments.map((appt, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {appt.patient_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{appt.patient_name}</h4>
                          <p className="text-xs text-gray-500 truncate">Dr. {appt.doctor_name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-bold text-[#6046B5]">{appt.date.split(' ')[1]}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${appt.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-2.5 text-sm font-semibold text-[#6046B5] bg-[#6046B5]/5 rounded-xl hover:bg-[#6046B5]/10 transition-colors">
                    View All Appointments
                  </button>
                </div>
              </div>

              {/* Bottom Section: Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Special Doctors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 font-sans">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Activity size={20} className="text-green-500" />
                      Top Active Doctors
                    </h2>
                    <button className="text-[#6046B5] text-sm font-semibold hover:underline">See Detailed Roster</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <th className="pb-4 px-2">Doctor</th>
                          <th className="pb-4 px-2">Role</th>
                          <th className="pb-4 px-2">Status</th>
                          <th className="pb-4 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {doctors.map((dr) => (
                          <tr key={dr.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#6046B5]/10 flex items-center justify-center text-[#6046B5] font-bold">
                                  {dr.name[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{dr.name}</p>
                                  <p className="text-xs text-gray-500">{dr.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-sm text-gray-600">Consultant</td>
                            <td className="py-4 px-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${dr.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dr.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                  }`}></span>
                                {dr.status}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <button className="p-2 hover:bg-gray-100 rounded-lg text-[#6046B5] transition-colors">
                                <ArrowUpRight size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Inventory */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Package size={20} className="text-red-500" />
                      Critical Stock Alerts
                    </h2>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-lg">{stock.length} Items Low</span>
                  </div>
                  <div className="space-y-4">
                    {stock.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <span className="text-sm font-bold text-red-600">{item.qty} {item.unit} left</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${Math.max((item.qty / 50) * 100, 5)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    Restock Inventory
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* Efficiency Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bed Occupancy Gauge */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                  <h3 className="text-gray-900 font-bold mb-6 w-full flex items-center gap-2">
                    <Bed size={18} className="text-blue-500" /> Bed Occupancy Rate
                  </h3>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="#F1F5F9" fill="transparent" />
                      <circle
                        cx="96" cy="96" r="88" strokeWidth="12"
                        stroke="#6046B5" strokeLinecap="round" fill="transparent"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - efficiency.bed_occupancy / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-4xl font-bold text-gray-900">{efficiency.bed_occupancy}%</p>
                      <p className="text-xs text-gray-500 font-medium">{efficiency.occupied_beds} of {efficiency.total_beds} Beds</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-8 w-full">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Available</p>
                      <p className="text-lg font-bold text-green-600">{efficiency.total_beds - efficiency.occupied_beds}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Maintenance</p>
                      <p className="text-lg font-bold text-gray-400">0</p>
                    </div>
                  </div>
                </div>

                {/* Revenue Efficiency Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 font-bold flex items-center gap-2">
                      <TrendingUp size={18} className="text-green-500" /> Revenue Growth (Last 6 Months)
                    </h3>
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold ${efficiency.revenue_growth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {efficiency.revenue_growth >= 0 ? '+' : ''}{efficiency.revenue_growth}% YoY
                    </div>
                  </div>
                  <div className="h-64 w-full min-h-[256px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={efficiency.revenue_trend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <Tooltip
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#6046B5" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Daily Appointments Avg</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{efficiency.avg_daily_appointments}</p>
                  <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%]" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">OPD to IPD Conversion</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">14.2%</p>
                  <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[45%]" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Pharmacy Fulfillment</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">98.5%</p>
                  <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%]" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Avg. Discharge Time</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">3.2 hrs</p>
                  <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
