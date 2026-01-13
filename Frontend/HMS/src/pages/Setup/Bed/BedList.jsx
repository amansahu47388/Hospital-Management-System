import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBedModal from "../../../components/Setup/Bed/AddBedModal";
import EditBedModal from "../../../components/Setup/Bed/EditBedModal";

export default function BedList() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  const beds = [
    { name: "GF - 101", type: "Standard", group: "VIP Ward - Ground Floor", used: true },
    { name: "TF - 102", type: "VIP", group: "Private Ward - 3rd Floor", used: true },
    { name: "TF - 103", type: "Normal", group: "Private Ward - 3rd Floor", used: true },
    { name: "TF - 104", type: "Standard", group: "Private Ward - 3rd Floor", used: true },
    { name: "SF - 105", type: "Standard", group: "ICU - 2nd Floor", used: true },
  ];

  /* ACTION HANDLERS */
  const handleEdit = (bed) => {
    setSelectedBed(bed);
    setOpenEditModal(true);
  };

  const handleDelete = (bed) => {
    if (window.confirm(`Are you sure you want to delete ${bed.name}?`)) {
      console.log("Delete bed:", bed);
      // API delete later
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bed List</h2>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed
          </button>
        </div>

        {/* CONTENT */}
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
                      ${isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"}`
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
                  <th className="px-3 py-2 text-left">Bed Type</th>
                  <th className="px-3 py-2 text-left">Bed Group</th>
                  <th className="px-3 py-2 text-center">Used</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {beds.map((bed, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 group">
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {bed.name}
                    </td>
                    <td className="px-3 py-2">{bed.type}</td>
                    <td className="px-3 py-2">{bed.group}</td>

                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={bed.used} readOnly />
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => handleEdit(bed)}
                          className="text-blue-600 hover:text-blue-800
                          opacity-0 group-hover:opacity-100 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(bed)}
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
          </div>

        </div>

        {/* ADD BED MODAL */}
        <AddBedModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />

        {/* EDIT BED MODAL */}
        <EditBedModal
          open={openEditModal}
          bed={selectedBed}
          onClose={() => setOpenEditModal(false)}
        />

      </div>
    </AdminLayout>
  );
}
