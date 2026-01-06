import React, { useEffect, useRef, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  updateRadiologyTest,
  getRadiologyParameters,
  getRadiologyCategory,
} from "../../api/radiologyApi";
import { getHospitalCharges } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateRadiologyTest({ open, onClose, test }) {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(false);

  const [chargesList, setChargesList] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [setupParameters, setSetupParameters] = useState([]);
  const [radiologyCategory, setRadiologyCategory] = useState([]);

  const [parameters, setParameters] = useState([]);

  const [formData, setFormData] = useState({
    test_name: "",
    short_name: "",
    test_type: "",
    category: "",
    sub_category: "",
    method: "",
    report_days: "",
    charge_category: "",
    charges: "",
    tax: "",
    standard_charge: "",
    amount: "",
  });

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!open || !test) return;

    setFormData({
      test_name: test.test_name || "",
      short_name: test.short_name || "",
      test_type: test.test_type || "",
      category: test.category?.id || "",
      sub_category: test.sub_category || "",
      method: test.method || "",
      report_days: test.report_days || "",
      charge_category: test.charge_category || "",
      charges: test.charges?.id || "",
      tax: test.tax || "",
      standard_charge: test.standard_charge || "",
      amount: test.total_amount || "",
    });

    setParameters(test.parameters || []);
  }, [open, test]);

  /* ================= FETCH SETUP ================= */
  useEffect(() => {
    if (!open || hasFetchedRef.current) return;
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

        if (test?.charge_category) {
          setFilteredCharges(
            chargesRes.data.filter(
              (c) => c.charge_category === test.charge_category
            )
          );
        }
      } catch {
        notify("error", "Failed to load setup data");
      }
    };

    loadSetup();
  }, [open, notify, test]);

  if (!open || !test) return null;

  /* ================= PARAMETER HANDLING ================= */
  const addParameterRow = () =>
    setParameters([
      ...parameters,
      { parameter_id: "", parameter_name: "", reference_range: "", unit: "" },
    ]);

  const removeParameterRow = (index) =>
    setParameters(parameters.filter((_, i) => i !== index));

  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];

    if (field === "parameter_id") {
      const found = setupParameters.find(
        (p) => String(p.id) === String(value)
      );
      if (found) {
        updated[index] = {
          parameter_id: found.id,
          parameter_name: found.parameter_name,
          reference_range: found.reference_range || "",
          unit: found.unit || "",
        };
      }
    } else {
      updated[index][field] = value;
    }

    setParameters(updated);
  };

  /* ================= FORM HANDLING ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      test_name: formData.test_name,
      short_name: formData.short_name,
      test_type: formData.test_type,
      category: formData.category,
      sub_category: formData.sub_category,
      method: formData.method,
      report_days: Number(formData.report_days || 0),
      charges: formData.charges,
      tax: Number(formData.tax || 0),
      standard_charge: Number(formData.standard_charge || 0),
      total_amount: Number(formData.amount || 0),
      parameters: parameters
        .filter(
          (p) => p.parameter_name && p.reference_range && p.unit
        )
        .map((p) => ({
          parameter_name: p.parameter_name,
          reference_range: p.reference_range,
          unit: p.unit,
        })),
    };

    try {
      setLoading(true);
      await updateRadiologyTest(test.id, payload);
      notify("success", "Radiology test updated successfully");
      onClose();
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err);
      notify("error", "Update failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (standard, tax) => {
    const std = Number(standard || 0);
    const tx = Number(tax || 0);
    return +(std + (std * tx) / 100).toFixed(2);
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Update Radiology Test</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Test Name" name="test_name" value={formData.test_name} onChange={handleChange} />
              <Input label="Short Name" name="short_name" value={formData.short_name} onChange={handleChange} />
              <Input label="Test Type" name="test_type" value={formData.test_type} onChange={handleChange} />

              <Select label="Category" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select</option>
                {radiologyCategory.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </Select>

              <Input label="Sub Category" name="sub_category" value={formData.sub_category} onChange={handleChange} />
              <Input label="Method" name="method" value={formData.method} onChange={handleChange} />
            </div>

            {/* CHARGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Charge Category"
                value={formData.charge_category}
                onChange={(e) => {
                  const cat = e.target.value;
                  setFormData({ ...formData, charge_category: cat, charges: "" });
                  setFilteredCharges(
                    chargesList.filter((c) => c.charge_category === cat)
                  );
                }}
              >
                <option value="">Select</option>
                {[...new Set(chargesList.map(c => c.charge_category))].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>

              <Select
                label="Charge Name"
                value={formData.charges}
                onChange={(e) => {
                  const found = filteredCharges.find(
                    (c) => String(c.id) === String(e.target.value)
                  );

                  if (found) {
                    const total = calculateTotalAmount(
                      found.charge_amount,
                      found.tax
                    );

                    setFormData({
                      ...formData,
                      charges: found.id,
                      tax: found.tax,
                      standard_charge: found.charge_amount,
                      amount: total,
                    });
                  }
                }}
              >
                <option value="">Select</option>
                {filteredCharges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.charge_name}
                  </option>
                ))}
              </Select>

              <Input label="Tax (%)" value={formData.tax} disabled />
              <Input label="Standard Charge ($)" value={formData.standard_charge} disabled />
              <Input label="Total Amount ($)" value={formData.amount} disabled />
            </div>

            {/* PARAMETERS */}
            <div>
              <div className="grid grid-cols-12 gap-3 font-semibold text-gray-700">
                <div className="col-span-4">Parameter</div>
                <div className="col-span-4">Reference Range</div>
                <div className="col-span-3">Unit</div>
              </div>

              {parameters.map((p, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 mt-2">
                  <select
                    className="col-span-4 border px-2 py-1 rounded"
                    value={p.parameter_id || ""}
                    onChange={(e) =>
                      handleParameterChange(i, "parameter_id", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {setupParameters.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.parameter_name}
                      </option>
                    ))}
                  </select>

                  <input
                    className="col-span-4 border px-2 py-1 rounded"
                    value={p.reference_range}
                    readOnly
                  />
                  <input
                    className="col-span-3 border px-2 py-1 rounded"
                    value={p.unit}
                    readOnly
                  />

                  <button
                    type="button"
                    onClick={() => removeParameterRow(i)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addParameterRow}
                className="flex items-center gap-2 text-blue-600 mt-3"
              >
                <Plus size={16} /> Add Parameter
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
            >
              {loading ? "Updating..." : "Update Radiology Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full border px-3 py-2 rounded" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select {...props} className="w-full border px-3 py-2 rounded">
      {children}
    </select>
  </div>
);
