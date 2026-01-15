import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddChargeCategoryModal from "../../../components/Setup/Charges/AddChargeCategoryModal";
import EditChargeCategoryModal from "../../../components/Setup/Charges/EditChargeCategoryModal";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";

export default function ChargeCategoryList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const chargeCategories = [
    {
      id: 1,
      name: "Other Charges",
      type: "Others",
      description: "Others",
    },
    {
      id: 2,
      name: "Operation Services",
      type: "Operations",
      description:
        "Health care operations include administrative and clinical services.",
    },
    {
      id: 3,
      name: "Fire extinguisher",
      type: "Supplier",
      description: "Fire safety equipment charges",
    },
  ];

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Delete ${row.name}?`)) {
      console.log("Deleted:", row);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Charge Category List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
          >
            <Plus size={16} /> Add Charge Category
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT SIDEBAR */}
          <ChargesSidebar />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Charge Type</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {chargeCategories.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-2 font-medium text-blue-600">
                      {row.name}
                    </td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.description}</td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
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
              Records: 1 to {chargeCategories.length} of{" "}
              {chargeCategories.length}
            </div>
          </div>

        </div>

        {/* MODALS */}
        <AddChargeCategoryModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
        />

        <EditChargeCategoryModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          data={selectedRow}
        />

      </div>
    </AdminLayout>
  );
}
