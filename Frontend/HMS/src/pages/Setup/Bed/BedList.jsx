import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBed from "../../../components/Setup/Bed/AddBed";
import {
  getBeds,
  deleteBed,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function BedList() {
  const notify = useNotify();

  const [openModal, setOpenModal] = useState(false);
  const [beds, setBeds] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchBeds = async () => {
    try {
      const res = await getBeds();
      setBeds(res.data);
    } catch {
      notify( "error", "Failed to load beds");
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const handleEdit = (bed) => {
    setEditData(bed);
    setOpenModal(true);
  };

  const handleDelete = async (bed) => {
    if (!window.confirm(`Delete ${bed.bed_name}?`)) return;

    try {
      await deleteBed(bed.id);
      notify("success", "Bed deleted successfully");
      fetchBeds();
    } catch {
      notify("error","Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Bed List</h2>

          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow shadow">
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
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Bed Type</th>
                  <th className="px-3 py-2 text-left">Bed Group</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {beds.map(bed => (
                  <tr key={bed.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-left">
                      {bed.bed_name}
                    </td>
                    <td className="px-3 py-2 text-left">{bed.bed_type}</td>
                    <td className="px-3 py-2 text-left">{bed.bed_group}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex  gap-3">
                        <button onClick={() => handleEdit(bed)}
                        className="text-purple-600 hover:text-purple-800">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(bed)}
                        className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {beds.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No beds found
              </p>
            )}
          </div>
        </div>

        <AddBed
          open={openModal}
          onClose={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchBeds}
        />
      </div>
    </AdminLayout>
  );
}
