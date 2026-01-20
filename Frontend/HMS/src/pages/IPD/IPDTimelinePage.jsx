import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";
import { Pencil, Trash2 } from "lucide-react";

export default function IPDTimelinePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const timelines = [
    {
      id: 1,
      title: "backup",
      description: "no",
      date: "01/19/2026 03:57 PM",
      visible: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        {/* IPD TABS NAVBAR */}
        <IPDTabsNavbar />

        {/* CONTENT */}
        <div className="p-4">
          <div className="bg-white rounded shadow">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg">Timeline</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Add Timeline
              </button>
            </div>

            {/* TIMELINE LIST */}
            <div className="p-6 space-y-6">
              {timelines.map((t) => (
                <div key={t.id} className="relative pl-10 group">

                  {/* LINE */}
                  <div className="absolute left-3 top-0 h-full w-[2px] bg-gray-300"></div>

                  {/* DOT */}
                  <div className="absolute left-1 top-1 w-6 h-6 bg-[#6046B5] text-white flex items-center justify-center rounded-full">
                    📝
                  </div>

                  {/* DATE */}
                  <span className="inline-block mb-2 text-xs bg-[#6046B5] text-white px-3 py-1 rounded">
                    {t.date}
                  </span>

                  {/* CARD */}
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-[#6046B5]">
                        {t.title}
                      </h4>

                      {/* ACTIONS */}
                      <div className="opacity-0 group-hover:opacity-100 transition flex gap-3">
                        <button
                          onClick={() => {
                            setSelected(t);
                            setShowEdit(true);
                          }}
                          className="text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button className="text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm mt-2">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ADD TIMELINE MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Add Timeline</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <input
                  className="border p-2 w-full rounded"
                  placeholder="Title *"
                />
                <input
                  className="border p-2 w-full rounded"
                  placeholder="Date *"
                />
                <textarea
                  className="border p-2 w-full rounded"
                  placeholder="Description"
                />

                <div className="border rounded p-4 text-center text-sm text-gray-500">
                  Drop a file here or click
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  Visible to this person
                </label>

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT TIMELINE MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Edit Timeline</h3>
                <button onClick={() => setShowEdit(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <input
                  className="border p-2 w-full rounded"
                  defaultValue={selected?.title}
                />
                <input
                  className="border p-2 w-full rounded"
                  defaultValue={selected?.date}
                />
                <textarea
                  className="border p-2 w-full rounded"
                  defaultValue={selected?.description}
                />

                <div className="border rounded p-4 text-center text-sm text-gray-500">
                  Drop a file here or click
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  Visible to this person
                </label>

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
