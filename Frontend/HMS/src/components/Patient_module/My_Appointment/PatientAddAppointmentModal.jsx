import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { createAppointment, getDoctors, getShifts, getPriorities } from "../../../api/appointmentApi";
import { useNotify } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";

export default function PatientAddAppointmentModal({ open, onClose, onSuccess }) {
    const { user } = useAuth();
    const notify = useNotify();
    const [doctors, setDoctors] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        appointment_date: '',
        specialist: '',
        doctor: '',
        shift: '',
        number: '',
        appontmet_priority: '',
        reason: '',
        alternate_address: '',
    });

    useEffect(() => {
        if (open) {
            fetchInitialData();
            resetForm();
        }
    }, [open]);

    const resetForm = () => {
        setFormData({
            appointment_date: '',
            specialist: '',
            doctor: '',
            shift: '',
            number: '',
            appontmet_priority: '',
            reason: '',
        });
    };

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [doctorsRes, shiftsRes, prioritiesRes] = await Promise.all([
                getDoctors(),
                getShifts(),
                getPriorities()
            ]);

            setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
            setShifts(Array.isArray(shiftsRes.data) ? shiftsRes.data : []);
            setPriorities(Array.isArray(prioritiesRes.data) ? prioritiesRes.data : []);
        } catch (err) {
            notify("error", "Failed to load form data");
            console.error('Error fetching initial data:', err);
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
            // Get patient ID from user object
            const patientId = user?.patient_id || user?.id;

            if (!patientId) {
                notify("error", "Patient information not found");
                setSubmitting(false);
                return;
            }

            const submitData = {
                patient: patientId,
                doctor: parseInt(formData.doctor),
                appointment_date: new Date(formData.appointment_date).toISOString(),
                shift: formData.shift ? parseInt(formData.shift) : null,
                appontmet_priority: formData.appontmet_priority ? parseInt(formData.appontmet_priority) : null,
                number: formData.number || null,
                reason: formData.reason || '',
                department: formData.specialist || null,
                status: formData.status || 'pending',
                
            };

            await createAppointment(submitData);
            notify("success", "Appointment booked successfully");
            onSuccess && onSuccess();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to book appointment";
            notify("error", errorMsg);
            console.error('Appointment creation error:', err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 ">
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
                            <label className="font-semibold text-gray-600">Appointment Date <span className="text-red-500">*</span></label>
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
                            <label className="font-semibold text-gray-600">Shift</label>
                            <select
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white disabled:bg-gray-100"
                            >
                                <option value="">Select</option>
                                {shifts.map(shift => (
                                    <option key={shift.id} value={shift.id}>
                                        {shift.shift} ({shift.time_from} - {shift.time_to})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SLOT */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Mobile Number</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none"
                            />
                        </div>

                        {/* PRIORITY */}
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Appointment Priority</label>
                            <select
                                name="appontmet_priority"
                                value={formData.appontmet_priority}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white disabled:bg-gray-100"
                            >
                                <option value="">Select</option>
                                {priorities.map(priority => (
                                    <option key={priority.id} value={priority.id}>
                                        {priority.priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none bg-white disabled:bg-gray-100"
                            >
                                <option value="">Select</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                         {/* REASON */}
                    <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Reason</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-2 py-1.5 border border-gray-200 rounded focus:border-[#6046B5] outline-none resize-none"
                        ></textarea>
                    </div>
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
