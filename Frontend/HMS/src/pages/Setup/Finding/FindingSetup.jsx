import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import FindingSidebarMenu from "../../../components/Setup/Finding/FindingSidebarMenu";
import { useNotify } from "../../../context/NotificationContext";
import {
  getFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  getFindingCategories
} from "../../../api/setupApi";

export default function FindingSetup() {
  const notify = useNotify();
  const [findings, setFindings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ finding_name: "", finding_category: "", description: "" });
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchFindings();
    fetchCategories();
  }, []);

  const fetchFindings = async () => {
    try {
      setLoading(true);
      const res = await getFindings();
      setFindings(res.data);
    } catch (err) {
      notify("error", "Failed to fetch findings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getFindingCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const openAdd = () => {
    setForm({ finding_name: "", finding_category: "", description: "" });
    setIsEdit(false);
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setIsEdit(true);
    setOpenModal(true);
  };

  const saveData = async () => {
    if (!form.finding_name) {
      notify("warning", "Finding name is required");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateFinding(form.id, form);
        notify("success", "Finding updated successfully");
      } else {
        await createFinding(form);
        notify("success", "Finding created successfully");
      }
      setOpenModal(false);
      fetchFindings();
    } catch (err) {
      notify("error", "Failed to save finding");
    } finally {
      setLoading(false);
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm("Are you sure you want to delete this finding?")) {
      try {
        setLoading(true);
        await deleteFinding(id);
        notify("success", "Finding deleted successfully");
        fetchFindings();
      } catch (err) {
        notify("error", "Failed to delete finding");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Finding</h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Finding
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <FindingSidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Finding</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Loading...</td>
                  </tr>
                ) : findings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">No records found</td>
                  </tr>
                ) : (
                  findings.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                      <td className="px-3 py-2">{row.finding_name}</td>
                      <td className="px-3 py-2">{row.finding_category}</td>
                      <td className="px-3 py-2 max-w-md">{row.description}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(row)}
                            className="text-purple-600 hover:text-purple-800 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2">
          <div className="w-full max-w-xl bg-white rounded-md shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {isEdit ? "Edit" : "Add"} Finding
              </h2>
              <button
                onClick={() => setOpenModal(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finding Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Finding Name"
                  value={form.finding_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, finding_name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={form.finding_category || ""}
                  onChange={(e) =>
                    setForm({ ...form, finding_category: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={saveData}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
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
