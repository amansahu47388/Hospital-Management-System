import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../api/inventoryApi";
import { useNotify } from "../../../context/NotificationContext";

export default function ItemSupplier() {
  const notify = useNotify();

  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);

  const emptyForm = {
    id: null,
    supplier_name: "",
    phone: "",
    email: "",
    address: "",
    contact_person: "",
    contact_person_phone: "",
    contact_person_email: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */
  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch {
      notify("error", "Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* ================= SAVE ================= */
  const save = async () => {
    if (!form.supplier_name.trim()) {
      notify("error", "Supplier Name is required");
      return;
    }
    if (!form.phone.trim()) {
      notify("error", "Phone is required");
      return;
    }
    if (!form.contact_person.trim()) {
      notify("error", "Contact Person is required");
      return;
    }
    if (!form.contact_person_phone.trim()) {
      notify("error", "Contact Person Phone is required");
      return;
    }

    const payload = {
      supplier_name: form.supplier_name,
      phone: form.phone,
      contact_person: form.contact_person,
      contact_person_phone: form.contact_person_phone,
      email: form.email || "",
      address: form.address || "",
      contact_person_email: form.contact_person_email || "",
      description: form.description || "",
    };

    try {
      if (form.id) {
        await updateSupplier(form.id, payload);
        notify("success", "Supplier updated successfully");
      } else {
        await createSupplier(payload);
        notify("success", "Supplier added successfully");
      }
      setOpen(false);
      setForm(emptyForm);
      fetchSuppliers();
    } catch (err) {
      notify("error", "Supplier save failed");
      console.error("Supplier error:", err.response?.data);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      notify("success", "Supplier deleted");
      fetchSuppliers();
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Supplier List</h2>
          <button
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md
           bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
          >
            <Plus size={16} /> Add Supplier
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-64 bg-white rounded-md p-3 shadow">
            <ItemSidebarMenu />
          </div>

          <div className="flex-1 bg-white rounded-md shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Contact Person</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200">
                    <td className="px-3 py-2">{s.supplier_name}</td>
                    <td className="px-3 py-2">{s.phone}</td>
                    <td className="px-3 py-2">{s.contact_person}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm(s);
                            setOpen(true);
                          }}
                          className="text-purple-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       {/* MODAL */}
{open && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto">
    <div className="bg-white w-full max-w-2xl mt-10 rounded-sm shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
        <h2 className="text-sm font-semibold">
          {form.id ? "Edit Item Supplier" : "Add Item Supplier"}
        </h2>
        <X
          size={18}
          onClick={() => setOpen(false)}
          className="cursor-pointer"
        />
      </div>

      {/* BODY */}
      <div className="p-4 space-y-4 text-sm">
        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border px-2 py-1.5"
              value={form.supplier_name}
              onChange={(e) =>
                setForm({ ...form, supplier_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              className="w-full border px-2 py-1.5"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              className="w-full border px-2 py-1.5"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1">Contact Person Name</label>
            <input
              className="w-full border px-2 py-1.5"
              value={form.contact_person}
              onChange={(e) =>
                setForm({ ...form, contact_person: e.target.value })
              }
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block mb-1">Address</label>
          <textarea
            className="w-full border px-2 py-1.5 min-h-[60px]"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        {/* CONTACT PERSON PHONE */}
        <div>
          <label className="block mb-1">Contact Person Phone</label>
          <input
            className="w-full border px-2 py-1.5"
            value={form.contact_person_phone}
            onChange={(e) =>
              setForm({ ...form, contact_person_phone: e.target.value })
            }
          />
        </div>

        {/* CONTACT PERSON EMAIL */}
        <div>
          <label className="block mb-1">Contact Person Email</label>
          <input
            className="w-full border px-2 py-1.5"
            value={form.contact_person_email}
            onChange={(e) =>
              setForm({ ...form, contact_person_email: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-2 py-1.5 min-h-[70px]"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end px-4 py-3 border-t">
        <button
          onClick={save}
          className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm px-4 py-1.5 rounded"
        >
          ✓ Save
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </AdminLayout>
  );
}
