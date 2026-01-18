import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import VitalSidebarMenu from "../../../components/Setup/Vital/VitalSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function VitalList() {
  const [vitals, setVitals] = useState([
    { id: 1, name: "Height", from: "1", to: "200", unit: "Centimeters" },
    { id: 2, name: "Weight", from: "0", to: "150", unit: "Kilograms" },
    { id: 3, name: "Pulse", from: "70", to: "100", unit: "Beats per min" },
    { id: 4, name: "Temperature", from: "95.8", to: "99.3", unit: "Fahrenheit" },
    { id: 5, name: "BP", from: "90/60", to: "140/90", unit: "mmHg" },
  ]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    from: "",
    to: "",
    unit: "",
  });

  const [openModal, setOpenModal] = useState(false);

  /* ---------- OPEN ADD ---------- */
  const openAdd = () => {
    setForm({ id: null, name: "", from: "", to: "", unit: "" });
    setOpenModal(true);
  };

  /* ---------- OPEN EDIT ---------- */
  const openEdit = (row) => {
    setForm(row);
    setOpenModal(true);
  };

  /* ---------- SAVE ---------- */
  const saveVital = () => {
    if (form.id) {
      setVitals((prev) =>
        prev.map((v) => (v.id === form.id ? form : v))
      );
    } else {
      setVitals((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setOpenModal(false);
  };

  /* ---------- DELETE ---------- */
  const deleteVital = (id) => {
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* SIDEBAR */}
          <div>
            <VitalSidebarMenu />
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl font-semibold">Vital List</h1>

              <button
                onClick={openAdd}
                className="
                  flex items-center justify-center gap-2
                  w-full sm:w-auto
                  px-4 py-2
                  text-white rounded
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                "
              >
                <Plus size={16} />
                Add Vital
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Reference Range</th>
                    <th className="px-3 py-2 text-left">Unit</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {vitals.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">
                        {row.from} - {row.to}
                      </td>
                      <td className="px-3 py-2">{row.unit}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1 rounded bg-blue-500 text-white"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => deleteVital(row.id)}
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
                Records: 1 to {vitals.length} of {vitals.length}
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
            <div
              className="
                flex justify-between items-center px-4 py-3 text-white
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                rounded-t
              "
            >
              <h2 className="font-semibold">
                {form.id ? "Edit Vital" : "Add Vital"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">
                  Vital Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Reference Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <input
                    placeholder="From"
                    value={form.from}
                    onChange={(e) =>
                      setForm({ ...form, from: e.target.value })
                    }
                    className="px-3 py-2 border rounded"
                  />
                  <input
                    placeholder="To"
                    value={form.to}
                    onChange={(e) =>
                      setForm({ ...form, to: e.target.value })
                    }
                    className="px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Unit</label>
                <input
                  value={form.unit}
                  onChange={(e) =>
                    setForm({ ...form, unit: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveVital}
                className="
                  px-6 py-2 text-white rounded
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                "
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
