import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

export default function GenerateTextModal({
  open,
  onClose,
  type = "pathology",
}) {
  const [loading, setLoading] = useState(false);

  const [parameters, setParameters] = useState([
    { name: "", range: "", unit: "" },
  ]);

  if (!open) return null;

  const title =
    type === "radiology" ? "Add Radiology Test" : "Add Pathology Test";

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleAddParameter = () => {
    setParameters([...parameters, { name: "", range: "", unit: "" }]);
  };

  const handleRemoveParameter = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[95vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="text-base sm:text-lg font-semibold">
            {title}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">

          {/* FORM GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <Input label="Test Name *" />
            <Input label="Short Name *" />
            <Input label="Test Type" />

            <Select label="Category Name *" />
            <Input label="Sub Category" />
            <Input label="Method" />

            <Input label="Report Days *" type="number" />
            <Select label="Charge Category *" />
            <Select label="Charge Name *" />

            <Input label="Tax (%)" type="number" />
            <Input label="Standard Charge ($) *" />
            <Input label="Amount ($) *" />
          </div>

          {/* PARAMETERS */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Test Parameter
            </h3>

            {parameters.map((param, index) => (
              <div
                key={index}
                className="flex flex-col lg:grid lg:grid-cols-4 gap-3 mb-3"
              >
                <input
                  value={param.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                  placeholder="Test Parameter Name"
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                />

                <input
                  value={param.range}
                  onChange={(e) =>
                    handleChange(index, "range", e.target.value)
                  }
                  placeholder="Reference Range"
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                />

                <input
                  value={param.unit}
                  onChange={(e) =>
                    handleChange(index, "unit", e.target.value)
                  }
                  placeholder="Unit"
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                />

                <div className="flex gap-2">
                  {index === parameters.length - 1 && (
                    <button
                      onClick={handleAddParameter}
                      className="flex-1 h-10 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded"
                    >
                      + Add
                    </button>
                  )}

                  {parameters.length > 1 && (
                    <button
                      onClick={() => handleRemoveParameter(index)}
                      className="h-10 px-3 bg-red-500 text-white rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 sm:px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded text-white disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
    </div>
  );
}

function Select({ label, children }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select className="border rounded px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none">
        {children || <option>Select</option>}
      </select>
    </div>
  );
}
