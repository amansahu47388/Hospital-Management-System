import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getCategories,
  getItems,
  getSuppliers,
  getStores,
  updateItemStock,
} from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateItemStock({ open, stock, onClose, refresh }) {
  const notify = useNotify();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);

  const [form, setForm] = useState({
    category: "",
    item: "",
    supplier: "",
    store: "",
    quantity: "",
    purchase_price: "",
    stock_date: "",
    description: "",
    document: null,
  });

  useEffect(() => {
    if (!open || !stock) return;

    Promise.all([getCategories(), getItems(), getSuppliers(), getStores()])
      .then(([c, i, s, st]) => {
        setCategories(c.data);
        setItems(i.data);
        setSuppliers(s.data);
        setStores(st.data);

        const filtered = i.data.filter(
          (x) => String(x.category) === String(stock.category)
        );
        setFilteredItems(filtered);

        setForm({
          category: stock.category,
          item: stock.item,
          supplier: stock.supplier,
          store: stock.store,
          quantity: stock.quantity,
          purchase_price: stock.purchase_price,
          stock_date: stock.stock_date,
          description: stock.description || "",
          document: null,
        });
      });
  }, [open, stock]);

  if (!open || !stock) return null;

  const handleCategoryChange = (val) => {
    setForm({ ...form, category: val, item: "" });
    const filtered = items.filter(
      (x) => String(x.category) === String(val)
    );
    setFilteredItems(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== null) fd.append(k, v);
    });

    try {
      await updateItemStock(stock.id, fd);
      notify("success", "Stock updated successfully");
      refresh();
      onClose();
    } catch {
      notify("error", "Failed to update stock");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-4xl rounded shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Update Item Stock</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ROW 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Item Category *</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Item *</label>
              <select
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="">Select</option>
                {filteredItems.map((i) => (
                  <option key={i.id} value={i.id}>{i.item_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Supplier *</label>
              <select
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="">Select</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.supplier_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Store *</label>
              <select
                value={form.store}
                onChange={(e) => setForm({ ...form, store: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
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
              <label className="text-sm font-medium">Quantity *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e)=>setForm({...form,quantity:e.target.value})}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Purchase Price *</label>
              <input
                type="number"
                value={form.purchase_price}
                onChange={(e)=>setForm({...form,purchase_price:e.target.value})}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock Date *</label>
              <input
                type="date"
                value={form.stock_date}
                onChange={(e)=>setForm({...form,stock_date:e.target.value})}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
        <label className="text-sm font-medium">Attach Document</label>

        <div className="border border-dashed rounded mt-1 p-4 text-center text-sm text-gray-500 cursor-pointer">
        <input
            type="file"
            id="docUpload"
            className="hidden"
            onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, document: file });
            }}
            />

            <label htmlFor="docUpload" className="cursor-pointer block">
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


          <div className="flex justify-end pt-3">
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded">
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
