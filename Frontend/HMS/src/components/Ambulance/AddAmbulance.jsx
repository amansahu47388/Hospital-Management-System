import { useState } from "react";
import { X } from "lucide-react";

export default function AddAmbulance({ open, onClose, onSubmit }) {
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

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      onSubmit?.(form);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Ambulance</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          <Input label="Vehicle Number *" name="vehicleNumber" onChange={handleChange} />
          <Input label="Vehicle Model *" name="vehicleModel" onChange={handleChange} />
          <Input label="Year Made" name="yearMade" onChange={handleChange} />

          <Input label="Driver Name" name="driverName" onChange={handleChange} />
          <Input label="Driver License" name="driverLicense" onChange={handleChange} />
          <Input label="Driver Contact" name="driverContact" onChange={handleChange} />

          <div>
            <label className="text-sm font-medium">Vehicle Type *</label>
            <select
              name="vehicleType"
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2 focus:ring-2 focus:ring-[#6046B5]"
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
              rows="3"
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2 focus:ring-2 focus:ring-[#6046B5]"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            {loading ? "Please wait..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE INPUT ---------- */
function Input({ label, name, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        {...props}
        className="w-full mt-1 border rounded px-3 py-2 focus:ring-2 focus:ring-[#6046B5]"
      />
    </div>
  );
}
