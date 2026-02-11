import React from 'react';
import { X, Printer } from 'lucide-react';

export default function AppointmentDetailModal({ open, onClose, appointment }) {
    if (!open || !appointment) return null;

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

    // Derived data for display
    const details = [
        { label: "Patient Name", value: appointment.patient_details?.full_name || "N/A" },
        { label: "Appointment No", value: `APPNO${appointment.id}` },
        { label: "Appointment Date", value: formatDate(appointment.appointment_date) },
        { label: "Doctor", value: appointment.doctor_details?.full_name || appointment.doctor_name || "N/A" },
        { label: "Department", value: appointment.department || "N/A" },
        { label: "Appointment Priority", value: appointment.priority_details?.priority || "Normal" },
        { label: "Shift", value: appointment.shift_details ? `${appointment.shift_details.shift} (${appointment.shift_details.time_from} - ${appointment.shift_details.time_to})` : "N/A" },
        { label: "Slot", value: appointment.slot || "N/A" },
        { label: "Phone", value: appointment.phone || appointment.patient_details?.phone || "N/A" },
        { label: "Email", value: appointment.patient_details?.email || "N/A" },
        { label: "Fees", value: appointment.fees ? `$${appointment.fees}` : "N/A" },
        { label: "Payment Mode", value: appointment.payment_mode || "N/A" },
        { label: "Status", value: appointment.status, isStatus: true },
        { label: "Source", value: appointment.source || "N/A" },
        { label: "Created At", value: formatDate(appointment.created_at) },
        { label: "Created By", value: appointment.created_by_name || "N/A" },
        { label: "Reason", value: appointment.reason || "No reason provided", isFullWidth: true },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 ">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden animate-in zoom-in duration-200">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-4 py-3 text-white flex justify-between items-center">
                    <h2 className="text-sm font-bold uppercase tracking-wide">Appointment Details</h2>
                    <div className="flex items-center gap-4">
                        <button className="hover:opacity-75"><Printer size={18} /></button>
                        <button onClick={onClose} className="hover:opacity-75"><X size={18} /></button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 text-[13px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {details.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start ${item.isFullWidth ? 'md:col-span-2' : ''}`}
                            >
                                <span className="w-1/2 font-bold text-gray-700">{item.label}</span>
                                <div className="w-1/2 text-gray-600">
                                    {item.isStatus ? (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${item.value === 'Approved' ? 'bg-[#72B01D]' : 'bg-[#F29C11]'
                                            }`}>
                                            {item.value || 'Approved'}
                                        </span>
                                    ) : (
                                        item.value
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
