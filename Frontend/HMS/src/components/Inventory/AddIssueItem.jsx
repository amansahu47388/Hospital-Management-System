import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getItems,
  getCategories,
  getStores,
  getStoreStock,
  createIssueItem,
} from "../../api/inventoryApi";
import { getUsers } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function AddIssueItem({ open, onClose, onSave }) {
  const notify = useNotify();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [availableQty, setAvailableQty] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userType: "",
    issueTo: "",
    issueDate: "",
    returnDate: "",
    note: "",
    store: "",
    category: "",
    item: "",
    quantity: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!open) return;
  
    Promise.all([getUsers(), getCategories(), getStores(), getItems()])
      .then(([u, c, s, i]) => {
        setUsers(u.data || []);
        setCategories(c.data || []);
        setStores(s.data || []);
        setItems(i.data || []);
        setFilteredItems(i.data || []);
      })
      .catch((err) => {
        console.error("Failed to load form data:", err);
        notify("error", "Failed to load form data");
      });
  }, [open, notify]);
  

  if (!open) return null;

  /* ================= STORE CHANGE ================= */
  const handleStoreChange = (storeId) => {
    setForm({ ...form, store: storeId, item: "", quantity: "" });
    setAvailableQty(0);
    // Update available quantity if item is already selected
    if (form.item && storeId) {
      fetchStoreStock(form.item, storeId);
    }
  };

  /* ================= CATEGORY CHANGE ================= */
  const handleCategoryChange = (value) => {
    setForm({ ...form, category: value, item: "", quantity: "" });
    const filtered = items.filter(
      (i) => String(i.category) === String(value)
    );
    setFilteredItems(filtered);
    setAvailableQty(0);
  };

  /* ================= ITEM CHANGE ================= */
  const handleItemChange = (itemId) => {
    setForm({ ...form, item: itemId, quantity: "" });
    
    // Fetch store-specific quantity
    if (form.store && itemId) {
      fetchStoreStock(itemId, form.store);
    } else {
      setAvailableQty(0);
    }
  };

  /* ================= FETCH STORE STOCK ================= */
  const fetchStoreStock = async (itemId, storeId) => {
    try {
      const res = await getStoreStock(itemId, storeId);
      setAvailableQty(res.data?.quantity || 0);
    } catch (err) {
      console.error("Failed to fetch store stock:", err);
      setAvailableQty(0);
    }
  };

  /* ================= USER TYPE CHANGE ================= */
  const handleUserTypeChange = (role) => {
    setForm({ ...form, userType: role, issueTo: "" });
  
    const filtered = users.filter(
      (u) => u.role?.toLowerCase() === role.toLowerCase()
    );
  
    setFilteredUsers(filtered);
  };
  

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.userType ||
      !form.issueTo ||
      !form.issueDate ||
      !form.store ||
      !form.item ||
      !form.category ||
      !form.quantity
    ) {
      notify("error", "Please fill all required fields");
      return;
    }

    if (Number(form.quantity) <= 0) {
      notify("error", "Quantity must be greater than 0");
      return;
    }

    if (Number(form.quantity) > availableQty) {
      notify("error", `Not enough stock available. Available: ${availableQty}, Requested: ${form.quantity}`);
      return;
    }

    const payload = {
      user_type: form.userType,
      issued_to: Number(form.issueTo),
      issue_date: form.issueDate,
      return_date: form.returnDate || null,
      note: form.note || "",
      store: Number(form.store),
      items: [
        {
          item: Number(form.item),
          quantity: Number(form.quantity),
          category: Number(form.category),
        },
      ],
    };

    try {
      setLoading(true);
      await createIssueItem(payload);
      notify("success", "Item issued successfully");
      // Reset form
      setForm({
        userType: "",
        issueTo: "",
        issueDate: "",
        returnDate: "",
        note: "",
        store: "",
        category: "",
        item: "",
        quantity: "",
      });
      setAvailableQty(0);
      setFilteredUsers([]);
      onSave?.();
      onClose();
    } catch (err) {
      console.error("Issue failed:", err);
      const errorMsg = err.response?.data 
        ? (typeof err.response.data === 'string' 
            ? err.response.data 
            : Object.values(err.response.data).flat().join(', '))
        : "Failed to issue item. Please try again.";
      notify("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Issue Item</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="User Type *"
            value={form.userType}
            onChange={(e) => handleUserTypeChange(e.target.value)}
            options={[
              "Admin",
              "Doctor",
              "Pharmacist",
              "Pathologist",
              "Radiologist",
              "Accountant",
              "Receptionist",
              "Staff",
            ]}
          />
            <Select
              label="Issue To *"
              value={form.issueTo}
              onChange={(e) => setForm({ ...form, issueTo: e.target.value })}
              options={filteredUsers.map((u) => ({
                label: u.full_name,
                value: u.id,
              }))}
            />


          <Input label="Issued By" value={user?.full_name || "Logged In User"} disabled />

          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Issue Date *"
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            />

            <Input
              label="Return Date"
              type="date"
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            />

            <Input
              label="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <hr />

          {/* ROW 3 - Store */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Store *"
              value={form.store}
              onChange={(e) => handleStoreChange(e.target.value)}
              options={stores.map((s) => ({
                label: s.store_name,
                value: s.id,
              }))}
            />

            <Select
              label="Item Category *"
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />

            <Select
              label="Item *"
              value={form.item}
              onChange={(e) => handleItemChange(e.target.value)}
              options={filteredItems.map((i) => ({
                label: i.item_name,
                value: i.id,
              }))}
            />
          </div>

          {/* ROW 4 - Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Quantity *"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          <p className="text-sm text-gray-500">
            Available Quantity :{" "}
            <span className="font-semibold">{availableQty}</span>
          </p>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------------- UI CONTROLS ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2 mt-1" />
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select value={value} onChange={onChange} className="w-full border rounded px-3 py-2 mt-1">
        <option value="">Select</option>
        {options.map((o, i) =>
          typeof o === "string" ? (
            <option key={i}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          )
        )}
      </select>
    </div>
  );
}
