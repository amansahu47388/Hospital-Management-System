import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddTaxCategory from "../../../components/Setup/Charges/AddTaxCategory";
import UpdateTaxCategory from "../../../components/Setup/Charges/UpdateTaxCategory";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";
import {getTaxCategories,deleteTaxCategory,} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function TaxCategoryList() {
  const notify = useNotify();

  const [taxCategories, setTaxCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetched = useRef(false);

  // 🔹 Fetch
  const fetchTaxCategories = async () => {
    setLoading(true);
    try {
      const res = await getTaxCategories();
      setTaxCategories(res.data);
    } catch {
      notify("error", "Failed to load tax categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchTaxCategories();
  }, []);

  // 🔹 Delete
  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.tax_name}" ?`)) return;

    try {
      await deleteTaxCategory(item.id);
      notify("success", "Tax category deleted successfully");
      fetchTaxCategories();
    } catch {
      notify("error", "Failed to delete tax category");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
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

        <div className="flex flex-col md:flex-row gap-4 shadow">
          <ChargesSidebar />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Percentage (%)</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">Loading...</td>
                  </tr>
                )}

                {!loading && taxCategories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No tax categories found
                    </td>
                  </tr>
                )}

                {taxCategories.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="px-3 py-2 font-medium">
                      {item.tax_name}
                    </td>

                    <td className="px-3 py-2 text-right">
                      {Number(item.tax_percentage).toFixed(2)}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                        title="Edit"
                          onClick={() => {
                            setSelected(item);
                            setOpenEdit(true);
                          }}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                        title="delete"
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
              Records: {taxCategories.length}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <AddTaxCategory
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={fetchTaxCategories}
        />

        <UpdateTaxCategory
          open={openEdit}
          data={selected}
          onClose={() => {
            setSelected(null);
            setOpenEdit(false);
          }}
          refresh={fetchTaxCategories}
        />
      </div>
    </AdminLayout>
  );
}
