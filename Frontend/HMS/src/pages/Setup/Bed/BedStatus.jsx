import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import { getBeds } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function BedStatus() {
  const notify = useNotify();
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH BEDS ---------- */
  const fetchBeds = async () => {
    try {
      setLoading(true);
      const res = await getBeds();
      setBeds(res.data);
    } catch {
      notify({
        type: "error",
        message: "Failed to load bed status",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* PAGE HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 shadow">
          <h2 className="text-lg font-semibold">Bed Status</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

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
                      `block px-3 py-2 rounded
                      ${isActive
                        ? "bg-purple-200 text-purple-600 font-bold"
                        : "hover:bg-purple-100"}`
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
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Bed Type</th>
                  <th className="px-3 py-2 text-left">Bed Group</th>
                  <th className="px-3 py-2 text-left">Floor</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {beds.map((bed) => (
                  <tr
                    key={bed.id}
                    className={`
                      ${
                        bed.status === "available"
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-red-50 hover:bg-red-100"
                      }`}
                  >
                    <td className="px-3 py-2 font-medium">
                      {bed.bed_name}
                    </td>
                    <td className="px-3 py-2">{bed.bed_type}</td>
                    <td className="px-3 py-2">{bed.bed_group}</td>
                    <td className="px-3 py-2">{bed.floor}</td>
                    <td className="px-3 py-2 font-semibold capitalize">
                      {bed.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && beds.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No beds found
              </p>
            )}

            {loading && (
              <p className="text-center text-gray-500 py-4">
                Loading bed status...
              </p>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
