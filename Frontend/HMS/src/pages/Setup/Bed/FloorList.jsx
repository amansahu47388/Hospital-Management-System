import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddFloorModal from "../../../components/Setup/Bed/AddFloorModal";

export default function FloorList() {
  const [openModal, setOpenModal] = useState(false);

  const floors = [
    {
      id: 1,
      name: "4th Floor",
      description:
        "The coronary/cardiac care unit (CCU) is a specialized intensive care unit for cardiac issues.",
    },
    {
      id: 2,
      name: "3rd Floor",
      description:
        "A palliative or hospice unit where end-of-life care is provided.",
    },
    {
      id: 3,
      name: "2nd Floor",
      description:
        "The pediatric intensive care unit (PICU) where children receive critical care.",
    },
    {
      id: 4,
      name: "1st Floor",
      description:
        "Neonatal intensive care units (NICUs) which provide care for newborn infants.",
    },
    {
      id: 5,
      name: "Ground Floor",
      description:
        "General facilities and access areas for patients and visitors.",
    },
  ];

  const handleEdit = (floor) => {
    console.log("Edit floor:", floor);
  };

  const handleDelete = (floor) => {
    if (window.confirm(`Delete ${floor.name}?`)) {
      console.log("Delete floor:", floor);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Floor List</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Floor
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
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {floors.map((floor) => (
                  <tr
                    key={floor.id}
                    className="border-b hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {floor.name}
                    </td>

                    <td className="px-3 py-2 text-gray-700">
                      {floor.description}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(floor)}
                          className="text-blue-600 hover:text-blue-800
                          opacity-0 group-hover:opacity-100 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(floor)}
                          className="text-red-600 hover:text-red-800
                          opacity-0 group-hover:opacity-100 transition"
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
              Records: 1 to {floors.length} of {floors.length}
            </div>
          </div>
        </div>

        {/* ADD FLOOR MODAL */}
        <AddFloorModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />

      </div>
    </AdminLayout>
  );
}
