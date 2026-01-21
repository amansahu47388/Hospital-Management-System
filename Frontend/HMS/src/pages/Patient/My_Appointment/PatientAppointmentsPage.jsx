import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import { Plus } from "lucide-react";
import { getAppointmentList } from "../../../api/appointmentApi";
import { useNotify } from "../../../context/NotificationContext";
import PatientProfileHeader from "../../../components/Patient_module/My_Appointment/PatientProfileHeader";
import MyAppointmentsTable from "../../../components/Patient_module/My_Appointment/MyAppointmentsTable";
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
            setAppointments(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            // notify("error", "Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (appt) => {
        setSelectedAppointment(appt);
        setOpenDetail(true);
    };

    return (
        <PatientLayout>
            <div className="max-w-[1600px] mx-auto px-4 py-6">

                {/* PATIENT PROFILE HEADER */}
                <PatientProfileHeader />

                {/* MY APPOINTMENTS SECTION */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4 bg-white">
                        <h2 className="text-xl font-medium text-gray-700 font-sans">My Appointments</h2>
                        <button
                            onClick={() => setOpenAdd(true)}
                            className="text-white px-4 py-1.5 rounded flex items-center gap-2 text-sm font-bold shadow-sm transition-all bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#34A4DD]"
                        >
                            <Plus size={16} /> Add Appointment
                        </button>
                    </div>

                    <div className="p-0">
                        <MyAppointmentsTable
                            appointments={appointments}
                            loading={loading}
                            onDetail={handleViewDetail}
                        />
                    </div>
                </div>
            </div>

            {/* MODALS */}
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
                onClose={() => {
                    setOpenDetail(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
            />
        </PatientLayout>
    );
}
