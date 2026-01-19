import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import FindingSidebarMenu from "../../../components/Setup/Finding/FindingSidebarMenu";

export default function FindingSetup({ page = "finding" }) {
  const isFinding = page === "finding";

  /* ---------------- FINDING ---------------- */
  const [findings, setFindings] = useState([
    {
      id: 1,
      name: "Stomach pain",
      category: "Typhidot (or Widal Test)",
      description:
        "Typhoid fever and paratyphoid fever have similar symptoms.",
    },
    {
      id: 2,
      name: "Headache",
      category: "Typhidot (or Widal Test)",
      description: "Typhoid fever treated with antibiotics.",
    },
  ]);

  /* ---------------- CATEGORY ---------------- */
  const [categories, setCategories] = useState([
    { id: 1, name: "Fever" },
    { id: 2, name: "Typhidot (or Widal Test)" },
    { id: 3, name: "Skin Problem" },
  ]);

  const [form, setForm] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const openAdd = () => {
    setForm({});
    setIsEdit(false);
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setIsEdit(true);
    setOpenModal(true);
  };

  const saveData = () => {
    if (isFinding) {
      if (isEdit) {
        setFindings((p) =>
          p.map((i) => (i.id === form.id ? form : i))
        );
      } else {
        setFindings((p) => [...p, { ...form, id: Date.now() }]);
      }
    } else {
      if (isEdit) {
        setCategories((p) =>
          p.map((i) => (i.id === form.id ? form : i))
        );
      } else {
        setCategories((p) => [...p, { ...form, id: Date.now() }]);
      }
    }
    setOpenModal(false);
  };

  const deleteRow = (id) => {
    if (isFinding) {
      setFindings((p) => p.filter((i) => i.id !== id));
    } else {
      setCategories((p) => p.filter((i) => i.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">
            {isFinding ? "Finding" : "Finding Category"}
          </h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add {isFinding ? "Finding" : "Category"}
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <FindingSidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">
                    {isFinding ? "Finding" : "Category"}
                  </th>
                  {isFinding && (
                    <>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </>
                  )}
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {(isFinding ? findings : categories).map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                    <td className="px-3 py-2">{row.name}</td>

                    {isFinding && (
                      <>
                        <td className="px-3 py-2">{row.category}</td>
                        <td className="px-3 py-2 max-w-md">
                          {row.description}
                        </td>
                      </>
                    )}

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
                ))}
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
                {isEdit ? "Edit" : "Add"}{" "}
                {isFinding ? "Finding" : "Category"}
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
                  {isFinding ? "Finding" : "Category"} <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder={isFinding ? "Finding" : "Category"}
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              {isFinding && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      placeholder="Category"
                      value={form.category || ""}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    />
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
                </>
              )}
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
