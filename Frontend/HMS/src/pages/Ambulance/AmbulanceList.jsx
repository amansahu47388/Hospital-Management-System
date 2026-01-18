import { useMemo, useState, useEffect, useRef } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import AddAmbulance from "../../components/Ambulance/AddAmbulance";
import EditAmbulance from "../../components/Ambulance/EditAmbulance";
import { getAmbulances, deleteAmbulance } from "../../api/ambulanceApi";
import { useNotify } from "../../context/NotificationContext";
import {
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Copy,
  Pencil,
  Trash2
} from "lucide-react";

export default function AmbulanceList() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  // Load ambulances
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    loadAmbulances();
  }, []);

  const loadAmbulances = async () => {
    try {
      setLoading(true);
      const res = await getAmbulances();
      setAmbulances(res.data || []);
    } catch (err) {
      console.error("Failed to load ambulances:", err);
      notify("error", "Failed to load ambulances");
      setAmbulances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ambulance?");
    if (!confirmDelete) return;

    try {
      await deleteAmbulance(id);
      notify("success", "Ambulance deleted successfully");
      loadAmbulances(); // Refresh list
    } catch (error) {
      notify("error", error?.response?.data?.message || "Failed to delete ambulance");
    }
  };

  const filteredData = useMemo(() => {
    return ambulances.filter((ambulance) =>
      Object.values(ambulance)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, ambulances]);

  return (
    <AdminLayout>
      {/* PAGE BACKGROUND */}
      <div className="min-h-screen  p-1">

        {/* WHITE CONTAINER (SAME AS IMAGE) */}
        <div className="bg-white rounded  shadow-sm">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-semibold text-xl md:text-2xl text-gray-800">Ambulance List</h2>

            <button onClick={() => setOpen(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm flex items-center gap-1">
              <Plus size={14} /> Add Ambulance
            </button>
          </div>

          {/* SEARCH + ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64"
            />

            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-sm">100</span>
              <Copy size={16} className="cursor-pointer" />
              <FileText size={16} className="cursor-pointer" />
              <FileSpreadsheet size={16} className="cursor-pointer" />
              <Printer size={16} className="cursor-pointer" />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 ">
                <tr className="text-left text-gray-700">
                  <th className="px-3 py-2">Vehicle Number</th>
                  <th className="px-3 py-2">Vehicle Model</th>
                  <th className="px-3 py-2">Year Made</th>
                  <th className="px-3 py-2">Driver Name</th>
                  <th className="px-3 py-2">Driver License</th>
                  <th className="px-3 py-2">Driver Contact</th>
                  <th className="px-3 py-2">Note</th>
                  <th className="px-3 py-2">Vehicle Type</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-3 py-8 text-center">
                      Loading ambulances...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-3 py-8 text-center text-gray-500">
                      No ambulances found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((ambulance) => (
                    <tr
                      key={ambulance.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-blue-600 cursor-pointer">
                        {ambulance.vehicle_number}
                      </td>
                      <td className="px-3 py-2">{ambulance.vehicle_model}</td>
                      <td className="px-3 py-2">{ambulance.year_made}</td>
                      <td className="px-3 py-2">{ambulance.driver_name || "-"}</td>
                      <td className="px-3 py-2">{ambulance.driver_license || "-"}</td>
                      <td className="px-3 py-2">{ambulance.driver_contact || "-"}</td>
                      <td className="px-3 py-2">{ambulance.note || "-"}</td>
                      <td className="px-3 py-2">{ambulance.vehicle_type}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                        <button
                            onClick={() => {
                              setSelectedId(ambulance.id);
                              setEditOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(ambulance.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
            <span>
              Records: 1 to {filteredData.length} of {ambulances.length}
            </span>

            <div className="flex items-center gap-2">
              <button className="border px-2 rounded">‹</button>
              <button className="border px-2 rounded bg-gray-100">1</button>
              <button className="border px-2 rounded">›</button>
            </div>
          </div>
        </div>
      </div>
      <EditAmbulance
        open={editOpen}
        ambulanceId={selectedId}
        onClose={() => setEditOpen(false)}
        onSuccess={loadAmbulances}
      />

    </AdminLayout> 
  );
}
