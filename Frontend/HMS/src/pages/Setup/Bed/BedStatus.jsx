import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import { getBeds } from "../../../api/setupApi";
import BedSidebarMenu from "../../../components/Setup/Bed/BedSidebarMenu";
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
      const payload = res?.data ?? res;
      const data = Array.isArray(payload)
        ? payload
        : payload?.results || payload?.data || [];
      setBeds(data);
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
            <BedSidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
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
                {Array.isArray(beds) && beds.map((bed) => (
                  <tr
                    key={bed.id}
                    className={`hover:bg-gray-100 group border border-gray-200 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2 transition-all
                      ${bed.status === "available"
                        ? "bg-green-50"
                        : "bg-red-50"
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

            {!loading && (Array.isArray(beds) && beds.length === 0) && (
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
