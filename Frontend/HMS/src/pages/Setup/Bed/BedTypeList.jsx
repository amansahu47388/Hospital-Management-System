import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBedType from "../../../components/Setup/Bed/AddBedType";
import {
  getBedTypes,
  deleteBedType,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function BedTypeList() {
  const notify = useNotify();

  const [openModal, setOpenModal] = useState(false);
  const [bedTypes, setBedTypes] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------- FETCH -------- */
  const fetchBedTypes = async () => {
    try {
      setLoading(true);
      const res = await getBedTypes();
      setBedTypes(res.data);
    } catch {
      notify( "error", "Failed to load bed types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBedTypes();
  }, []);

  /* -------- EDIT -------- */
  const handleEdit = (type) => {
    setEditData(type);
    setOpenModal(true);
  };

  /* -------- DELETE -------- */
  const handleDelete = async (type) => {
    const confirmed = window.confirm(
      `Delete bed type "${type.bad_type}"?`
    );
    if (!confirmed) return;

    try {
      await deleteBedType(type.id);
      notify("success","Bed type deleted successfully");
      fetchBedTypes();
    } catch {
      notify("error", "Failed to delete bed type");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Bed Type List</h2>

          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed Type
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 shadow">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
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
                      isActive
                        ? "block px-3 py-2 rounded bg-purple-200 text-purple-600 font-bold"
                        : "block px-3 py-2 rounded hover:bg-purple-100"
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Purpose</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {bedTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">
                      {type.bad_type}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(type)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
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

            {!loading && bedTypes.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No bed types found
              </p>
            )}
          </div>
        </div>

        {/* MODAL */}
        <AddBedType
          open={openModal}
          onClose={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchBedTypes}
        />

      </div>
    </AdminLayout>
  );
}
