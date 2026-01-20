import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import VitalSidebarMenu from "../../../components/Setup/Vital/VitalSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getVitals,
  createVital,
  updateVital,
  deleteVital
} from "../../../api/setupApi";

export default function VitalList() {
  const notify = useNotify();
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: null,
    vital_name: "",
    from: "",
    to: "",
    unit: "",
  });

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const res = await getVitals();
      setVitals(res.data);
    } catch (err) {
      notify("error", "Failed to fetch vitals");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OPEN ADD ---------- */
  const openAdd = () => {
    setForm({ id: null, vital_name: "", from: "", to: "", unit: "" });
    setOpenModal(true);
  };

  /* ---------- OPEN EDIT ---------- */
  const openEdit = (row) => {
    const range = row.reference_range || "";
    let from = "";
    let to = "";
    if (range.includes("-")) {
      [from, to] = range.split("-").map((s) => s.trim());
    } else {
      from = range;
    }
    setForm({
      id: row.id,
      vital_name: row.vital_name,
      from: from,
      to: to,
      unit: row.unit,
    });
    setOpenModal(true);
  };

  /* ---------- SAVE ---------- */
  const saveVital = async () => {
    if (!form.vital_name) {
      notify("warning", "Vital Name is required");
      return;
    }

    const reference_range = form.from && form.to ? `${form.from} - ${form.to}` : form.from || form.to || "";
    const submitData = {
      vital_name: form.vital_name,
      reference_range: reference_range,
      unit: form.unit,
    };

    try {
      setLoading(true);
      if (form.id) {
        await updateVital(form.id, submitData);
        notify("success", "Vital updated successfully");
      } else {
        await createVital(submitData);
        notify("success", "Vital created successfully");
      }
      setOpenModal(false);
      fetchVitals();
    } catch (err) {
      notify("error", "Failed to save vital");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const removeVital = async (id) => {
    if (window.confirm("Are you sure you want to delete this vital?")) {
      try {
        setLoading(true);
        await deleteVital(id);
        notify("success", "Vital deleted successfully");
        fetchVitals();
      } catch (err) {
        notify("error", "Failed to delete vital");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Vital List</h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Vital
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <VitalSidebarMenu />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Reference Range</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Loading...</td>
                  </tr>
                ) : vitals.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">No records found</td>
                  </tr>
                ) : (
                  vitals.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                      <td className="px-3 py-2">{row.vital_name}</td>
                      <td className="px-3 py-2">{row.reference_range}</td>
                      <td className="px-3 py-2">{row.unit}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(row)}
                            className="text-purple-600 hover:text-purple-800 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => removeVital(row.id)}
                            className="text-red-600 hover:text-red-800 transition"
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
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2">
          <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {form.id ? "Edit Vital" : "Add Vital"}
              </h2>
              <button
                onClick={() => setOpenModal(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vital Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.vital_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, vital_name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="Enter vital name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    placeholder="From"
                    value={form.from}
                    onChange={(e) =>
                      setForm({ ...form, from: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                  <input
                    placeholder="To"
                    value={form.to}
                    onChange={(e) =>
                      setForm({ ...form, to: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  value={form.unit}
                  onChange={(e) =>
                    setForm({ ...form, unit: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="Enter unit"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={saveVital}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
