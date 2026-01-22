import React, { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { createRadiologyTest, getRadiologyParameters, getRadiologyCategory } from "../../api/radiologyApi";
import { getHospitalCharges } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddRadiologyTest({ open, onClose }) {
  /* ================= HOOKS ================= */
  const notify = useNotify();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [chargesList, setChargesList] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [setupParameters, setSetupParameters] = useState([]);
  const [radiologyCategory, setRadiologyCategory] = useState([]);
  const [parameters, setParameters] = useState([
    { id: Date.now(), parameter_id: "", parameter_name: "", reference_range: "", unit: "" },]);

  const [formData, setFormData] = useState({
    test_name: "",
    short_name: "",
    test_type: "",
    category: "",
    sub_category: "",
    method: "",
    report_days: "",
    charges: "",
    charge_category: "",
    tax: "",
    standard_charge: "",
    amount: "",
    parameters: "",
  });



  /* ================= FETCH SETUP DATA ================= */
  React.useEffect(() => {
    if (!open) return;

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const loadSetup = async () => {
      try {
        const [chargesRes, paramsRes, categoryRes] = await Promise.all([
          getHospitalCharges(),
          getRadiologyParameters(),
          getRadiologyCategory(),
        ]);
        setChargesList(chargesRes.data);
        setSetupParameters(paramsRes.data);
        setRadiologyCategory(categoryRes.data);
      } catch (err) {
        console.error("Failed to load setup data", err);
        notify("error", "Failed to load setup data");
      }
    };

    loadSetup();
  }, [open, notify]);

  /* ================= RESET ON CLOSE ================= */
  useEffect(() => {
    if (!open) {
      hasFetchedRef.current = false;
      setFilteredCharges([]);
      setErrors({});
    }
  }, [open]);


  useEffect(() => {
    if (!formData.standard_charge) return;

    const total = calculateTotalAmount(
      formData.standard_charge,
      formData.tax
    );

    setFormData((prev) => ({
      ...prev,
      amount: total,
    }));
  }, [formData.standard_charge, formData.tax]);





  if (!open) return null;

  /* ================= ADD PARAMETER ROW ================= */
  const addParameterRow = () => {
    setParameters([
      ...parameters,
      { id: Date.now() + Math.random(), parameter_id: "", parameter_name: "", reference_range: "", unit: "" },
    ]);
  };

  /* ================= REMOVE PARAMETER ROW ================= */
  const removeParameterRow = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  /* ================= HANDLE PARAMETER CHANGE ================= */
  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];

    // If selecting a parameter id from setup, prefill fields
    if (field === "parameter_id") {
      // value is id
      const found = setupParameters.find((p) => String(p.id) === String(value));
      if (found) {
        updated[index].parameter_id = value;
        updated[index].parameter_name = found.parameter_name;
        updated[index].reference_range = found.reference_range || "";
        updated[index].unit = found.unit || "";
        setParameters(updated);
        return;
      }
      updated[index].parameter_id = value;
      updated[index].parameter_name = "";
      setParameters(updated);
      return;
    }

    updated[index][field] = value;
    setParameters(updated);
  };



  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = {};
    if (!formData.test_name) validationErrors.test_name = "Required";
    if (!formData.short_name) validationErrors.short_name = "Required";
    if (!formData.standard_charge || Number(formData.standard_charge) <= 0)
      validationErrors.standard_charge = "Charge must be greater than 0";

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      notify("error", "Please fix validation errors");
      return;
    }

    const payload = {
      test_name: formData.test_name,
      short_name: formData.short_name,
      test_type: formData.test_type,
      category: formData.category || null,
      sub_category: formData.sub_category || "",
      method: formData.method || "",
      report_days: Number(formData.report_days),
      charges: formData.charges || null,
      tax: Number(formData.tax || 0),
      standard_charge: Number(formData.standard_charge || 0),
      total_amount: Number(formData.amount || 0),
      parameter_ids: parameters
        .filter((p) => p.parameter_id)
        .map((p) => Number(p.parameter_id)),
    };

    setLoading(true);
    try {
      await createRadiologyTest(payload);
      notify("success", "Radiology test added successfully");
      onClose();
    } catch (err) {
      console.error("CREATE RADIOLOGY ERROR:", err.response?.data || err);
      const data = err.response?.data;
      if (data && typeof data === "object") {
        // backend field errors or list
        setErrors(data);
        notify("error", "Failed to create radiology test");
      } else {
        notify("error", data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (standardCharge, tax) => {
    const charge = Number(standardCharge || 0);
    const taxPercent = Number(tax || 0);

    return +(charge + (charge * taxPercent) / 100).toFixed(2);
  };



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Test Details</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:opacity-80">
            <X />
          </button>
        </div>

        {/* FORM */}
        <form className="flex-1 overflow-y-auto" onSubmit={handleSubmit} >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Test Name"
                name="test_name"
                value={formData.test_name}
                onChange={handleChange}
                error={errors.test_name}
                required
              />
              <FormField
                label="Short Name"
                name="short_name"
                value={formData.short_name}
                onChange={handleChange}
                error={errors.short_name}
                required
              />
              <FormField
                label="Test type"
                name="test_type"
                value={formData.test_type}
                onChange={handleChange}
                error={errors.test_type}
              />
              <SelectField
                label="Category Name"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                required
              >
                <option value="">Select</option>
                {radiologyCategory.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </SelectField>

              <FormField
                label="Sub category"
                name="sub_category"
                value={formData.sub_category}
                onChange={handleChange}
                error={errors.sub_category}
              />
              <FormField
                label="Method"
                name="method"
                value={formData.method}
                onChange={handleChange}
                error={errors.method}
              />

              <SelectField
                label="Charge Category"
                name="charge_category"
                value={formData.charge_category}
                onChange={(e) => {
                  const selectedCategory = e.target.value;

                  setFormData((prev) => ({
                    ...prev,
                    charge_category: selectedCategory,
                    charges: "",          // reset charge name
                    tax: "",
                    standard_charge: "",
                    amount: "",
                  }));

                  const filtered = chargesList.filter(
                    (c) => c.charge_category === selectedCategory
                  );

                  setFilteredCharges(filtered);
                }}
                required
              >
                <option value="">Select</option>

                {[...new Set(chargesList.map(c => c.charge_category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Charge Name"
                name="charges"
                value={formData.charges}
                onChange={(e) => {
                  const chargeId = e.target.value;

                  const found = filteredCharges.find(
                    (c) => String(c.id) === String(chargeId)
                  );

                  if (found) {
                    const total = calculateTotalAmount(
                      found.charge_amount,
                      found.tax
                    );

                    setFormData((prev) => ({
                      ...prev,
                      charges: chargeId,
                      tax: found.tax,
                      standard_charge: found.charge_amount,
                      amount: total, // ✅ FINAL CALCULATED VALUE
                    }));
                  }
                }}
                required
              >
                <option value="">Select</option>

                {filteredCharges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.charge_name} - {c.charge_amount}
                  </option>
                ))}
              </SelectField>

              <FormField
                label="Tax(%)"
                name="tax"
                type="number"
                value={formData.tax}
                onChange={handleChange}
                error={errors.tax}
              />
              <FormField
                label="standard Charge($)"
                name="standard_charge"
                type="number"
                value={formData.standard_charge}
                onChange={handleChange}
                error={errors.standard_charge}
              />
              <FormField
                label="Amount($)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={errors.amount}
                disabled
              />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
            <div>
              {/* HEADER ROW */}
              <div className="grid grid-cols-12 gap-3 text-m font-semibold text-gray-700  mt-5">
                <div className="col-span-4">Test Parameter Name<span className="text-red-600">*</span></div>
                <div className="col-span-4">Reference Range<span className="text-red-600">*</span></div>
                <div className="col-span-3">Unit<span className="text-red-600">*</span></div>
              </div>

              {/* PARAMETER ROWS */}
              {parameters.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 gap-4 items-center  rounded-md  mb-3">
                  <div className="col-span-4">
                    <SelectField
                      value={row.parameter_id}
                      onChange={(e) =>
                        handleParameterChange(index, "parameter_id", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {setupParameters.map((p) => (
                        <option key={p.id} value={p.id}>{p.parameter_name}</option>
                      ))}
                    </SelectField>
                  </div>

                  {/* REFERENCE RANGE */}
                  <div className="col-span-4">
                    <FormField
                      type="text"
                      placeholder="e.g. 13 - 17"
                      value={row.reference_range}
                      onChange={(e) =>
                        handleParameterChange(index, "reference_range", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>

                  {/* UNIT */}
                  <div className="col-span-3">
                    <FormField
                      type="text"
                      placeholder="g/dL"
                      value={row.unit}
                      onChange={(e) =>
                        handleParameterChange(index, "unit", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>

                  {/* REMOVE */}
                  <div className="col-span-1 flex justify-center">
                    {parameters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParameterRow(index)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* ADD BUTTON */}
              <button
                type="button"
                onClick={addParameterRow}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded font-medium disabled:opacity-60 hover:shadow-lg transition"
            >
              {loading ? "Adding..." : "Add Pathology Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, error, required = false, className = "" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${className} w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-gray-400"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, children }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-400 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {options && options.length > 0 ? (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows = "3" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
