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
              {isFinding ? "Finding List" : "Finding Category List"}
            </h1>

            <button
              onClick={openAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2
              px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} />
              Add {isFinding ? "Finding" : "Category"}
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded shadow overflow-x-auto">
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
                  <tr
                    key={row.id}
                    className="group hover:bg-gray-50 transition"
                  >
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
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1 rounded bg-blue-500 text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button className="p-1 rounded bg-red-500 text-white">
                          <Trash2 size={14} />
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2">
          <div className="w-full max-w-xl bg-white rounded shadow">
            <div className="flex justify-between items-center px-4 py-3 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-t">
              <h2 className="font-semibold">
                {isEdit ? "Edit" : "Add"}{" "}
                {isFinding ? "Finding" : "Category"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <input
                placeholder={isFinding ? "Finding" : "Category"}
                value={form.name || ""}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              {isFinding && (
                <>
                  <input
                    placeholder="Category"
                    value={form.category || ""}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={form.description || ""}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </>
              )}
            </div>

            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveData}
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
