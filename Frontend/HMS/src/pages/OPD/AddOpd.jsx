import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Search } from "lucide-react";
import AddPatient from "../../components/PatientComponent/AddPatient";
import { getPatientDetail, searchPatient } from "../../api/patientApi";
import { getSymptoms, getHospitalCharges, createOpdPatient } from "../../api/opdApi";
import { getDoctors } from "../../api/appointmentApi";
import {User,Phone,Mail,MapPin,Droplet,Calendar} from "lucide-react";
import { useNotify } from "../../context/NotificationContext";    


export default function AddOpd() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const hasFetchedRef = useRef(false);

  /* ================= STATES ================= */
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [patientDetail, setPatientDetail] = useState(null);
  const [isPatientDetailLoading, setIsPatientDetailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const [symptoms, setSymptoms] = useState([]);
  const [charges, setCharges] = useState([]);
  const [doctors, setDoctors] = useState([]);


  /* ================= FORM DATA ================= */
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    symptoms: "",
    charge_category: "",
    appointment_date: "",
    discount: 0,
    paid_amount: 0,
    payment_mode: "",
    allergies: "",
    old_patient: false,
    casualty: false,
    reference: "",
    previous_medical_issue: "",
  });
  

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= PATIENT SEARCH ================= */
  useEffect(() => {
    if (!search || isSelecting) return;
  
    const timer = setTimeout(async () => {
      try {
        const res = await searchPatient(search);
        setPatientList(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Patient search failed", err);
      }
    }, 300);
  
    return () => clearTimeout(timer);
  }, [search, isSelecting]);
  
  const handleSelectPatient = async (p) => {
    setIsSelecting(true);
  
    setSelectedPatient({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
    });
  
    setFormData(prev => ({ ...prev, patient: p.id }));
    setSearch(`${p.first_name} ${p.last_name}`);
    setPatientList([]);
    setShowDropdown(false);
  
    try {
      const res = await getPatientDetail(p.id);
      setPatientDetail(res.data);   // ✅ STORE FULL DETAILS
    } catch (err) {
      console.error("Failed to fetch patient detail", err);
    }
  
    setTimeout(() => setIsSelecting(false), 0);
  };
  
  



  const filteredPatients = patientList;

  /* ================= FETCH SETUP DATA ================= */
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    const loadData = async () => {
      const [symRes, chargeRes, docRes] = await Promise.all([
        getSymptoms(),
        getHospitalCharges(),
        getDoctors(),
      ]);

      setSymptoms(symRes.data);
      setCharges(chargeRes.data);
      setDoctors(docRes.data);
    };
    loadData();
  }, []);


  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault(); // 🚨 THIS FIXES BROKEN PIPE

  if (!formData.patient || !formData.doctor) {
    alert("Patient and Doctor are required");
    return;
  }

  const submitData = {
    patient: formData.patient,
    doctor: formData.doctor,
    symptom: formData.symptom || null,
    appointment_date: formData.appointment_date || null,
    discount: Number(formData.discount || 0),
    total_amount: Number(formData.total_amount || 0),
    paid_amount: Number(formData.paid_amount || 0),
    payment_mode: formData.payment_mode.toLowerCase(),
    old_patient: Boolean(formData.old_patient),
    casualty: Boolean(formData.casualty),
    allergies: formData.allergies || "",
    reference: formData.reference || "",
    previous_medical_issue: formData.previous_medical_issue || "",
  };

  try {
    setLoading(true);
    await createOpdPatient(submitData);
    notify("success", "OPD Created Successfully");
    navigate("/admin/opd-patients", { replace: true });
  } catch (err) {
    console.error("OPD CREATE ERROR:", err.response?.data || err);
    notify("error", "Failed to create OPD");
  } finally {
    setLoading(false);
  }
};

  
  const calculateTotal = (charge, tax, discount) => {
    const taxAmount = (Number(charge) * Number(tax)) / 100;
    const discountAmount = (Number(charge) * Number(discount)) / 100;
    return Number(charge) + taxAmount - discountAmount;
  };

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};


  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ================= HEADER ================= */}
        <div
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D
                      px-4 py-3 flex items-center relative"
          >
            {/* LEFT: Search */}
            <div className="relative w-full max-w-md" ref={dropdownRef}>
              <div className="flex items-center bg-white rounded-md
                              border border-gray-300
                              focus-within:ring-2 focus-within:ring-[#8A63D2]">
                <Search size={16} className="ml-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder="Search patient by name or ID..."
                  className="w-full px-3 py-2 text-sm outline-none rounded-md"
                />
              </div>

              {showDropdown && patientList.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1
                                bg-white border border-gray-200
                                rounded-md shadow-lg
                                max-h-60 overflow-y-auto z-50">
                  {patientList.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className="px-4 py-2 text-sm cursor-pointer
                                flex justify-between hover:bg-[#F3EEFF]"
                    >
                      <span>{p.first_name} {p.last_name}</span>
                      <span className="text-xs text-gray-400">#{p.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT ACTIONS */}
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

            {/* PATIENT INFORMATION CARD */}
          {patientDetail && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT SIDE DETAILS */}
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">
                {patientDetail?.first_name} {patientDetail?.last_name} ({patientDetail?.id})
                </h2>

                <p className="flex items-center gap-2 text-gray-700">
                  <User size={18} />
                  <strong>Guardian Name:</strong> {patientDetail?.emergency_contact_name || "N/A"}
                </p>

                <p className="flex items-center gap-4 text-gray-700">
                  <Droplet size={18} />
                  <strong>Blood Group:</strong> {patientDetail?.blood_group || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Calendar size={18} />
                  <strong>Date of Birth:</strong> {patientDetail?.date_of_birth ? new Date(patientDetail?.date_of_birth).toLocaleDateString() : "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} /> 
                  <strong>Patient Phone:</strong> {patientDetail?.phone || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} /> 
                  <strong>Guardian Phone:</strong> {patientDetail?.emergency_contact_phone || "N/A"}
                </p>

                <p>
                  <strong>Age (Years):</strong> {patientDetail?.age || "N/A"} 
                </p>

                <p>
                  <strong>Gender:</strong> {patientDetail?.gender || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} /> 
                  <strong>Email:</strong> {patientDetail?.email || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} /> 
                  <strong>Address:</strong> {patientDetail?.address || "N/A"}
                </p>
              </div>
              {/* RIGHT SIDE - PHOTO */}
              <div className="flex justify-end items-start">
                {patientDetail?.photo ? (
                  <div className="text-center">
                    <img
                      src={getImageUrl(patientDetail.photo)}
                      alt="Patient"
                      className="w-32 h-32 object-cover  shadow-md"
                      onError={(e) => {
                        console.error("Image failed to load from:", e.target.src);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ccircle cx="50" cy="35" r="15" fill="%23999"/%3E%3Cpath d="M 20 80 Q 50 60 80 80" fill="%23999"/%3E%3C/svg%3E';
                      }}
                    />
                    </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300  shadow-md border-4 border-purple-200 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl">👤</span>
                      <p className="text-gray-500 text-xs mt-1">No Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
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
                        <option value="">Symptoms Type</option>
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
                  <label className="block text-sm font-medium mb-1">Case id</label>
                  <input placeholder="Case id" className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                   value={formData.case_id}
                   onChange={(e) => update("case_id", e.target.value)}
                   />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consultant Doctor</label>
                  <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
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
                <div>
                  <label className="block text-sm font-medium mb-1">Reference</label>
                  <input placeholder="Reference" className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                   value={formData.reference}
                   onChange={(e) => update("reference", e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div> 
                  <label className="block text-sm font-medium mb-1">Charge Category</label>
                  <select
                    className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                    value={formData.charge_category}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        charge_category: e.target.value,
                        charge_id: "",
                        charge_amount: 0,
                        tax: 0,
                        totalAmount: 0,
                      }));
                    }}
                  >
                    <option value="">Charge Category</option>
                    {[...new Set(charges.map(c => c.charge_category))].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Charge name</label>
                      <select
                        className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                        value={formData.charge_id}
                        onChange={(e) => {
                          const charge = charges.find(c => c.id === Number(e.target.value));
                          if (!charge) return;

                          const total = calculateTotal(
                            charge.charge_amount,
                            charge.tax,
                            formData.discount
                          );

                          setFormData(prev => ({
                            ...prev,
                            charge_id: charge.id,
                            charge_amount: charge.charge_amount,
                            tax: charge.tax,
                            total_amount: total,
                          }));
                        }}
                      >
                        <option value="">Select Charge</option>
                        {charges
                          .filter(c => c.charge_category === formData.charge_category)
                          .map(charge => (
                            <option key={charge.id} value={charge.id}>
                              {charge.charge_name}
                            </option>
                          ))}
                      </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1"> Charge Amount($)</label>
                  <input type="number" disabled className="w-full border border-gray-600 px-3 py-2 rounded text-sm bg-gray-100"
                   value={formData.charge_amount}
                   onChange={(e) => update("charge_amount", e.target.value)}
                   />
                  </div>
                  <div>   
                    <label className="block text-sm font-medium mb-1">Tax %</label> 
                    <input disabled type="number" className="w-full border border-gray-600 px-3 py-2 rounded text-sm bg-gray-100" placeholder="Tax %"
                     value={formData.tax}
                     onChange={(e) => update("tax", e.target.value)}
                     />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                      <label className="block text-sm font-medium mb-1">Payment Mode</label>
                      <select className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                      value={formData.payment_mode}
                      // onChange={(e) => update("payment_mode", e.target.value)}
                      onChange={handleInputChange}
                      name="payment_mode"
                      >
                        <option value="">Select payment Mode</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="upi">UPI</option>
                        <option value="transfer to bank account">Transfer To Bank Account</option>
                        <option value="card">Card</option>
                        <option value="other">Other</option>
                      </select>
                  </div> 

                  <div>
                  <label className="block text-sm font-medium mb-1">Discount %</label>
                     <input
                      type="number"
                      className="w-full border border-gray-600 px-3 py-2 rounded text-sm"
                      placeholder="Discount %"
                      value={formData.discount}
                      onChange={(e) => {
                        const discount = Number(e.target.value || 0);

                        const total = calculateTotal(
                          formData.charge_amount,
                          formData.tax,
                          discount
                        );

                        setFormData(prev => ({
                          ...prev,
                          discount,
                          total_amount: total,
                        }));
                      }}
                    />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                 <div>  
                  <label className="block text-sm font-medium mb-1">Total Amount ($)</label>
                  <input type="number" className="w-full border border-gray-600 px-3 py-2 rounded text-sm" placeholder="Total Amount ($)"
                   value={formData.total_amount}
                   onChange={(e) => update("total_amount", e.target.value)}
                   />  
                 </div>
                  <div>  
                    <label className="block text-sm font-medium mb-1">Paid Amount ($)</label>
                    <input type="number" className="w-full border border-gray-600 px-3 py-2 rounded text-sm" placeholder="Paid Amount ($)"
                     value={formData.paid_amount}
                     onChange={(e) => update("paid_amount", e.target.value)}
                     />
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
              className="px-6 py-2 rounded text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
          </form>
        </main>
      </div>

      {/* ================= ADD PATIENT MODAL ================= */}
      <AddPatient open={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
    </div>
  );
}


// Add this helper function at the bottom before export
function getImageUrl(photoPath) {
  if (!photoPath) return null;
  
  // If it's already a full URL
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace('/api', ''); 
  
  // Ensure path starts with /
  const path = photoPath.startsWith('/') ? photoPath : '/' + photoPath;
  
  const fullUrl = `${baseUrl}${path}`;
  console.log('Generated image URL:', fullUrl);
  return fullUrl;
}