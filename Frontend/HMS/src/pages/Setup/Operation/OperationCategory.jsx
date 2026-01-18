import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SideBarMenu from "../../../components/Setup/Operation/OperationSidebarMenu";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function OperationCategory() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">
        <div className="bg-white rounded-md p-4">
          <h2 className="text-lg font-semibold mb-4  pb-2">
            Operation Category List
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-64">
              <SideBarMenu />
            </div>

            <div className="flex-1">
              <div className="flex justify-end mb-3">
                
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1 text-white px-3 py-1 rounded
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
                >
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <table className="w-full  text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className=" px-2 py-2">Name</th>
                    <th className="px-2 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {["Plastic Surgery", "ENT", "Urology"].map((cat, i) => (
                    <tr key={i}>
                      <td className=" px-2 py-2">{cat}</td>
                      <td className=" px-2 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setShowEdit(true)} className="text-blue-600">
                            <Pencil size={16} />
                          </button>
                          <button className="text-red-600">
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
