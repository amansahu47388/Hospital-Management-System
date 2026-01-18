import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import PurposeSidebarMenu from "../../../components/Setup/Front_Office/PurposeSidebarMenu";

export default function PurposeList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const purposes = [
    {
      purpose: "Visit",
      description:
        "Visitor centers used to provide basic information about the place.",
    },
    {
      purpose: "Inquiry",
      description:
        "Inquiry involves asking questions and exploring to gain knowledge.",
    },
    {
      purpose: "Seminar",
      description:
        "A gathering of people to discuss a stated topic interactively.",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-md p-4">

          {/* HEADER */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold">Purpose List</h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
            >
              <Plus size={16} /> Add Purpose
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SIDEBAR */}
            <div className="w-full lg:w-64">
              <PurposeSidebarMenu />
            </div>

            {/* CONTENT */}
            <div className="flex-1 bg-white rounded-md overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Purpose</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purposes.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{item.purpose}</td>
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setOpenEdit(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      {/* ADD PURPOSE MODAL */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg">
            <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-3 flex justify-between">
              <h3 className="font-semibold">Add Purpose</h3>
              <button onClick={() => setOpenAdd(false)}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Purpose *</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea className="w-full border rounded px-3 py-2" />
              </div>

              <div className="flex justify-end">
                <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
                  ✔ Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PURPOSE MODAL */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg">
            <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-3 flex justify-between">
              <h3 className="font-semibold">Edit Purpose</h3>
              <button onClick={() => setOpenEdit(false)}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Purpose *</label>
                <input
                  defaultValue={editData?.purpose}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  defaultValue={editData?.description}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end">
                <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
                  ✔ Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
