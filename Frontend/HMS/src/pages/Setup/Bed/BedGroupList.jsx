import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBedGroupModal from "../../../components/Setup/Bed/AddBedGroupModal";

export default function BedGroupList() {
  const [openModal, setOpenModal] = useState(false);

  const bedGroups = [
    {
      id: 1,
      name: "VIP Ward",
      floor: "Ground Floor",
      description:
        "A palliative or hospice unit is where end-of-life care is provided.",
    },
    {
      id: 2,
      name: "Private Ward",
      floor: "3rd Floor",
      description:
        "The operating room (OR) is where both inpatient and outpatient surgeries are performed.",
    },
    {
      id: 3,
      name: "General Ward Male",
      floor: "3rd Floor",
      description: "",
    },
    {
      id: 4,
      name: "ICU",
      floor: "2nd Floor",
      description:
        "The intensive care unit (ICU) is where you're sent if you require close monitoring.",
    },
    {
      id: 5,
      name: "NICU",
      floor: "2nd Floor",
      description:
        "Neonatal intensive care unit depending on facility type.",
    },
    {
      id: 6,
      name: "AC (Normal)",
      floor: "1st Floor",
      description: "",
    },
    {
      id: 7,
      name: "Non AC",
      floor: "4th Floor",
      description: "",
    },
  ];

  const handleEdit = (group) => {
    console.log("Edit:", group);
  };

  const handleDelete = (group) => {
    if (window.confirm(`Delete ${group.name}?`)) {
      console.log("Delete:", group);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bed Group List</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed Group
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
                  <th className="px-3 py-2 text-left">Floor</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {bedGroups.map((group) => (
                  <tr
                    key={group.id}
                    className="border-b hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {group.name}
                    </td>
                    <td className="px-3 py-2">{group.floor}</td>
                    <td className="px-3 py-2 max-w-xl truncate">
                      {group.description}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-blue-600 hover:text-blue-800
                          opacity-0 group-hover:opacity-100 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(group)}
                          className="text-red-600 hover:text-red-800
                          opacity-0 group-hover:opacity-100 transition"
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
              Records: 1 to {bedGroups.length} of {bedGroups.length}
            </div>
          </div>

        </div>

        {/* ADD BED GROUP MODAL */}
        <AddBedGroupModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />

      </div>
    </AdminLayout>
  );
}
