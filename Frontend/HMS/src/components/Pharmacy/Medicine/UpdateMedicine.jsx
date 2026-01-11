import React, { useEffect, useState,useRef } from "react";
import { X, Upload } from "lucide-react";
import {getMedicineCategories,getCompanies,getMedicineGroups,getUnits,updateMedicine,} from "../../../api/pharmacyApi";
import { useNotify } from "../../../context/NotificationContext";

export default function UpdateMedicine({ open, onClose, medicine, onSuccess }) {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

 useEffect(() => {
  if (!open || !medicine) return;

  // reset every time modal opens
  hasFetchedRef.current = false;

  setFormData({
    name: medicine.name || "",
    category: medicine.category || "",
    company: medicine.company || "",
    group: medicine.group || "",
    unit: medicine.unit || "",
    composition: medicine.composition || "",
    min_level: medicine.min_level || "",
    reorder_level: medicine.reorder_level || "",
    tax: medicine.tax || "",
    box_packing: medicine.box_packing || "",
    vat_account: medicine.vat_account || "",
    rack_number: medicine.rack_number || "",
    note: medicine.note || "",
    image: null,
  });

  fetchDropdowns();
}, [open, medicine]);


  const fetchDropdowns = async () => {
    const [c1, c2, c3, c4] = await Promise.all([
      getMedicineCategories(),
      getCompanies(),
      getMedicineGroups(),
      getUnits(),
    ]);
    setCategories(c1.data);
    setCompanies(c2.data);
    setGroups(c3.data);
    setUnits(c4.data);
  };

  if (!open || !medicine) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

 const handleSubmit = async () => {
  try {
    setLoading(true);
    const fd = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") {
        fd.append(k, v);
      }
    });

    await updateMedicine(medicine.id, fd);

    notify("success", "Medicine updated");

    // reset state
    setFormData({});
    hasFetchedRef.current = false;

    onSuccess?.();
    onClose();   // close modal
  } catch (err) {
    notify("error", err.response?.data?.detail || "Update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Update Medicine Details</h2>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Input label="Medicine Name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required
          />

          <Select label="Category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          options={categories} 
          labelKey="category_name" 
          required
          />

          <Select label="Company" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
          options={companies} 
          labelKey="company_name" 
          />

          <Input label="Composition" 
          name="composition" 
          value={formData.composition} 
          onChange={handleChange} 
          />

          <Select label="Group" 
          name="group" 
          value={formData.group} 
          onChange={handleChange} 
          options={groups} 
          labelKey="group_name" 
          />

          <Select label="Unit" 
          name="unit" 
          value={formData.unit} 
          onChange={handleChange} 
          options={units} 
          labelKey="unit_name" 
          required
          />

          <Input type="number" 
          label="Min Level" 
          name="min_level" 
          value={formData.min_level} 
          onChange={handleChange} 
          />

          <Input type="number" 
          label="Reorder Level" 
          name="reorder_level" 
          value={formData.reorder_level} 
          onChange={handleChange}
          />

          <Input type="number" 
          label="Tax (%)" 
          name="tax" 
          value={formData.tax} 
          onChange={handleChange} 
          />

          <Input label="Box Packing"
           name="box_packing" 
           value={formData.box_packing} 
           onChange={handleChange} 
           required
           />

          <Input label="VAT A/C" 
          name="vat_account" 
          value={formData.vat_account} 
          onChange={handleChange} 
          />

          <Input label="Rack Number" 
          name="rack_number" 
          value={formData.rack_number} 
          onChange={handleChange} 
          />

          <div className="lg:col-span-2">
            <Input label="Note" 
            name="note" 
            value={formData.note} 
            onChange={handleChange} />
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm font-medium">Medicine Photo</label>
            <label className="mt-1 flex items-center justify-center gap-2 border border-dashed rounded-md py-3 cursor-pointer">
              <Upload size={18} />
              <span>Upload Image</span>
              <input type="file" name="image" onChange={handleChange} hidden />
              {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="preview"
                className="mt-2 w-16 h-16 object-cover rounded "
              />
            )}

            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="bg-[#6046B5] text-white px-5 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ---------- Reusable Components ---------- */

const Input = ({required, label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input {...props} className="w-full mt-1 border rounded px-3 py-2" />
  </div>
);

const Select = ({ label, required, options, labelKey, ...props }) => (
  <div>
    <label className="text-sm font-medium">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select {...props} className="w-full mt-1 border rounded px-3 py-2">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o[labelKey]}
        </option>
      ))}
    </select>
  </div>
);