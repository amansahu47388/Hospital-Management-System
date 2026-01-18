import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Pencil, Trash2, X } from "lucide-react";

export default function MedicineCategory() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editValue, setEditValue] = useState("");

  const categories = [
    "Syrup",
    "Capsule",
    "Injection",
    "Ointment",
    "Cream",
    "Surgical",
    "Drops",
    "Inhalers",
    "Implants / Patches",
    "Liquid",
    "Preparations",
    "Diaper",
    "Tablet",
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">
        <div className=" rounded-md p-4">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Medicine Category List</h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm"
            >
              + Add Medicine Category
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SIDEBAR */}
            <div className="w-full lg:w-64">
              <MedicineSidebarMenu />
            </div>

            {/* TABLE */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2 border">Category Name</th>
                    <th className="text-center px-3 py-2 border w-32">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{cat}</td>
                      <td className="px-3 py-2 border text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditValue(cat);
                              setOpenEdit(true);
                            }}
                            className="text-blue-600"
                          >
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

              <p className="text-xs text-gray-500 mt-2">
                Records: 1 to {categories.length} of {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {openAdd && (
        <Modal title="Add Medicine Category" onClose={() => setOpenAdd(false)}>
          <input
            type="text"
            placeholder="Category Name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="flex justify-end mt-4">
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-5 py-2 rounded">
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <Modal title="Edit Medicine Category" onClose={() => setOpenEdit(false)}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="flex justify-end mt-4">
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-5 py-2 rounded">
              Save
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

/* MODAL (INLINE – NOT A SEPARATE FILE) */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
