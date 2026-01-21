import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { createAppointment, getDoctors } from "../../../api/appointmentApi";
import { useNotify } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";

export default function PatientAddAppointmentModal({ open, onClose, onSuccess }) {
    const { user } = useAuth();
    const notify = useNotify();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        appointment_date: '',
        specialist: '',
        doctor: '',
        shift: '',
        slot: '',
        appontmet_priority: 'normal',
        message: '',
        live_consultation: 'no',
        alternate_address: '',
    });

    useEffect(() => {
        if (open) {
            fetchDoctors();
            setFormData({
                appointment_date: '',
                specialist: '',
                doctor: '',
                shift: '',
                slot: '',
                appontmet_priority: 'normal',
                message: '',
                live_consultation: 'no',
                alternate_address: '',
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submitData = {
                ...formData,
                patient: user?.id,
                source: 'online',
                status: 'pending',
                appointment_date: new Date(formData.appointment_date).toISOString(),
                live_consultation: formData.live_consultation === 'yes',
                reason: formData.message // Mapping 'message' to 'reason' as per API
            };

            await createAppointment(submitData);
            notify("success", "Appointment saved successfully");
            onSuccess && onSuccess();
        } catch (err) {
            notify("error", "Failed to book appointment");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden animate-in zoom-in duration-200">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-4 py-3 text-white flex justify-between items-center">
                    <h2 className="text-sm font-bold uppercase tracking-wide">Add Appointment</h2>
                    <button onClick={onClose} className="hover:opacity-75"><X size={18} /></button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        {/* DATE */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Date <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none"
                            />
                        </div>

                        {/* SPECIALIST */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Specialist <span className="text-red-500">*</span></label>
                            <select
                                name="specialist"
                                value={formData.specialist}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white"
                            >
                                <option value="">Select</option>
                                <option value="Cardiologists">Cardiologists</option>
                                <option value="Gastroenterologists">Gastroenterologists</option>
                            </select>
                        </div>

                        {/* DOCTOR */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Doctor <span className="text-red-500">*</span></label>
                            <select
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white"
                            >
                                <option value="">Select</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* SHIFT */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Shift <span className="text-red-500">*</span></label>
                            <select
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white"
                            >
                                <option value="">Select</option>
                                <option value="Morning">Morning</option>
                                <option value="Evening">Evening</option>
                            </select>
                        </div>

                        {/* SLOT */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Slot <span className="text-red-500">*</span></label>
                            <select
                                name="slot"
                                value={formData.slot}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white"
                            >
                                <option value="">Select</option>
                                <option value="10:00 AM - 12:30 PM">10:00 AM - 12:30 PM</option>
                            </select>
                        </div>

                        {/* PRIORITY */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Appointment Priority</label>
                            <select
                                name="appontmet_priority"
                                value={formData.appontmet_priority}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white"
                            >
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Message <span className="text-red-500">*</span></label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* LIVE CONSULTATION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Live Consultation (On Video Conference) <span className="text-red-500">*</span></label>
                            <select
                                name="live_consultation"
                                value={formData.live_consultation}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white font-medium"
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    </div>

                    {/* ALTERNATE ADDRESS */}
                    <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Alternate Address</label>
                        <textarea
                            name="alternate_address"
                            value={formData.alternate_address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-5 py-1.5 rounded shadow-sm flex items-center gap-2 font-bold transition-all disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Check size={16} />
                            )}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
