import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X, Search, FileSpreadsheet, FileText, FileDown, Printer, Copy } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../api/pharmacyApi";

export default function Supplier() {
  const notify = useNotify();
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    supplier_name: "",
    supplier_contact: "",
    contact_person_name: "",
    contact_person_phone: "",
    drug_license_number: "",
    address: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getSuppliers();
      setList(res.data || []);
    } catch (err) {
      notify("error", "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item =>
      item.supplier_name?.toLowerCase().includes(term) ||
      item.supplier_contact?.toLowerCase().includes(term) ||
      item.contact_person_name?.toLowerCase().includes(term) ||
      item.contact_person_phone?.toLowerCase().includes(term) ||
      item.drug_license_number?.toLowerCase().includes(term) ||
      item.address?.toLowerCase().includes(term)
    );
  }, [list, searchTerm]);

  const save = async () => {
    if (!form.supplier_name.trim()) {
      notify("error", "Supplier name is required");
      return;
    }

    try {
      if (form.id) {
        await updateSupplier(form.id, form);
        notify("success", "Supplier updated successfully");
      } else {
        await createSupplier(form);
        notify("success", "Supplier created successfully");
      }
      setOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to save supplier";
      notify("error", msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      notify("success", "Supplier deleted successfully");
      loadData();
    } catch (err) {
      notify("error", "Failed to delete supplier");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Supplier List</h2>
          <button
            onClick={() => {
              setForm({
                id: null,
                supplier_name: "",
                supplier_contact: "",
                contact_person_name: "",
                contact_person_phone: "",
                drug_license_number: "",
                address: "",
              });
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
          >
            <Plus size={16} /> Add Supplier
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow shrink-0 h-fit">
            <MedicineSidebarMenu />
          </div>

          {/* TABLE CONTAINER */}
          <div className="flex-1 bg-white rounded-md shadow p-4 overflow-hidden">
            {/* Search and Icons */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-2 pr-2 py-1 border-b focus:border-[#8A63D2] outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <button className="hover:text-[#6046B5]"><Copy size={16} /></button>
                <button className="hover:text-[#6046B5]"><FileSpreadsheet size={16} /></button>
                <button className="hover:text-[#6046B5]"><FileText size={16} /></button>
                <button className="hover:text-[#6046B5]"><FileDown size={16} /></button>
                <button className="hover:text-[#6046B5]"><Printer size={16} /></button>
              </div>
            </div>

            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-xs">
                <thead className="bg-[#f2f2f2] text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Supplier Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Supplier Contact</th>
                    <th className="px-3 py-2 text-left font-semibold">Contact Person Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Contact Person Phone</th>
                    <th className="px-3 py-2 text-left font-semibold">Drug License Number</th>
                    <th className="px-3 py-2 text-left font-semibold">Address</th>
                    <th className="px-3 py-1.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-400">No records found</td>
                    </tr>
                  ) : (
                    filteredList.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 border-b">
                        <td className="px-3 py-2 align-top">{row.supplier_name}</td>
                        <td className="px-3 py-2 align-top">{row.supplier_contact}</td>
                        <td className="px-3 py-2 align-top">{row.contact_person_name}</td>
                        <td className="px-3 py-2 align-top">{row.contact_person_phone}</td>
                        <td className="px-3 py-2 align-top">{row.drug_license_number}</td>
                        <td className="px-3 py-2 align-top">{row.address}</td>
                        <td className="px-3 py-2 text-right align-top">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => { setForm(row); setOpen(true); }}
                              className="text-gray-400 hover:text-[#6046B5]"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="mt-4 text-[10px] text-gray-500">
                Records: 1 to {filteredList.length} of {filteredList.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-md my-8 overflow-hidden shadow-xl">
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
              <h3 className="text-sm font-semibold">{form.id ? "Edit Supplier" : "Add Supplier"}</h3>
              <button onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  value={form.supplier_name}
                  onChange={(e) => setForm({ ...form, supplier_name: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="Supplier Name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Contact</label>
                <input
                  value={form.supplier_contact}
                  onChange={(e) => setForm({ ...form, supplier_contact: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="Supplier Contact"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Person Name</label>
                  <input
                    value={form.contact_person_name}
                    onChange={(e) => setForm({ ...form, contact_person_name: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                    placeholder="Person Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Person Phone</label>
                  <input
                    value={form.contact_person_phone}
                    onChange={(e) => setForm({ ...form, contact_person_phone: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                    placeholder="Person Phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Drug License Number</label>
                <input
                  value={form.drug_license_number}
                  onChange={(e) => setForm({ ...form, drug_license_number: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="License Number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm h-20"
                  placeholder="Full Address"
                />
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={save}
                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-6 py-2 rounded text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
