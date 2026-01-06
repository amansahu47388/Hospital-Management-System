import { X } from "lucide-react";
import { useState } from "react";

export default function AddIssueItemModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    userType: "",
    issueTo: "",
    issuedBy: "Super Admin",
    issueDate: "",
    returnDate: "",
    note: "",
    category: "",
    item: "",
    quantity: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white"
        >
          <h2 className="text-lg font-semibold">Add Issue Item</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="User Type *" name="userType" value={form.userType} onChange={handleChange} />
            <Select label="Issue To *" name="issueTo" value={form.issueTo} onChange={handleChange} />
            <Input label="Issued By *" name="issuedBy" value={form.issuedBy} disabled />
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Issue Date *" name="issueDate" type="date" value={form.issueDate} onChange={handleChange} />
            <Input label="Return Date" name="returnDate" type="date" value={form.returnDate} onChange={handleChange} />
            <Input label="Note" name="note" value={form.note} onChange={handleChange} />
          </div>

          <hr />

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="Item Category *" name="category" value={form.category} onChange={handleChange} />
            <Select label="Item *" name="item" value={form.item} onChange={handleChange} />
            <Input label="Quantity *" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
          </div>

          <p className="text-sm text-gray-500">
            Available Quantity : <span className="font-semibold">0</span>
          </p>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------- SMALL INPUT COMPONENTS ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      >
        <option value="">Select</option>
        <option>Doctor</option>
        <option>Nurse</option>
        <option>Pharmacist</option>
      </select>
    </div>
  );
}
