import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PathologySidebarMenu from "../../../components/Setup/Pathology/PathologySidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function PathologyUnit() {
  const [units, setUnits] = useState([
    { id: 1, name: "Micrometer (oi)" },
    { id: 2, name: "mmol/L" },
    { id: 3, name: "Dalton (Da)" },
    { id: 4, name: "Nanometer" },
    { id: 5, name: "million/mm3" },
    { id: 6, name: "Cells / cubic mm" },
    { id: 7, name: "(U/L)" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [open, setOpen] = useState(false);

  const saveUnit = () => {
    if (form.id) {
      setUnits((u) => u.map((x) => (x.id === form.id ? form : x)));
    } else {
      setUnits((u) => [...u, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Pathology Unit</h2>

          <button
            onClick={() => {
              setForm({ id: null, name: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Unit
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <PathologySidebarMenu />
          </div>


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Unit Name</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">{u.name}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm(u);
                            setOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setUnits((x) => x.filter((i) => i.id !== u.id))
                          }
                          className="text-red-600 hover:text-red-800"
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-md">
            <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Unit" : "Add Unit"}</h3>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            <div className="p-4">
              <label className="text-sm font-medium">Unit Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={saveUnit}
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
