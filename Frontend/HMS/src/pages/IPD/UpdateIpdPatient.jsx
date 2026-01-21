import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIpdPatientDetail, updateIpdPatient } from "../../api/ipdApi";
import { getDoctors } from "../../api/appointmentApi";
import { getSymptoms, getBeds } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";
import { Plus, X } from "lucide-react";
import AddPatient from "../../components/PatientComponent/AddPatient";

export default function UpdateIpdPatient() {
  const { ipdId } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    symptom: "",
    symptom_type: "",
    symptom_description: "",
    appointment_date: "",
    old_patient: false,
    casualty: false,
    reference: "",
    previous_medical_issue: "",
    credit_limit: "2000",
    bed: "",
    bed_type: "",
    bed_name: "",
    case_id: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [ipdRes, docRes, symRes, bedRes] = await Promise.all([
        getIpdPatientDetail(ipdId),
        getDoctors(),
        getSymptoms(),
        getBeds(),
      ]);

      const ipd = ipdRes.data;

      setFormData({
        patient: ipd.patient || "",
        doctor: ipd.doctor || "",
        symptom: ipd.symptom || "",
        appointment_date: ipd.appointment_date || "",
        old_patient: ipd.old_patient || false,
        casualty: ipd.casualty || false,
        reference: ipd.reference || "",
        previous_medical_issue: ipd.previous_medical_issue || "",
        allergies: ipd.allergies || "",
        credit_limit: ipd.credit_limit || "",
        bed: ipd.bed?.id || "",
        symptom_type: ipd.symptom_name || "",
        symptom_description: "",
        case_id: ipd.case_id || "",
      });
      setDoctors(docRes.data);
      setSymptoms(symRes.data);
      setBeds(bedRes.data);
    } catch (err) {
      notify("Failed to load IPD data", "error");
    }
  };

  /* ================= AUTO SYMPTOM ================= */
  useEffect(() => {
    if (!formData.symptom || !symptoms.length) return;

    const s = symptoms.find(
      (x) => x.id === Number(formData.symptom)
    );

    if (s) {
      setFormData((prev) => ({
        ...prev,
        symptom_type: s.symptom_type,
        symptom_description: s.description || "",
      }));
    }
  }, [formData.symptom, symptoms]);



  /* ================= INPUT HANDLER ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const formatDateTimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toISOString().slice(0, 16);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateIpdPatient(ipdId, formData);
      notify("success", "IPD Updated Successfully");
      navigate("/admin/ipd-patients");
    } catch (err) {
      notify("error", "Update failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ================= HEADER ================= */}
        <div
          className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                      px-4 py-3 flex items-center relative">

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="bg-white text-[#6046B5]
                          px-4 py-2 text-sm rounded
                          flex items-center gap-2
                          shadow-sm hover:bg-gray-100"
            >
              <Plus size={14} /> New Patient
            </button>

            <X
              onClick={() => navigate(-1)}
              className="text-white cursor-pointer hover:opacity-80"
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-white">
          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Symptoms Type</label>
                      <select
                        className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
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
                        {/* <option value="">Symptoms Type</option> */}
                        {[...new Set(symptoms.map(s => s.symptom_type))].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>

                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Symptoms Title</label>

                      <select
                        className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
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
                        {/* <option value="">Select Symptom</option> */}
                        {symptoms
                          .filter(s => s.symptom_type === formData.symptom_type)
                          .map(sym => (
                            <option key={sym.id} value={sym.id}>
                              {sym.symptom_title}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Symptoms Description</label>
                      <textarea
                        className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.symptom_description}
                        readOnly
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Any Known Allergies</label>
                      <textarea className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        placeholder="Any Known Allergies"
                        value={formData.allergies}
                        onChange={(e) => update("allergies", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Previous Medical Issue</label>
                      <textarea className="w-full border border-gray-600 px-3 py-2 rounded text-sm" placeholder="Previous Medical Issue"
                        value={formData.previousIssue}
                        onChange={(e) => update("previousIssue", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Appointment Date</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                      value={formatDateTimeLocal(formData.appointment_date)}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          appointment_date: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Case ID</label>
                    <input
                      type="text"
                      className="w-full border border-gray-600 px-3 py-2 rounded text-sm bg-gray-100"
                      value={formData.case_id}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Consultant Doctor</label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
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
                      <label className="block text-sm font-medium mb-1">Casualty</label>
                      <select className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.casualty}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            casualty: e.target.value === "true"
                          }))
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Old Patient</label>
                      <select className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.old_patient}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            old_patient: e.target.value === "true"
                          }))
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Reference</label>
                      <input placeholder="Reference" className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.reference}
                        onChange={(e) => update("reference", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Credit Limit</label>
                      <input placeholder="credit_limit"
                        type="number"
                        name="credit_limit"
                        className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.credit_limit}
                        onChange={(e) => handleChange("credit_limit", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bed Type</label>
                      <select
                        className="w-full border px-3 py-2"
                        value={formData.bed}
                        onChange={(e) => handleChange("bed", e.target.value)}
                      >
                        {beds.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.bed_type} - ({b.floor})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Bed Name</label>
                      <select
                        className="w-full border px-3 py-2"
                        value={formData.bed}
                        onChange={(e) => handleChange("bed", e.target.value)}
                      >
                        {beds.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.bed_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="bg-gray-100 px-4 py-3 flex justify-end gap-2">
              {/* <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1.5 text-sm rounded">
              Save & Print
            </button> */}
              <button
                type="submit"
                className="px-6 py-2 rounded text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* ================= ADD PATIENT MODAL ================= */}
      <AddPatient open={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
    </div >
  );
}

