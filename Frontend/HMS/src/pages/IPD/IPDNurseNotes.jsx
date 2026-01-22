import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
//import Header from "../../components/Header"; // your existing header
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Eye, Trash2 } from "lucide-react";



export default function IPDNurseNotes() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const notes = [
    {
      id: 1,
      date: "01/12/2026 04:55 PM",
      nurse: "April Clinton (9020)",
      note: "Daily Routine Check up",
      comment: "Daily Routine Check up",
      createdBy: "Super Admin (9001)"
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen ">

        {/* HEADER (already exists) */}
        <IPDTabsNavbar />

        {/* CONTENT */}
        <div className="p-4 md:p-1">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">

            {/* TITLE BAR */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Nurse Notes</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded hover:opacity-90"
              >
                + Add Nurse Note
              </button>
            </div>

            {/* TIMELINE */}
            <div className="space-y-6">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="relative pl-10 group"
                >
                  {/* DOT */}
                  <div className="absolute left-2 top-2 w-4 h-4 bg-[#6046B5] rounded-full"></div>

                  {/* DATE */}
                  <span className="inline-block mb-2 text-xs bg-[#6046B5] text-white px-3 py-1 rounded">
                    {n.date}
                  </span>

                  {/* CARD */}
                  <div className="bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-[#6046B5]">
                        {n.nurse}
                      </h4>

                      {/* ACTIONS */}
                      <div className="opacity-0 group-hover:opacity-100 transition flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedNote(n);
                            setShowEdit(true);
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                         <Eye size={16}/>
                        </button>
                        <button className="text-sm text-red-600 hover:underline">
                         <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <p><b>Note:</b> {n.note}</p>
                      <p className="mt-1"><b>Comment:</b> {n.comment}</p>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-right">
                      Created By: {n.createdBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Add Nurse Note</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="border p-2 rounded" placeholder="Date *" />
                  <select className="border p-2 rounded">
                    <option>Select Nurse *</option>
                  </select>
                </div>

                <textarea className="border p-2 rounded w-full" placeholder="Note *"></textarea>
                <textarea className="border p-2 rounded w-full" placeholder="Comment *"></textarea>

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-5 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <div className="flex justify-between items-center px-6 py-4 text-white">
                <h3 className="font-semibold">Edit Nurse Note</h3>
                <button onClick={() => setShowEdit(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border p-2 rounded"
                    defaultValue={selectedNote?.date}
                  />
                  <input
                    className="border p-2 rounded"
                    defaultValue={selectedNote?.nurse}
                  />
                </div>

                <textarea
                  className="border p-2 rounded w-full"
                  defaultValue={selectedNote?.note}
                />
                <textarea
                  className="border p-2 rounded w-full"
                  defaultValue={selectedNote?.comment}
                />

                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-5 py-2 rounded">
                    Update
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
