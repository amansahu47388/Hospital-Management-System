import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  updateHospitalCharge,
  getChargeTypes,
  getChargeCategories,
  getChargeUnits,
  getTaxCategories,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function UpdateCharges({ open, onClose, data, refresh }) {
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

  // 🔹 Prefill form + dropdowns
  useEffect(() => {
    if (!open || !data) return;

    setForm({
      charge_type: data.charge_type,
      charge_category: data.charge_category,
      unit: data.unit,
      charge_name: data.charge_name,
      tax_percentage: data.tax,
      charge_amount: data.charge_amount,
      charge_description: data.charge_description,
    });

    Promise.all([
      getChargeTypes(),
      getChargeCategories(),
      getChargeUnits(),
      getTaxCategories(),
    ]).then(([t, c, u, tx]) => {
      setLists({
        types: t.data || [],
        categories: c.data || [],
        units: u.data || [],
        taxes: tx.data || [],
      });
    });
  }, [open, data]);

  if (!open || !data) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTaxChange = (e) => {
    const taxId = e.target.value;
    const selected = lists.taxes.find((t) => t.id === Number(taxId));

    setForm((prev) => ({
      ...prev,
      tax_id: taxId,
      tax_percentage: selected ? selected.tax_percentage : "",
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
      tax: form.tax_percentage || 0,
      charge_amount: form.charge_amount,
      charge_description: form.charge_description,
    };

    setLoading(true);
    try {
      await updateHospitalCharge(data.id, payload);
      notify("success", "Charge updated successfully");
      onClose();
      refresh?.();
    } catch (err) {
      notify("error", "Update failed");
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
          <h3 className="font-semibold">Update Charges</h3>
          <button onClick={onClose}><X /></button>
        </div>

       {/* BODY (UI SAME AS ADD) */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex flex-col gap-1">
            <label className="font-medium">Charge Type</label>
            <select
            name="charge_type"
            value={form.charge_type}
            onChange={handleChange}
            className="border p-2 rounded"
            >
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
            <select
            name="charge_category"
            value={form.charge_category}
            onChange={handleChange}
            className="border p-2 rounded"
            >
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
            value={form.charge_name}
            onChange={handleChange}
            className="border p-2 rounded"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="font-medium">Unit</label>
            <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="border p-2 rounded"
            >
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
            readOnly
            value={form.tax_percentage}
            className="border p-2 rounded bg-gray-100"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="font-medium">Amount</label>
            <input
            name="charge_amount"
            value={form.charge_amount}
            onChange={handleChange}
            className="border p-2 rounded"
            />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-medium">Description</label>
            <textarea
            name="charge_description"
            value={form.charge_description}
            onChange={handleChange}
            className="border p-2 rounded"
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
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
