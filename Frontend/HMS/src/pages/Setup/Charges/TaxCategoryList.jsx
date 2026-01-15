import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddTaxCategoryModal from "../../../components/Setup/Charges/AddTaxCategoryModal";
import EditTaxCategoryModal from "../../../components/Setup/Charges/EditTaxCategoryModal";

export default function TaxCategoryList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const taxCategories = [
    { id: 1, name: "Others Tax", percentage: 10 },
    { id: 2, name: "Supplier", percentage: 10 },
    { id: 3, name: "Investigation Tax", percentage: 10 },
    { id: 4, name: "Ambulance Tax", percentage: 15 },
    { id: 5, name: "Radiology Tax", percentage: 20 },
  ];

  const handleEdit = (item) => {
    setSelected(item);
    setOpenEdit(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      console.log("Delete:", item);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tax Category List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Tax Category
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-right">Percentage (%)</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {taxCategories.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 group"
                >
                  <td className="px-3 py-2 text-blue-600 font-medium">
                    {item.name}
                  </td>

                  <td className="px-3 py-2 text-right">
                    {item.percentage.toFixed(2)}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
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
            Records: 1 to {taxCategories.length} of {taxCategories.length}
          </div>
        </div>

        {/* MODALS */}
        <AddTaxCategoryModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
        />

        <EditTaxCategoryModal
          open={openEdit}
          data={selected}
          onClose={() => setOpenEdit(false)}
        />

      </div>
    </AdminLayout>
  );
}
