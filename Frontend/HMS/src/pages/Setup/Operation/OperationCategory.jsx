import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SideBarMenu from "../../../components/Setup/Operation/OperationSidebarMenu";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function OperationCategory() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Operation Category</h2>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Category
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
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {["Plastic Surgery", "ENT", "Urology"].map((cat, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">{cat}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowEdit(true)}
                          className="text-purple-600 hover:text-purple-800">
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
          <div className="bg-white rounded-md w-full max-w-sm">
            <div className="flex justify-between px-4 py-2 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>Add Category</h3>
              <X onClick={() => setShowAdd(false)} className="cursor-pointer" />
            </div>

            <div className="p-4 space-y-3">
              <input className="border w-full px-3 py-2 rounded" placeholder="Category Name" />
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
          <div className="bg-white rounded-md w-full max-w-sm">
            <div className="flex justify-between px-4 py-2 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>Edit Category</h3>
              <X onClick={() => setShowEdit(false)} className="cursor-pointer" />
            </div>

            <div className="p-4 space-y-3">
              <input className="border w-full px-3 py-2 rounded" defaultValue="Plastic Surgery" />
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
