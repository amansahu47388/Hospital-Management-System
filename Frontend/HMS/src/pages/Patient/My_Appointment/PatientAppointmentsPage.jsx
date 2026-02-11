import React, { useState, useEffect } from "react";
import { Plus, Printer, Menu, Copy, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import PatientLayout from "../../../layout/PatientLayout";
import { getAppointmentList } from "../../../api/appointmentApi";
import { useNotify } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";
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
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // Get patient ID from user object
            const patientId = user?.patient_id || user?.id;

            if (!patientId) {
                notify("error", "Patient information not found");
                setLoading(false);
                return;
            }

            // Fetch appointments filtered by patient ID
            const response = await getAppointmentList({ patient: patientId });
            const appointmentsData = Array.isArray(response?.data) ? response.data : [];
            setAppointments(appointmentsData);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            notify("error", "Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenDetail(true);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'approved':
                return 'bg-[#72B01D]';
            case 'pending':
                return 'bg-[#F29C11]';
            case 'cancelled':
                return 'bg-[#E74C3C]';
            case 'scheduled':
                return 'bg-[#3498DB]';
            default:
                return 'bg-gray-400';
        }
    };

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
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="w-8 h-8 border-4 border-[#6046B5] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg font-medium">No appointments found</p>
                                <p className="text-sm mt-2">Book your first appointment to get started</p>
                            </div>
                        ) : (
                            <table className="w-full text-[13px]">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-2 py-3 text-left">Appointment No</th>
                                        <th className="px-2 py-3 text-left">Appointment Date</th>
                                        <th className="px-2 py-3 text-left">Priority</th>
                                        <th className="px-2 py-3 text-left">Department</th>
                                        <th className="px-2 py-3 text-left">Doctor</th>
                                        <th className="px-2 py-3 text-left">Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {appointments.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="px-2 py-3 font-medium text-left">APPNO{row.id}</td>
                                            <td className="px-2 py-3 text-left">{formatDate(row.appointment_date)}</td>
                                            <td className="px-2 py-3 text-left">
                                                {row.priority_details?.priority || row.appontmet_priority || 'Normal'}
                                            </td>
                                            <td className="px-2 py-3 truncate max-w-[150px]">
                                                {row.department || 'N/A'}
                                            </td>
                                            <td className="px-2 py-3 font-medium text-left">
                                                {row.doctor_details?.full_name || row.doctor_name || 'N/A'}
                                            </td>

                                            <td className="px-2 py-3 text-left">
                                                <span className={`px-2 py-0.5 rounded text-[11px] text-white font-bold capitalize ${getStatusColor(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>

                                            <td className="px-2 py-3 text-right">
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
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 text-sm flex justify-between text-gray-500">
                        <p>Records: 1 to {appointments.length} of {appointments.length}</p>
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
