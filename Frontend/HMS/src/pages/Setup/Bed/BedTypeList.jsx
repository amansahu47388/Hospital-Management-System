import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBedTypeModal from "../../../components/Setup/Bed/AddBedTypeModal";


export default function BedTypeList() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const bedTypes = [
    { id: 1, name: "Standard" },
    { id: 2, name: "VIP" },
    { id: 3, name: "Normal" },
  ];

  /* EDIT */
  const handleEdit = (type) => {
    setSelectedType(type);
    setOpenEditModal(true);
  };

  /* DELETE */
  const handleDelete = (type) => {
    if (window.confirm(`Delete ${type.name}?`)) {
      console.log("Delete:", type);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bed Type List</h2>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed Type
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3">
            <ul className="space-y-1 text-sm">
              {[
                { label: "Bed Status", path: "/admin/setup/bed-status" },
                { label: "Bed", path: "/admin/setup/bed" },
                { label: "Bed Type", path: "/admin/setup/bed-type" },
                { label: "Bed Group", path: "/admin/setup/bed-group" },
                { label: "Floor", path: "/admin/setup/floor" },
              ].map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Purpose</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {bedTypes.map((type) => (
                  <tr
                    key={type.id}
                    className="border-b hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {type.name}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => handleEdit(type)}
                          className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(type)}
                          className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-3 py-2 text-xs text-gray-500">
              Records: 1 to {bedTypes.length} of {bedTypes.length}
            </div>
          </div>

        </div>

        {/* ADD MODAL */}
        <AddBedTypeModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />

        {/* EDIT MODAL */}
        

      </div>
    </AdminLayout>
  );
}
