import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X, Search, FileSpreadsheet, FileText, FileDown, Printer, Copy } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getMedicineDosages,
  createMedicineDosage,
  updateMedicineDosage,
  deleteMedicineDosage,
  getMedicineCategories,
  getUnits,
} from "../../../api/pharmacyApi";

export default function MedicineDosage() {
  const notify = useNotify();
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    category_name: "",
    dosage: "",
    unit: "",
  });

  useEffect(() => {
    loadData();
    fetchDropdowns();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getMedicineDosages();
      setList(res.data || []);
    } catch (err) {
      notify("error", "Failed to load medicine dosages");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [catRes, unitRes] = await Promise.all([
        getMedicineCategories(),
        getUnits(),
      ]);
      setCategories(catRes.data || []);
      setUnits(unitRes.data || []);
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

  const filteredList = useMemo(() => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item =>
      item.category_name_label?.toLowerCase().includes(term) ||
      item.dosage?.toString().toLowerCase().includes(term) ||
      item.unit_name?.toLowerCase().includes(term)
    );
  }, [list, searchTerm]);

  const save = async () => {
    if (!form.category_name || !form.dosage || !form.unit) {
      notify("error", "Category, Dosage and Unit are required");
      return;
    }

    try {
      const payload = {
        category_name: form.category_name,
        dosage: form.dosage,
        unit: form.unit,
      };

      if (form.id) {
        await updateMedicineDosage(form.id, payload);
        notify("success", "Medicine dosage updated successfully");
      } else {
        await createMedicineDosage(payload);
        notify("success", "Medicine dosage created successfully");
      }
      setOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to save medicine dosage";
      notify("error", msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dosage?")) return;
    try {
      await deleteMedicineDosage(id);
      notify("success", "Medicine dosage deleted successfully");
      loadData();
    } catch (err) {
      notify("error", "Failed to delete medicine dosage");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Medicine Dosage List</h2>
          <button
            onClick={() => {
              setForm({ id: null, category_name: "", dosage: "", unit: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
          >
            <Plus size={16} /> Add Medicine Dosage
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

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f2f2f2] text-gray-600">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Category</th>
                    <th className="px-3 py-2 font-semibold">Dosage</th>
                    <th className="px-3 py-2 font-semibold">Unit</th>
                    <th className="px-3 py-1.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-400">No records found</td>
                    </tr>
                  ) : (
                    filteredList.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 border-b">
                        <td className="px-3 py-2">{row.category_name_label}</td>
                        <td className="px-3 py-2">{row.dosage}</td>
                        <td className="px-3 py-2">{row.unit_name}</td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setForm({
                                  id: row.id,
                                  category_name: row.category_name,
                                  dosage: row.dosage,
                                  unit: row.unit
                                });
                                setOpen(true);
                              }}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
              <h3 className="text-sm font-semibold">{form.id ? "Edit Medicine Dosage" : "Add Medicine Dosage"}</h3>
              <button onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category_name}
                  onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Dosage *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.dosage}
                  onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="Dosage Value"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                >
                  <option value="">Select Unit</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.unit_name}</option>
                  ))}
                </select>
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
