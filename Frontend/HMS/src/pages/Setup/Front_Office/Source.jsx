import { useState } from "react";
import { Pencil } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";

// already created sidebar
import PurposeSidebarMenu from "../../../components/Setup/Front_Office/PurposeSidebarMenu";

export default function Source() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      name: "Online Advertising",
      description:
        "Online advertising, also known as online marketing or Internet advertising.",
    },
    {
      name: "From visitors",
      description:
        "Visitor centers used to provide basic information about the place.",
    },
    { name: "Front Office", description: "" },
    { name: "Online Front Site", description: "" },
    { name: "Advertisement", description: "" },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">
        <div className="bg-white rounded-md p-4">

          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">Source List</h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded"
            >
              + Add Source
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-64">
              <PurposeSidebarMenu />
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm ">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Source</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i} className=" hover:bg-gray-50">
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

          {/* ADD SOURCE */}
          {openAdd && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
                <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                  <h3>Add Source</h3>
                  <button onClick={() => setOpenAdd(false)}>✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <input className="w-full border px-3 py-2 rounded" placeholder="Source" />
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

          {/* EDIT SOURCE */}
          {openEdit && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
                <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                  <h3>Edit Source</h3>
                  <button onClick={() => setOpenEdit(false)}>✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <input defaultValue={selected?.name} className="w-full border px-3 py-2 rounded" />
                  <textarea defaultValue={selected?.description} className="w-full border px-3 py-2 rounded" />
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
