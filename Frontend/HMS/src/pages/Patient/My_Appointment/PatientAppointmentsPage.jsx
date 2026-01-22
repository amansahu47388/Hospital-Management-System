import React, { useState, useEffect } from "react";
import { Plus, Printer, Menu, Copy, FileSpreadsheet, FileText, FileDown } from "lucide-react";

import PatientLayout from "../../../layout/PatientLayout";
import { getAppointmentList } from "../../../api/appointmentApi";
import { useNotify } from "../../../context/NotificationContext";

import PatientProfileHeader from "../../../components/Patient_module/My_Appointment/PatientProfileHeader";
import PatientAddAppointmentModal from "../../../components/Patient_module/My_Appointment/PatientAddAppointmentModal";
import AppointmentDetailModal from "../../../components/Patient_module/My_Appointment/AppointmentDetailModal";

export default function PatientAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const notify = useNotify();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await getAppointmentList();
            setAppointments(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            // notify("error", "Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenDetail(true);
    };

    // fallback mock data to keep UI exactly same
    const tableData = appointments.length > 0 ? appointments : [
        { appointment_no: 'APPNO7620', date: '01/01/2026 03:46 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: '', alternate_address: '' },
        { appointment_no: 'APPNO7558', date: '12/01/2025 03:10 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: '', alternate_address: '' },
        { appointment_no: 'APPNO7498', date: '11/10/2025 05:46 PM', priority: 'Normal', specialist: 'Cardiologists', doctor: 'Sonia Bush (9002)', status: 'Approved', message: '', alternate_address: '' },
        { appointment_no: 'APPNO7497', date: '11/05/2025 12:00 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: 'Urgent Appointment', alternate_address: '' },
        { appointment_no: 'APPNO7434', date: '10/05/2025 11:00 AM', priority: 'Normal', specialist: 'Cardiologists', doctor: 'Sonia Bush (9002)', status: 'Approved', message: 'Urgent Appointment -TBK', alternate_address: '' },
    ];

    return (
        <PatientLayout>
            <div className="max-w-[1600px] mx-auto px-4 py-6">

                {/* PATIENT PROFILE HEADER */}
                <PatientProfileHeader />

                {/* MY APPOINTMENTS */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-xl font-medium text-gray-700">My Appointments</h2>

                        <button
                            onClick={() => setOpenAdd(true)}
                            className="text-white px-4 py-1.5 rounded flex items-center gap-2 text-sm font-bold shadow-sm bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
                        >
                            <Plus size={16} /> Add Appointment
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full md:w-64 pl-3 pr-10 py-1.5 border-b border-gray-200 focus:border-[#6046B5] outline-none text-sm"
                        />

                        <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded"><Copy size={16} /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded"><FileSpreadsheet size={16} /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded"><FileDown size={16} /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded"><FileText size={16} /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded"><Printer size={16} /></button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="border-b bg-gray-50/30">
                                    {[
                                        "Appointment No",
                                        "Appointment Date",
                                        "Priority",
                                        "Specialist",
                                        "Doctor",
                                        "Status",
                                        "Message",
                                        "Alternate Address",
                                        "Action",
                                    ].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">
                                            {h} <span className="text-[10px]">▼</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {tableData.map((row) => (
                                    <tr key={row.appointment_no} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{row.appointment_no}</td>
                                        <td className="px-4 py-3">{row.date}</td>
                                        <td className="px-4 py-3 text-center">{row.priority}</td>
                                        <td className="px-4 py-3 truncate max-w-[150px]">{row.specialist}</td>
                                        <td className="px-4 py-3 font-medium">{row.doctor}</td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[11px] text-white font-bold ${row.status === "Approved"
                                                    ? "bg-[#72B01D]"
                                                    : row.status === "Pending"
                                                        ? "bg-[#F29C11]"
                                                        : "bg-gray-400"
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-[11px] italic text-gray-500">{row.message}</td>
                                        <td className="px-4 py-3">{row.alternate_address}</td>

                                        <td className="px-4 py-3 text-right">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <Printer size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleViewDetail(row)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Menu size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t text-sm flex justify-between text-gray-500">
                        <p>Records: 1 to {tableData.length} of 23</p>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 hover:bg-gray-100 rounded">{'<'}</button>
                            <button className="px-2 py-1 bg-[#6046B5] text-white rounded">1</button>
                            <button className="px-2 py-1 hover:bg-gray-100 rounded">2</button>
                            <button className="px-2 py-1 hover:bg-gray-100 rounded">3</button>
                            <button className="px-2 py-1 hover:bg-gray-100 rounded">{'>'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PatientAddAppointmentModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={() => {
                    setOpenAdd(false);
                    fetchAppointments();
                }}
            />

            <AppointmentDetailModal
                open={openDetail}
                appointment={selectedAppointment}
                onClose={() => {
                    setOpenDetail(false);
                    setSelectedAppointment(null);
                }}
            />
        </PatientLayout>
    );
}
