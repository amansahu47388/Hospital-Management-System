import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getExpenseDetail,
  getExpenseHeads,
  updateExpense,
} from "../../api/financeApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateExpense({
  open,
  expenseId,
  onClose,
  refresh,
}) {
  const notify = useNotify();

  const fetched = useRef(false);

  const [expenseHeads, setExpenseHeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    expense_head: "",
    name: "",
    date: "",
    amount: "",
    description: "",
  });

  // 🔹 Fetch expense data + heads
  useEffect(() => {
    if (!open || !expenseId || fetched.current) return;
    fetched.current = true;

    Promise.all([
      getExpenseHeads(),
      getExpenseDetail(expenseId),
    ])
      .then(([headsRes, expenseRes]) => {
        setExpenseHeads(headsRes.data);

        const e = expenseRes.data;
        setForm({
          expense_head: e.expense_head,
          name: e.name || "",
          date: e.date || "",
          amount: e.amount || "",
          description: e.description || "",
        });
      })
      .catch(() =>
        notify("error", "Failed to load expense details")
      );
  }, [open, expenseId]);

  // 🔁 Reset when modal closes
  useEffect(() => {
    if (!open) fetched.current = false;
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.expense_head) {
      notify("warning", "Expense head is required");
      return;
    }
    if (!form.name) {
      notify("warning", "Name is required");
      return;
    }
    if (!form.date) {
      notify("warning", "Date is required");
      return;
    }
    if (!form.amount) {
      notify("warning", "Amount is required");
      return;
    }

    setLoading(true);
    try {
      await updateExpense(expenseId, form);
      notify("success", "Expense updated successfully");
      onClose();
      refresh && refresh();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.detail || "Failed to update expense"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Update Expense</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label>Expense Head <span className="text-red-500">*</span></label>
            <select
              name="expense_head"
              value={form.expense_head}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-1"
            >
              <option value="">Select</option>
              {expenseHeads.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-1"
            />
          </div>

          <div>
            <label>Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-1"
            />
          </div>

          <div>
            <label>Amount <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-1"
            />
          </div>

          <div className="md:col-span-2">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-1"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-4 border-t border-gray-300 bg-gray-50">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
