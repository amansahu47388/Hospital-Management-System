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
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Pathology Parameter</h2>

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
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Pathology Parameter
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
                  <th className="px-3 py-2 text-left">Parameter</th>
                  <th className="px-3 py-2 text-left">Range</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">{p.name}</td>
                    <td className="px-3 py-2 text-left">{p.range}</td>
                    <td className="px-3 py-2 text-left">{p.unit}</td>
                    <td className="px-3 py-2 text-left">{p.desc}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
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
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setList((x) => x.filter((i) => i.id !== p.id))
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
          <div className="bg-white w-full max-w-2xl rounded-md">
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
