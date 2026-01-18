import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddBedGroup from "../../../components/Setup/Bed/AddBedGroup";
import {
  getBedGroups,
  deleteBedGroup,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function BedGroupList() {
  const notify = useNotify();

  const [openModal, setOpenModal] = useState(false);
  const [bedGroups, setBedGroups] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchGroups = async () => {
    try {
      const res = await getBedGroups();
      setBedGroups(res.data);
    } catch {
      notify("error", "Failed to load bed groups");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleEdit = (group) => {
    setEditData(group);
    setOpenModal(true);
  };

  const handleDelete = async (group) => {
    if (!window.confirm(`Delete ${group.name}?`)) return;

    try {
      await deleteBedGroup(group.id);
      notify("success","Bed group deleted");
      fetchGroups();
    } catch {
      notify( "error", "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        <div className="bg-white rounded-md p-3 mb-4 flex justify-between">
          <h2 className="text-lg font-semibold">Bed Group List</h2>
          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Bed Group
          </button>
        </div>

        <div className="flex gap-4">
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


          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Floor</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bedGroups.map(group => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{group.name}</td>
                    <td className="px-3 py-2 font-medium">{group.floor_name}</td>
                    <td className="px-3 py-2 font-medium">{group.description}</td>
                    <td className="px-3 py-2 font-medium">
                      <div className="flex  gap-3">
                        <button onClick={() => handleEdit(group)}
                          className="text-purple-600 hover:text-purple-800">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(group)}
                          className="text-red-600 hover:text-red-800">
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

        <AddBedGroup
          open={openModal}
          onClose={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchGroups}
        />
      </div>
    </AdminLayout>
  );
}
