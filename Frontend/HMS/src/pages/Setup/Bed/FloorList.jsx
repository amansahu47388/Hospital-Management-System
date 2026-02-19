import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddFloor from "../../../components/Setup/Bed/AddFloor";
import BedSidebarMenu from "../../../components/Setup/Bed/BedSidebarMenu";
import { getFloors, deleteFloor } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function FloorList() {
  const notify = useNotify();

  const [openModal, setOpenModal] = useState(false);
  const [floors, setFloors] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH FLOORS ---------------- */
  const fetchFloors = async () => {
    try {
      setLoading(true);
      const res = await getFloors();
      const payload = res?.data ?? res;
      const data = Array.isArray(payload)
        ? payload
        : payload?.results || payload?.data || [];
      setFloors(data);
    } catch (error) {
      notify("error", "Failed to load floors",);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  /* ---------------- EDIT ---------------- */
  const handleEdit = (floor) => {
    setEditData(floor);
    setOpenModal(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (floor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${floor.floor_name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteFloor(floor.id);

      notify("success", "Floor deleted successfully");

      fetchFloors();
    } catch (error) {
      notify("error", "Failed to delete floor");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between shadow">
          <h2 className="text-lg font-semibold">Floor List</h2>
          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Floor
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <BedSidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(floors) && floors.map((floor) => (
                  <tr key={floor.id} className="hover:bg-gray-100 group border border-gray-200 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2 transition-all">
                    <td className="px-3 py-2 font-medium">
                      {floor.floor_name}
                    </td>
                    <td className="px-3 py-2">{floor.description}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(floor)}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 p-1 rounded transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(floor)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-200 p-1 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && (Array.isArray(floors) && floors.length === 0) && (
              <p className="text-center text-gray-500 py-4">
                No floors found
              </p>
            )}

            {loading && (
              <p className="text-center text-gray-500 py-4">
                Loading floors...
              </p>
            )}
          </div>
        </div>

        {/* MODAL */}
        <AddFloor
          open={openModal}
          onClose={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchFloors}
        />
      </div>
    </AdminLayout>
  );
}
