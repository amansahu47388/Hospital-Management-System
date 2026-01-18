import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PathologySidebarMenu from "../../../components/Setup/Pathology/PathologySidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function PathologyParameter() {
  const [list, setList] = useState([
    {
      id: 1,
      name: "RBC",
      range: "4.1 to 5.1",
      unit: "million/mm3",
      desc: "RBC blood test",
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    rangeFrom: "",
    rangeTo: "",
    unit: "",
    desc: "",
  });

  const [open, setOpen] = useState(false);

  const save = () => {
    const data = {
      id: form.id ?? Date.now(),
      name: form.name,
      range: `${form.rangeFrom} to ${form.rangeTo}`,
      unit: form.unit,
      desc: form.desc,
    };

    if (form.id) {
      setList((l) => l.map((x) => (x.id === form.id ? data : x)));
    } else {
      setList((l) => [...l, data]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <PathologySidebarMenu />

        <div className="lg:col-span-3">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Pathology Parameter List</h2>
            <button
              onClick={() => {
                setForm({
                  id: null,
                  name: "",
                  rangeFrom: "",
                  rangeTo: "",
                  unit: "",
                  desc: "",
                });
                setOpen(true);
              }}
              className="flex gap-2 px-4 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Pathology Parameter
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Parameter</th>
                  <th className="px-3 py-2">Range</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.range}</td>
                    <td className="px-3 py-2">{p.unit}</td>
                    <td className="px-3 py-2">{p.desc}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            const [f, t] = p.range.split(" to ");
                            setForm({
                              id: p.id,
                              name: p.name,
                              rangeFrom: f,
                              rangeTo: t,
                              unit: p.unit,
                              desc: p.desc,
                            });
                            setOpen(true);
                          }}
                          className="p-1 bg-blue-500 text-white rounded"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setList((x) => x.filter((i) => i.id !== p.id))
                          }
                          className="p-1 bg-red-500 text-white rounded"
                        >
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

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded">
            <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Parameter" : "Add Parameter"}</h3>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            <div className="p-4 grid md:grid-cols-2 gap-4">
              <input placeholder="Parameter Name" className="border p-2 rounded" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Unit" className="border p-2 rounded" value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <input placeholder="From" className="border p-2 rounded" value={form.rangeFrom}
                onChange={(e) => setForm({ ...form, rangeFrom: e.target.value })} />
              <input placeholder="To" className="border p-2 rounded" value={form.rangeTo}
                onChange={(e) => setForm({ ...form, rangeTo: e.target.value })} />
              <textarea placeholder="Description" className="border p-2 rounded md:col-span-2"
                value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={save}
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
