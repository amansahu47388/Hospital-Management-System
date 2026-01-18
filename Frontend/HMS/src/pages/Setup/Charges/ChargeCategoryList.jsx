import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddChargeCategory from "../../../components/Setup/Charges/AddChargeCategory";
import UpdateChargeCategory from "../../../components/Setup/Charges/UpdateChargeCategory";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";
import {getChargeCategories,deleteChargeCategory,} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function ChargeCategoryList() {
  const notify = useNotify();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetched = useRef(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getChargeCategories();
      setRows(res.data);
    } catch {
      notify("error", "Failed to load charge categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchCategories();
  }, []);

  const handleDelete = async (row) => {
    if (!confirm(`Delete "${row.category_name}" ?`)) return;

    try {
      await deleteChargeCategory(row.id);
      notify("success", "Charge category deleted successfully");
      fetchCategories();
    } catch {
      notify("error", "Failed to delete charge category");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Charge Category List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
          >
            <Plus size={16} /> Add Charge Category
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <ChargesSidebar />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
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
                {loading && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">Loading...</td>
                  </tr>
                )}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No charge categories found
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 group">
                    <td className="px-3 py-2 font-medium">
                      {row.category_name}
                    </td>
                    <td className="px-3 py-2">
                      {row.charge_type_name}
                    </td>
                    <td className="px-3 py-2">
                      {row.description || "-"}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                        title="Edit"
                          onClick={() => {
                            setSelectedRow(row);
                            setOpenEdit(true);
                          }}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                        title="Delete"
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
              Records: {rows.length}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <AddChargeCategory
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={fetchCategories}
        />

        <UpdateChargeCategory
          open={openEdit}
          data={selectedRow}
          onClose={() => {
            setSelectedRow(null);
            setOpenEdit(false);
          }}
          refresh={fetchCategories}
        />
      </div>
    </AdminLayout>
  );
}
