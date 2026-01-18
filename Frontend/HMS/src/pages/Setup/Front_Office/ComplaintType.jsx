import { useState } from "react";
import { Pencil } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";

// already created sidebar (DO NOT recreate)
import PurposeSidebarMenu from "../../../components/Setup/Front_Office/PurposeSidebarMenu";

export default function ComplaintType() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      name: "Food quality",
      description:
        "A reference to a set of rules that were followed when the resource was constructed.",
    },
    { name: "Hospital services", description: "" },
    { name: "Long Wait Times", description: "Long Wait Times" },
    { name: "Billing Discrepancies", description: "" },
    { name: "Poor communication", description: "" },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">
        <div className="bg-white rounded-md p-4">

          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">Complaint Type List</h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded"
            >
              + Add Complaint Type
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar */}
            <div className="w-full lg:w-64">
              <PurposeSidebarMenu />
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Complaint Type</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelected(item);
                            setOpenEdit(true);
                          }}
                          className="text-blue-600"
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

          {/* ADD MODAL */}
          {openAdd && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
                <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                  <h3>Add Complaint Type</h3>
                  <button onClick={() => setOpenAdd(false)}>✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <input className="w-full border px-3 py-2 rounded" placeholder="Complaint Type" />
                  <textarea className="w-full border px-3 py-2 rounded" placeholder="Description" />
                  <div className="text-right">
                    <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {openEdit && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
                <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                  <h3>Edit Complaint Type</h3>
                  <button onClick={() => setOpenEdit(false)}>✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <input
                    defaultValue={selected?.name}
                    className="w-full border px-3 py-2 rounded"
                  />
                  <textarea
                    defaultValue={selected?.description}
                    className="w-full border px-3 py-2 rounded"
                  />
                  <div className="text-right">
                    <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
