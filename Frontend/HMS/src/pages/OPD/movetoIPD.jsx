import React, { useEffect, useRef, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { getSymptoms, getBeds, createIpdPatient } from "../../api/ipdApi";
import { getDoctors } from "../../api/appointmentApi";
import { User, Phone, Mail, MapPin, Droplet, Calendar } from "lucide-react";
import { useNotify } from "../../context/NotificationContext";

export default function MovePatientModal({ open, patient, onClose }) {
    const notify = useNotify();
    const hasFetchedRef = useRef(false);

    /* ================= STATE ================= */
    const [loading, setLoading] = useState(false);
    const [symptoms, setSymptoms] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [beds, setBeds] = useState([]);

    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        symptom_type: "",
        symptom: "",
        symptom_description: "",
        bed: "",
        admission_date: new Date().toISOString().slice(0, 16),
        allergies: "",
        previous_medical_issue: "",
        reference: "",
        credit_limit: "20000",
        old_patient: false,
        casualty: false,
        bed_type: "",
    });

    /* ================= INPUT HANDLER ================= */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* ================= HELPERS ================= */
    const update = (key, value) =>
        setFormData(prev => ({ ...prev, [key]: value }));

    const formatDateTimeLocal = (value) => {
        if (!value) return "";
        const d = new Date(value);
        return d.toISOString().slice(0, 16);
    };

    /* ================= FETCH MASTER DATA ================= */
    useEffect(() => {
        if (open) {
            (async () => {
                try {
                    const [sym, doc, bed] = await Promise.all([
                        getSymptoms(),
                        getDoctors(),
                        getBeds(),
                    ]);
                    setSymptoms(sym.data || []);
                    setDoctors(doc.data || []);
                    setBeds(bed.data || []);
                } catch (error) {
                    console.error("Error fetching master data:", error);
                }
            })();
        }
    }, [open]);

    /* ================= INITIALIZE FOR PATIENT ================= */
    useEffect(() => {
        if (patient && open) {
            setFormData(prev => ({
                ...prev,
                patient: patient.patient_detail?.id || "",
                doctor: patient.doctor_detail?.id || "",
                symptom_type: patient.symptom_type || "",
                symptom: patient.symptom || "",
                symptom_description: patient.symptom_description || "",
                allergies: patient.patient_detail?.known_allergies || "",
                reference: patient.reference || "",
                old_patient: patient.old_patient || false,
                casualty: patient.casualty || false,
                admission_date: new Date().toISOString().slice(0, 16),
            }));
        }
    }, [patient, open]);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patient || !formData.doctor) {
            notify("error", "Patient and Doctor are required");
            return;
        }

        const submitData = {
            patient: formData.patient,
            doctor: formData.doctor,
            symptom: formData.symptom || null,
            bed: formData.bed || null,
            admission_date: formData.admission_date || null,
            total_amount: 0,
            old_patient: Boolean(formData.old_patient),
            casualty: Boolean(formData.casualty),
            credit_limit: formData.credit_limit || "0",
            allergies: formData.allergies || "",
            reference: formData.reference || "",
            previous_medical_issue: formData.previous_medical_issue || "",
        };

        try {
            setLoading(true);
            await createIpdPatient(submitData);
            notify("success", "Moved to IPD Successfully");
            onClose();
        } catch (err) {
            console.error("IPD CREATE ERROR:", err.response?.data || err);
            const errMsg = err.response?.data?.detail || "Failed to move to IPD";
            notify("error", errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const patientDetail = patient?.patient_detail;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl my-8 overflow-hidden transform transition-all scale-100 flex flex-col h-fit max-h-[90vh]">
                {/* ================= HEADER ================= */}
                <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-white text-xl font-bold">Move Patient to IPD</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:opacity-80 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* ================= BODY ================= */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* LEFT COLUMN: PATIENT INFO & SYMPTOMS */}
                                <div className="lg:col-span-2 space-y-5">
                                    {/* PATIENT INFORMATION CARD */}
                                    {patientDetail && (
                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* LEFT SIDE DETAILS */}
                                                <div className="space-y-3">
                                                    <h2 className="text-2xl font-bold text-[#6046B5]">
                                                        {patientDetail?.first_name} {patientDetail?.last_name} ({patientDetail?.id})
                                                    </h2>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <User size={16} className="text-[#8A63D2]" />
                                                            <strong>Guardian:</strong> {patientDetail?.emergency_contact_name || "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <Droplet size={16} className="text-[#8A63D2]" />
                                                            <strong>Blood Group:</strong> {patientDetail?.blood_group || "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <Calendar size={16} className="text-[#8A63D2]" />
                                                            <strong>DOB:</strong> {patientDetail?.date_of_birth ? new Date(patientDetail?.date_of_birth).toLocaleDateString() : "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <Phone size={16} className="text-[#8A63D2]" />
                                                            <strong>Phone:</strong> {patientDetail?.phone || "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <strong>Age:</strong> {patientDetail?.age || "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <strong>Gender:</strong> {patientDetail?.gender || "N/A"}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <Mail size={16} className="text-[#8A63D2]" />
                                                            <strong>Email:</strong> {patientDetail?.email || "N/A"}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                                                            <MapPin size={16} className="text-[#8A63D2]" />
                                                            <strong>Address:</strong> {patientDetail?.address || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* RIGHT SIDE - PHOTO */}
                                                <div className="flex justify-end items-start">
                                                    {patientDetail?.photo ? (
                                                        <img
                                                            src={getImageUrl(patientDetail.photo)}
                                                            alt="Patient"
                                                            className="w-32 h-32 object-cover rounded-lg shadow-md border-4 border-purple-100"
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ccircle cx="50" cy="35" r="15" fill="%23999"/%3E%3Cpath d="M 20 80 Q 50 60 80 80" fill="%23999"/%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-inner border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                            <div className="text-center text-gray-400">
                                                                <span className="text-4xl">👤</span>
                                                                <p className="text-[10px] mt-1 uppercase font-bold">No Photo</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SYMPTOMS SECTION */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Symptoms Type</label>
                                            <select
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none"
                                                value={formData.symptom_type}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        symptom_type: e.target.value,
                                                        symptom: "",
                                                        symptom_description: "",
                                                    }));
                                                }}
                                            >
                                                <option value="">Select Symptoms Type</option>
                                                {[...new Set(symptoms.map(s => s.symptom_type))].map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Symptoms Title</label>
                                            <select
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none"
                                                value={formData.symptom}
                                                onChange={(e) => {
                                                    const sym = symptoms.find(s => s.id === Number(e.target.value));
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        symptom: sym.id,
                                                        symptom_description: sym.description || ""
                                                    }));
                                                }}
                                            >
                                                <option value="">Select Symptom</option>
                                                {symptoms
                                                    .filter(s => s.symptom_type === formData.symptom_type)
                                                    .map(sym => (
                                                        <option key={sym.id} value={sym.id}>
                                                            {sym.symptom_title}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="col-span-full">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Symptoms Description</label>
                                            <textarea
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-[#8A63D2] outline-none min-h-[80px]"
                                                value={formData.symptom_description}
                                                readOnly
                                                placeholder="Description will appear here..."
                                            />
                                        </div>
                                    </div>

                                    {/* ADDITIONAL DETAILS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Any Known Allergies</label>
                                            <textarea
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none min-h-[80px]"
                                                placeholder="List any known allergies..."
                                                value={formData.allergies}
                                                onChange={(e) => update("allergies", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Previous Medical Issue</label>
                                            <textarea
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none min-h-[80px]"
                                                placeholder="Previous medical issues..."
                                                value={formData.previous_medical_issue}
                                                onChange={(e) => update("previous_medical_issue", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: ADMISSION DETAILS */}
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Admission Details</h4>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Admission Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none"
                                            value={formData.admission_date}
                                            onChange={(e) => update("admission_date", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Consultant Doctor <span className="text-red-500">*</span></label>
                                        <select
                                            name="doctor"
                                            value={formData.doctor}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none bg-white"
                                            required
                                        >
                                            <option value="">Select Doctor</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Casualty</label>
                                            <select
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none bg-white"
                                                value={formData.casualty}
                                                onChange={(e) => update("casualty", e.target.value === "true")}
                                            >
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Old Patient</label>
                                            <select
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none bg-white"
                                                value={formData.old_patient}
                                                onChange={(e) => update("old_patient", e.target.value === "true")}
                                            >
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Reference</label>
                                            <input
                                                placeholder="Reference"
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none"
                                                value={formData.reference}
                                                onChange={(e) => update("reference", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Credit Limit</label>
                                            <input
                                                type="number"
                                                placeholder="Limit"
                                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none"
                                                value={formData.credit_limit}
                                                onChange={(e) => update("credit_limit", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Bed Type & Floor</label>
                                        <select
                                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none bg-white font-medium"
                                            value={formData.bed_type}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    bed_type: e.target.value,
                                                    bed: ""
                                                }));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {[...new Set(beds.filter(b => b.status === "available").map(b => `${b.bed_type} - ${b.floor || ""}`))].map(label => (
                                                <option key={label} value={label}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Bed Name</label>
                                        <select
                                            name="bed"
                                            value={formData.bed}
                                            onChange={handleInputChange}
                                            disabled={!formData.bed_type}
                                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-[#8A63D2] outline-none bg-white font-medium"
                                        >
                                            <option value="">Select</option>
                                            {beds
                                                .filter(b => b.status === "available" && `${b.bed_type} - ${b.floor || ""}` === formData.bed_type)
                                                .map(b => (
                                                    <option key={b.id} value={b.id}>
                                                        {b.bed_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:from-[#5039A3] hover:to-[#7B52C1] text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Move to IPD
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

// Helper function for image URL
function getImageUrl(photoPath) {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) return photoPath;
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl.replace('/api', '');
    const path = photoPath.startsWith('/') ? photoPath : '/' + photoPath;
    return `${baseUrl}${path}`;
}