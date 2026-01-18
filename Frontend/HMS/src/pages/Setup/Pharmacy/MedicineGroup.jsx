import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function MedicineGroup() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Antibacterials" },
    { id: 2, name: "Antimycobacterials" },
    { id: 3, name: "Antiparasitics" },
    { id: 4, name: "Antigout agents" },
    { id: 5, name: "HIPERIN" },
  ]);

  const emptyForm = { id: null, name: "" };
  const [form, setForm] = useState(emptyForm);
  const [openModal, setOpenModal] = useState(false);

  const openAdd = () => {
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpenModal(true);
  };

  const saveGroup = () => {
    if (form.id) {
      setGroups((prev) =>
        prev.map((g) => (g.id === form.id ? form : g))
      );
    } else {
      setGroups((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setOpenModal(false);
  };

  const deleteGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <MedicineSidebarMenu />
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Medicine Group List</h1>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                <Plus size={16} /> Add Medicine Group
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Database ID</th>
                    <th className="px-3 py-2 text-left">Medicine Group</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {groups.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2">{row.name}</td>

                      {/* ACTION */}
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1 rounded bg-blue-500 text-white"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => deleteGroup(row.id)}
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
                Records: 1 to {groups.length} of {groups.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
          <div className="w-full max-w-lg bg-white rounded shadow-lg">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 text-white rounded-t bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {form.id ? "Edit Medicine Group" : "Add Medicine Group"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4">
              <label className="text-sm font-medium">
                Medicine Group <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                placeholder="Enter medicine group"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveGroup}
                className="px-6 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
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
