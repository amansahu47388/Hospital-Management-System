import React, { useState, useEffect } from "react";
import { createAppointment, getDoctors } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { X, Calendar, Clock, User, Tag, FileText, CheckCircle2 } from "lucide-react";

export default function PatientAddAppointmentModal({ open, onClose, onSuccess }) {
    const { user } = useAuth();
    const notify = useNotify();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        doctor: '',
        appointment_date: '',
        shift: '',
        slot: '',
        appontmet_priority: 'normal',
        reason: '',
        live_consultation: false,
    });

    useEffect(() => {
        if (open) {
            fetchDoctors();
            // Reset form when modal opens
            setFormData({
                doctor: '',
                appointment_date: '',
                shift: '',
                slot: '',
                appontmet_priority: 'normal',
                reason: '',
                live_consultation: false,
            });
        }
    }, [open]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await getDoctors();
            setDoctors(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            notify("error", "Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.doctor || !formData.appointment_date) {
            notify("error", "Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const submitData = {
                ...formData,
                patient: user?.id, // Use current user ID as patient
                source: 'online',
                status: 'pending',
                appointment_date: new Date(formData.appointment_date).toISOString(),
            };

            await createAppointment(submitData);
            notify("success", "Appointment booked successfully! Waiting for approval.");
            onSuccess && onSuccess();
        } catch (err) {
            notify("error", err.response?.data?.message || "Failed to book appointment");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Book an Appointment</h2>
                            <p className="text-purple-100 text-xs">Fill in the details to schedule your visit</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DOCTOR SELECTION */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-[#6046B5]" />
                                Select Doctor <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6046B5] outline-none transition-all"
                            >
                                <option value="">Choose a doctor...</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.full_name} ({doc.department || "Consultant"})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DATE & TIME */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={16} className="text-[#6046B5]" />
                                Preferred Date & Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6046B5] outline-none transition-all"
                            />
                        </div>

                        {/* SHIFT */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Tag size={16} className="text-[#6046B5]" />
                                Preferred Shift
                            </label>
                            <select
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6046B5] outline-none transition-all"
                            >
                                <option value="">Select shift (optional)</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </select>
                        </div>

                        {/* PRIORITY */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Tag size={16} className="text-[#6046B5]" />
                                Priority Level
                            </label>
                            <select
                                name="appontmet_priority"
                                value={formData.appontmet_priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6046B5] outline-none transition-all"
                            >
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    {/* REASON */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FileText size={16} className="text-[#6046B5]" />
                            Reason for Visit
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Briefly describe your symptoms or reason for the visit..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6046B5] outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* LIVE CONSULTATION */}
                    <label className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 cursor-pointer group hover:bg-purple-100 transition-all">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                name="live_consultation"
                                checked={formData.live_consultation}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-[#6046B5] focus:ring-[#6046B5] cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-gray-800">Live Video Consultation</div>
                            <p className="text-xs text-gray-500">I would like to consult with the doctor via video call</p>
                        </div>
                    </label>

                    {/* FOOTER */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-10 py-2.5 rounded-xl shadow-lg hover:shadow-purple-200/50 hover:scale-[1.02] active:scale-95 transition-all font-bold disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle2 size={18} />
                            )}
                            {submitting ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
