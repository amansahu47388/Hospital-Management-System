import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

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
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Medicine Category</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Medicine Category
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <MedicineSidebarMenu />
          </div>


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Category Name</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">{cat}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditValue(cat);
                            setOpenEdit(true);
                          }}
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
