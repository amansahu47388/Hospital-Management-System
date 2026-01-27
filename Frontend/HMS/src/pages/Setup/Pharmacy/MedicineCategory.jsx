import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X, Search, FileSpreadsheet, FileText, FileDown, Printer, Copy } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getMedicineCategories,
  createMedicineCategory,
  updateMedicineCategory,
  deleteMedicineCategory,
} from "../../../api/pharmacyApi";

export default function MedicineCategory() {
  const notify = useNotify();
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({ id: null, category_name: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getMedicineCategories();
      setList(res.data || []);
    } catch (err) {
      notify("error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item =>
      item.category_name?.toLowerCase().includes(term)
    );
  }, [list, searchTerm]);

  const handleSave = async (isEdit) => {
    if (!form.category_name.trim()) {
      notify("error", "Category name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateMedicineCategory(form.id, { category_name: form.category_name });
        notify("success", "Category updated successfully");
      } else {
        await createMedicineCategory({ category_name: form.category_name });
        notify("success", "Category created successfully");
      }
      setOpenAdd(false);
      setOpenEdit(false);
      setForm({ id: null, category_name: "" });
      loadData();
    } catch (err) {
      const msg = err.response?.data?.category_name || "Failed to save category";
      notify("error", msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteMedicineCategory(id);
      notify("success", "Category deleted successfully");
      loadData();
    } catch (err) {
      notify("error", "Failed to delete category");
    }
  };

  const openAddModal = () => {
    setForm({ id: null, category_name: "" });
    setOpenAdd(true);
  };

  const openEditModal = (row) => {
    setForm(row);
    setOpenEdit(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Medicine Category List</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
          >
            <Plus size={16} /> Add Medicine Category
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
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f2f2f2] text-gray-600">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Category Name</th>
                    <th className="px-3 py-1.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-gray-400">No records found</td>
                    </tr>
                  ) : (
                    filteredList.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 border-b">
                        <td className="px-3 py-2">{cat.category_name}</td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEditModal(cat)}
                              className="text-gray-400 hover:text-[#6046B5]"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
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

      {/* ADD/EDIT MODAL */}
      {(openAdd || openEdit) && (
        <Modal
          title={openEdit ? "Edit Medicine Category" : "Add Medicine Category"}
          onClose={() => { setOpenAdd(false); setOpenEdit(false); }}
        >
          <input
            type="text"
            placeholder="Category Name"
            value={form.category_name}
            onChange={(e) => setForm({ ...form, category_name: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave(openEdit)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-5 py-2 rounded text-sm transition-colors"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-md overflow-hidden shadow-xl">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
