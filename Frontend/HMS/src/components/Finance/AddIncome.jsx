import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getIncomeHeads, createIncome } from "../../api/financeApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddIncome({ open, onClose, refresh }) {
  const notify = useNotify();

  const [incomeHeads, setIncomeHeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    income_head: "",
    name: "",
    date: "",
    amount: "",
    description: "",
  });

  // Fetch income heads
  useEffect(() => {
    if (open) {
      getIncomeHeads()
        .then((res) => setIncomeHeads(res.data))
        .catch(() =>
          notify("error", "Failed to load income heads")
        );
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.income_head || !form.name || !form.amount || !form.date) {
      notify( "warning", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createIncome(form);
      notify("success","Income added successfully");
      onClose();
      refresh && refresh();
    } catch (err) {
      notify("error",
        err.response?.data?.detail || "Failed to add income"
        
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] sticky top-0 z-10">
          <h3 className="font-semibold">Add Income</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Income Head *</label>
              <select
                name="income_head"
                value={form.income_head}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">Select</option>
                {incomeHeads.map((head) => (
                  <option key={head.id} value={head.id}>
                    {head.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 z-10 flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
