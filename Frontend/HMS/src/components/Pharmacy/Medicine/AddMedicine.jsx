import React, { useEffect, useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import {
  getMedicineCategories,
  getCompanies,
  getMedicineGroups,
  getUnits,
  addMedicine,
} from "../../../api/pharmacyApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddMedicine({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    company: "",
    group: "",
    unit: "",
    composition: "",
    min_level: "",
    reorder_level: "",
    tax: "",
    box_packing: "",
    vat_account: "",
    rack_number: "",
    note: "",
    image: null,
  });

  // Load dropdown data ONCE
  useEffect(() => {
    if (!open || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchDropdowns();
  }, [open]);

  const fetchDropdowns = async () => {
    try {
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
    } catch {
      notify("error","Failed to load dropdown data");
    }
  };

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.unit || !formData.box_packing) {
      notify("error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          payload.append(key, value);
        }
      });

      await addMedicine(payload);
      notify("success", "Medicine added successfully");
      setFormData();
      onSuccess?.();
      onClose();
    } catch (err) {
      notify(err.response?.data ||"error", "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Medicine Details</h2>
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
