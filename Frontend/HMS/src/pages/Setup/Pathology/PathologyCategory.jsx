import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PathologySidebarMenu from "../../../components/Setup/Pathology/PathologySidebarMenu";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getPathologyCategory,
  createPathologyCategory,
  updatePathologyCategory,
  deletePathologyCategory,
} from "../../../api/pathologyApi";

export default function PathologyCategory() {
  const [categories, setCategories] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const emptyForm = { id: null, category_name: "" };
  const [form, setForm] = useState(emptyForm);
  const [openModal, setOpenModal] = useState(false);

  const notify = useNotify();

  /* -------------------- FETCH -------------------- */
  const fetchCategories = async () => {
    setTableLoading(true);
    try {
      const res = await getPathologyCategory();
      setCategories(res.data);
    } catch {
      notify("error", "Failed to fetch categories");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* -------------------- ADD / EDIT -------------------- */
  const openAdd = () => {
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      category_name: row.category_name,
    });
    setOpenModal(true);
  };

  const saveCategory = async () => {
    if (!form.category_name.trim()) {
      notify("error", "Category name is required");
      return;
    }

    setActionLoading(true);
    try {
      if (form.id) {
        await updatePathologyCategory(form.id, {
          category_name: form.category_name,
        });
        notify("success", "Category updated successfully");
      } else {
        await createPathologyCategory({
          category_name: form.category_name,
        });
        notify("success", "Category added successfully");
      }
      setOpenModal(false);
      // Automatic Refresh
      window.location.reload();
    } catch (err) {
      notify("error", err.response?.data?.category_name?.[0] || "Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await deletePathologyCategory(id);
      notify("success", "Category deleted successfully");
      // Automatic Refresh
      window.location.reload();
    } catch {
      notify("error", "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Pathology Category</h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Pathology Category
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <PathologySidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            {tableLoading ? (
              <div className="flex justify-center items-center h-48 text-purple-600">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Category Name</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 border-b last:border-0">
                        <td className="px-3 py-2 text-left">{row.category_name}</td>
                        <td className="px-3 py-2 text-left">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(row)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-8 text-gray-400">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {form.id ? "Edit Pathology Category" : "Add Pathology Category"}
              </h2>
              <button onClick={() => setOpenModal(false)} className="hover:text-gray-200 transition">
                <X />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4">
              <label className="text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.category_name}
                onChange={(e) =>
                  setForm({ ...form, category_name: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                placeholder="Enter category name"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={saveCategory}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90 disabled:opacity-70"
              >
                {actionLoading && <Loader2 className="animate-spin" size={16} />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
