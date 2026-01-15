import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddUnitTypeModal from "../../../components/Setup/Charges/AddUnitTypeModal";
import EditUnitTypeModal from "../../../components/Setup/Charges/EditUnitTypeModal";

export default function UnitTypeList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const unitTypes = [
    "10-21 mm Hg",
    "Bone density scan",
    "PET/CT scan",
    "Digital mammography",
    "per hour",
    "per km",
    "MG",
    "g/dl",
    "Insurance",
    "Hour",
    "per day",
    "(nm)",
    "Litter",
    "(ML)",
  ];

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setOpenEdit(true);
  };

  const handleDelete = (unit) => {
    if (window.confirm(`Delete ${unit}?`)) {
      console.log("Delete:", unit);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Unit Type List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Unit Type
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-64 bg-white rounded-md p-3">
            <ul className="space-y-1 text-sm">
              {[
                { label: "Charges", path: "/admin/setup/charges" },
                { label: "Charge Category", path: "/admin/setup/charge-category" },
                { label: "Charge Type", path: "/admin/setup/charge-type" },
                { label: "Tax Category", path: "/admin/setup/tax-category" },
                { label: "Unit Type", path: "/admin/setup/unit-type" },
              ].map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded ${
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
                  <th className="px-3 py-2 text-left">Unit Type</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {unitTypes.map((unit, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 group">
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {unit}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(unit)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(unit)}
                          className="text-red-600 hover:text-red-800"
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
              Records: 1 to {unitTypes.length} of {unitTypes.length}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <AddUnitTypeModal open={openAdd} onClose={() => setOpenAdd(false)} />

        <EditUnitTypeModal
          open={openEdit}
          unit={selectedUnit}
          onClose={() => setOpenEdit(false)}
        />
      </div>
    </AdminLayout>
  );
}
