import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCategories, getItems, getSuppliers, getStores, createItemStock, } from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddItemStock({ open, onClose, refresh }) {
  const notify = useNotify();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);


  const [form, setForm] = useState({
    category: "",
    item: "",
    supplier: "",
    store: "",
    quantity: 1,
    purchase_price: "",
    stock_date: "",
    description: "",
    document: null,
  });

  useEffect(() => {
    if (!open) return;

    Promise.all([
      getCategories(),
      getItems(),
      getSuppliers(),
      getStores(),
    ]).then(([c, i, s, st]) => {
      setCategories(c.data);
      setItems(i.data);
      setFilteredItems(i.data);   // initially all
      setSuppliers(s.data);
      setStores(st.data);
    });
  }, [open]);


  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.item || !form.supplier || !form.store || !form.quantity || !form.purchase_price || !form.stock_date) {
      notify("error", "Please fill all required fields");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    try {
      const response = await createItemStock(fd);
      const message = response?.data?.message || "Item stock added successfully";
      notify("success", message);
      refresh?.();
      onClose();
    } catch (error) {
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to add item stock";
      notify("error", errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-4xl rounded shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Item Stock</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ROW 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Item Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                value={form.category}
                onChange={(e) => {
                  const categoryId = e.target.value;

                  setForm({
                    ...form,
                    category: categoryId,
                    item: "",          // reset selected item
                  });

                  const filtered = items.filter(
                    (i) => String(i.category) === String(categoryId)
                  );

                  setFilteredItems(filtered);
                }}
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Item <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
              >
                <option value="">Select</option>
                {filteredItems.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.item_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              >
                <option value="">Select</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.supplier_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Store</label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                onChange={(e) => setForm({ ...form, store: e.target.value })}
              >
                <option value="">Select</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.store_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Purchase Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2 mt-1"
                onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mt-1"
                onChange={(e) => setForm({ ...form, stock_date: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows="3"
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* FILE */}
          <div>
            <label className="text-sm font-medium">Attach Document</label>
            <div className="border border-dashed rounded mt-1 p-4 text-center text-sm text-gray-500">
              <input
                type="file"
                className="hidden"
                id="docUpload"
                onChange={(e) => setForm({ ...form, document: e.target.files[0] })}
              />
              <label htmlFor="docUpload" className="cursor-pointer">
                {form.document ? (
                  <span className="text-purple-600 font-medium">
                    📄 {form.document.name}
                  </span>
                ) : (
                  <span>Drop a file here or click</span>
                )}
              </label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
