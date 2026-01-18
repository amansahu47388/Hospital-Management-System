import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createHospitalCharge,
  getChargeTypes,
  getChargeCategories,
  getChargeUnits,
  getTaxCategories,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddCharges({ open, onClose, refresh }) {
  const notify = useNotify();

  const [form, setForm] = useState({
    charge_type: "",
    charge_category: "",
    unit: "",
    charge_name: "",
    tax_id: "",
    tax_percentage: "",
    charge_amount: "",
    charge_description: "",
  });

  const [lists, setLists] = useState({
    types: [],
    categories: [],
    units: [],
    taxes: [],
  });

  const [loading, setLoading] = useState(false);

  // 🔹 FETCH DROPDOWNS
  useEffect(() => {
    if (!open) return;

    const fetchDropdowns = async () => {
      try {
        const [typesRes, catRes, unitRes, taxRes] = await Promise.all([
          getChargeTypes(),
          getChargeCategories(),
          getChargeUnits(),
          getTaxCategories(),
        ]);

        console.log("Types:", typesRes.data);
        console.log("Categories:", catRes.data);
        console.log("Units:", unitRes.data);
        console.log("Taxes:", taxRes.data);

        setLists({
          types: Array.isArray(typesRes.data) ? typesRes.data : [],
          categories: Array.isArray(catRes.data) ? catRes.data : [],
          units: Array.isArray(unitRes.data) ? unitRes.data : [],
          taxes: Array.isArray(taxRes.data) ? taxRes.data : [],
        });
      } catch (err) {
        console.error(err);
        notify("error", "Failed to load dropdown data");
      }
    };

    fetchDropdowns();
  }, [open]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleTaxChange = (e) => {
  const taxId = e.target.value;

  const selectedTax = lists.taxes.find(
    (t) => t.id === Number(taxId)
  );

  setForm((prev) => ({
    ...prev,
    tax_id: taxId,
    tax_percentage: selectedTax ? selectedTax.tax_percentage : "",
  }));
};


  const handleSubmit = async () => {
  if (!form.charge_name || !form.charge_amount) {
    notify("warning", "Required fields missing");
    return;
  }

  const payload = {
    charge_name: form.charge_name,
    charge_type: form.charge_type,
    charge_category: form.charge_category,
    unit: form.unit,
    tax: form.tax_percentage || 0,   // ✅ IMPORTANT
    charge_amount: form.charge_amount,
    charge_description: form.charge_description,
  };

  setLoading(true);
  try {
    await createHospitalCharge(payload);
    notify("success", "Charge added successfully");
    onClose();
    refresh?.();
  } catch (err) {
    console.error(err);
    notify(
      "error",
      err.response?.data?.charge_name?.[0] ||
      err.response?.data?.tax?.[0] ||
      "Failed to add charge"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="w-full max-w-5xl bg-white rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Charges</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Charge Type</label>
            <select name="charge_type" onChange={handleChange} className="border p-2 rounded">
            <option value="">Select</option>
            {lists.types.map((t) => (
              <option key={t.id} value={t.charge_type}>
                {t.charge_type}
              </option>
            ))}
          </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Charge Category</label>
            <select name="charge_category" onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              {lists.categories.map((c) => (
                <option key={c.id} value={c.category_name}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Charge Name</label>
            <input
              name="charge_name"
              placeholder="Charge Name *"
              onChange={handleChange}
              className="border p-2 rounded"
          />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Unit</label>
            <select name="unit" onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              {lists.units.map((u) => (
                <option key={u.id} value={u.unit_type}>
                  {u.unit_type}
          </option>
            ))}
          </select>
          </div>

            <div className="flex flex-col gap-1">
            <label className="font-medium">Tax Category</label>
            <select
              name="tax_id"
              value={form.tax_id}
              onChange={handleTaxChange}
              className="border p-2 rounded"
            >
              <option value="">Select Tax</option>
              {lists.taxes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tax_name}
                </option>
              ))}
            </select>
          </div>


         <div className="flex flex-col gap-1">
        <label className="font-medium">Tax Percent (%)</label>
        <input
          type="number"
          value={form.tax_percentage}
          readOnly
          className="border p-2 rounded bg-gray-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Amount</label>
          <input
        name="charge_amount"
        placeholder="Amount *"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      </div>
         
      <div className="flex flex-col gap-1">
        <label className="font-medium">Description</label>
        <textarea
            name="charge_description"
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
            placeholder="Description"
          />
      </div>
      </div>

        {/* FOOTER */}
        <div className="flex justify-end p-4 border-t">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
