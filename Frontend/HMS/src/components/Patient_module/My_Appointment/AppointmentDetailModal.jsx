import React from 'react';
import { X, Printer } from 'lucide-react';

export default function AppointmentDetailModal({ open, onClose, appointment }) {
    if (!open || !appointment) return null;

    // Derived data for display
    const details = [
        { label: "Patient Name", value: appointment.patient_name || "Olivier Thomas (1)" },
        { label: "Appointment No", value: appointment.appointment_no || "APPNO7620" },
        { label: "Age", value: appointment.age || "41 Year, 8 Month, 16 Day" },
        { label: "Appointment Date", value: appointment.date || "01/01/2026 03:46 PM" },
        { label: "Gender", value: appointment.gender || "Male" },
        { label: "Appointment Priority", value: appointment.priority || "Normal" },
        { label: "Blood Group", value: appointment.blood_group || "B+" },
        { label: "Shift", value: appointment.shift || "Morning" },
        { label: "Phone", value: appointment.phone || "7896541230" },
        { label: "Slot", value: appointment.slot || "10:00 AM - 12:30 PM" },
        { label: "Email", value: appointment.email || "olivier@gmail.com" },
        { label: "Amount", value: appointment.amount || "$147.60" },
        { label: "Doctor", value: appointment.doctor || "Amit Singh (9009)" },
        { label: "Payment Mode", value: appointment.payment_mode || "Cash" },
        { label: "Department", value: appointment.department || "Doctor Department" },
        { label: "Status", value: appointment.status, isStatus: true },
        { label: "Message", value: appointment.message || "No message", isFullWidth: true },
        { label: "Live Consultation", value: appointment.live_consultation ? "Yes" : "No" },
        { label: "Transaction ID", value: appointment.transaction_id || "TRANID11667" },
        { label: "Payment Note", value: appointment.payment_note || "", isFullWidth: true },
        { label: "Source", value: appointment.source || "Offline" },
        { label: "Alternate Address", value: appointment.alternate_address || "", isFullWidth: true },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
