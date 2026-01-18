import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SideBarMenu from "../../../components/Setup/Operation/OperationSidebarMenu";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function OperationList() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Operation</h2>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Operation
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <SideBarMenu />
          </div>


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Facelift Surgery", cat: "Plastic Surgery" },
                  { name: "Tooth extraction", cat: "ENT and Oral Surgery" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">{row.name}</td>
                    <td className="px-3 py-2 text-left">{row.cat}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowEdit(true)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
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

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md">
            <div className="flex justify-between items-center px-4 py-2 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>Add Operation</h3>
              <X className="cursor-pointer" onClick={() => setShowAdd(false)} />
            </div>

            <div className="p-4 space-y-3">
              <input className="border w-full px-3 py-2 rounded" placeholder="Operation Name" />
              <select className="border w-full px-3 py-2 rounded">
                <option>Select Category</option>
                <option>Plastic Surgery</option>
                <option>ENT</option>
              </select>

              <div className="flex justify-end">
                <button className="text-white px-4 py-2 rounded
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md">
            <div className="flex justify-between items-center px-4 py-2 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>Edit Operation</h3>
              <X className="cursor-pointer" onClick={() => setShowEdit(false)} />
            </div>

            <div className="p-4 space-y-3">
              <input className="border w-full px-3 py-2 rounded" defaultValue="Facelift Surgery" />
              <select className="border w-full px-3 py-2 rounded">
                <option>Plastic Surgery</option>
                <option>ENT</option>
              </select>

              <div className="flex justify-end">
                <button className="text-white px-4 py-2 rounded
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
