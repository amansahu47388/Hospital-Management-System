import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  updateAmbulance,
  getAmbulanceById,
} from "../../api/ambulanceApi";
import { useNotify } from "../../context/NotificationContext";

export default function EditAmbulance({ open, onClose, ambulanceId, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    yearMade: "",
    driverName: "",
    driverLicense: "",
    driverContact: "",
    vehicleType: "",
    note: "",
  });

  useEffect(() => {
    if (open && ambulanceId) {
      loadAmbulance();
    }
  }, [open, ambulanceId]);

  const loadAmbulance = async () => {
    try {
      const res = await getAmbulanceById(ambulanceId);
      const a = res.data;

      setForm({
        vehicleNumber: a.vehicle_number || "",
        vehicleModel: a.vehicle_model || "",
        yearMade: a.year_made || "",
        driverName: a.driver_name || "",
        driverLicense: a.driver_license || "",
        driverContact: a.driver_contact || "",
        vehicleType: a.vehicle_type || "",
        note: a.note || "",
      });
    } catch {
      notify("error", "Failed to load ambulance");
    }
  };

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.vehicleNumber || !form.vehicleModel || !form.vehicleType) {
      notify("error", "Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      await updateAmbulance(ambulanceId, form);
      notify("success", "Ambulance updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      notify("error", "Failed to update ambulance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 
          bg-gradient-to-b from-[#1e9af1] to-[#2196f3] text-white">
          <h2 className="text-lg font-semibold">Edit Ambulance</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Vehicle Number *" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} />
          <Input label="Vehicle Model *" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} />
          <Input label="Year Made" name="yearMade" value={form.yearMade} onChange={handleChange} />

          <Input label="Driver Name" name="driverName" value={form.driverName} onChange={handleChange} />
          <Input label="Driver License" name="driverLicense" value={form.driverLicense} onChange={handleChange} />
          <Input label="Driver Contact" name="driverContact" value={form.driverContact} onChange={handleChange} />

          <div>
            <label className="text-sm font-medium">Vehicle Type *</label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Owned">Owned</option>
              <option value="Contractual">Contractual</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={form.note}
              rows="3"
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 pb-6">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            {loading ? "Please wait..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...props} className="w-full mt-1 border rounded px-3 py-2" />
    </div>
  );
}
