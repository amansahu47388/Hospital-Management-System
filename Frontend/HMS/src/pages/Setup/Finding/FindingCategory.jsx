import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import FindingSidebarMenu from "../../../components/Setup/Finding/FindingSidebarMenu";

export default function FindingCategory() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Fever" },
    { id: 2, name: "Typhidot (or Widal Test)" },
    { id: 3, name: "Skin Problem" },
    { id: 4, name: "Bone Density Problems" },
    { id: 5, name: "Hair Problems" },
    { id: 6, name: "Eye Diseases" },
    { id: 7, name: "Nose Diseases" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [openModal, setOpenModal] = useState(false);

  const openAdd = () => {
    setForm({ id: null, name: "" });
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpenModal(true);
  };

  const saveCategory = () => {
    if (form.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === form.id ? form : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }
    setOpenModal(false);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* SIDEBAR */}
        <FindingSidebarMenu />

        {/* CONTENT */}
        <div className="lg:col-span-3">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-xl font-semibold">
              Finding Category List
            </h1>

            <button
              onClick={openAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2
              px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} />
              Add Finding Category
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2">{row.name}</td>

                    <td className="px-3 py-2">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1 rounded bg-blue-500 text-white"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => deleteCategory(row.id)}
                          className="p-1 rounded bg-red-500 text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-3 py-2 text-xs text-gray-600">
              Records: 1 to {categories.length} of {categories.length}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
          <div className="w-full max-w-lg bg-white rounded shadow">
            {/* MODAL HEADER */}
            <div
              className="flex justify-between items-center px-4 py-3 text-white rounded-t
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <h2 className="font-semibold">
                {form.id ? "Edit Finding Category" : "Add Finding Category"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4">
              <label className="text-sm font-medium">
                Finding Category <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded
                focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveCategory}
                className="px-6 py-2 text-white rounded
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
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
