import React, { useState, useEffect } from "react";
import { createAppointment, getDoctors, getShifts, getPriorities } from "../../api/appointmentApi";
import { getPatientList } from "../../api/patientApi";
import { getHospitalCharges } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddAppointmentModal({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointment_date: '',
    phone: '',
    source: 'offline',
    status: 'pending',
    shift: '',
    appontmet_priority: '',
    payment_mode: '',
    reason: '',
    department: '',
    chargeCategory: '',
    charge: '',
    fees: 0,
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchDoctors();
      fetchShifts();
      fetchPriorities();
      fetchCharges();
    }
  }, [open]);

  // Filter charges when category changes
  useEffect(() => {
    if (formData.chargeCategory) {
      const filtered = charges.filter(c => c.charge_category === formData.chargeCategory);
      setFilteredCharges(filtered);
      // Reset charge if it doesn't match new category
      if (formData.charge) {
        const currentCharge = charges.find(c => c.id == formData.charge);
        if (!currentCharge || currentCharge.charge_category !== formData.chargeCategory) {
          setFormData(prev => ({ ...prev, charge: '', fees: 0 }));
        }
      }
    } else {
      setFilteredCharges([]);
      setFormData(prev => ({ ...prev, charge: '', fees: 0 }));
    }
  }, [formData.chargeCategory, charges]);

  const fetchPatients = async () => {
    try {
      const response = await getPatientList();
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await getShifts();
      setShifts(response.data);
    } catch (err) {
      console.error('Error fetching shifts:', err);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await getPriorities();
      setPriorities(response.data);
    } catch (err) {
      console.error('Error fetching priorities:', err);
    }
  };

  const fetchCharges = async () => {
    try {
      const response = await getHospitalCharges();
      setCharges(response.data);
    } catch (err) {
      console.error('Error fetching charges:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));


    // Auto-fill fees when charge is selected
    if (name === 'charge') {
      const selectedCharge = charges.find(c => c.id.toString() === value);
      if (selectedCharge) {
        setFormData(prev => ({
          ...prev,
          fees: selectedCharge.charge_amount || 0
        }));
      }
    }
  };

  // Get unique charge categories
  const chargeCategories = [...new Set(charges.map(c => c.charge_category))].filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.patient) {
      setError('Please select a patient');
      setLoading(false);
      return;
    }
    if (!formData.doctor) {
      setError('Please select a doctor');
      setLoading(false);
      return;
    }
    if (!formData.appointment_date) {
      setError('Please select an appointment date');
      setLoading(false);
      return;
    }

    try {
      // Convert form data to match backend expectations
      const appointmentDate = new Date(formData.appointment_date);
      if (isNaN(appointmentDate.getTime())) {
        setError('Please enter a valid appointment date');
        setLoading(false);
        return;
      }

      const submitData = {
        patient: parseInt(formData.patient),
        doctor: parseInt(formData.doctor),
        appointment_date: appointmentDate.toISOString(),
        phone: formData.phone || null,
        source: formData.source,
        status: formData.status,
        shift: formData.shift ? parseInt(formData.shift) : null,
        appontmet_priority: formData.appontmet_priority ? parseInt(formData.appontmet_priority) : null,
        payment_mode: formData.payment_mode || null,
        reason: formData.reason || null,
        department: formData.department || null,
        charge: formData.charge ? parseInt(formData.charge) : null,
        fees: parseFloat(formData.fees) || 0,
      };

      console.log('Submitting appointment data:', submitData);
      const response = await createAppointment(submitData);

      notify('success', `Appointment created successfully`);

      onSuccess && onSuccess();
    } catch (err) {
      console.error('Error creating appointment:', err);
      if (err.response?.data) {
        // Handle validation errors
        const errors = err.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          setError(errorMessages);
        } else {
          setError(errors.toString());
        }
      } else {
        setError(err.message || 'Failed to create appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[70%] rounded-lg shadow-lg max-h-[90vh] overflow-y-auto mx-auto">
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">New Appointment</h2>
            <button type="button" onClick={onClose} className="text-xl font-bold">×</button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Patient *</label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Doctor *</label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
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

              <div>
                <label className="font-medium">Appointment Date *</label>
                <input
                  type="datetime-local"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Shift</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Shift</option>
                  {shifts.map(s => (
                    <option key={s.id} value={s.id}>{s.shift}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Priority</label>
                <select
                  name="appontmet_priority"
                  value={formData.appontmet_priority}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Priority</option>
                  {priorities.map(p => (
                    <option key={p.id} value={p.id}>{p.priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Payment Mode</label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
             <div>
                <label className="font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                  placeholder="Phone number"
                />
              </div>



            </div>

            {/* ROW 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                <label className="font-medium">Charge Category</label>
                <select
                  name="chargeCategory"
                  value={formData.chargeCategory}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Category</option>
                  {chargeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium">Charge Name</label>
                <select
                  name="charge"
                  value={formData.charge}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!formData.chargeCategory}
                >
                  <option value="">Select Charge</option>
                  {filteredCharges.map(c => (
                    <option key={c.id} value={c.id}>{c.charge_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Doctor Fees ($)</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className=" form-field w-full border px-3 py-2 rounded bg-gray-50"
                  step="0.01"
                  readOnly
                />
              </div>
            </div>

            {/* ROW 5 */}
            <div>
              <label className="font-medium">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                className=" form-field w-full border px-3 py-2 rounded"
                placeholder="Appointment reason"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
