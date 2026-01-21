import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import RadiologySidebarMenu from "../../../components/Setup/Radiology/RadiologySidebarMenu";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getRadiologyParameters,
  createRadiologyParameter,
  updateRadiologyParameter,
  deleteRadiologyParameter,
} from "../../../api/radiologyApi";

export default function RadiologyParameter() {
  const [list, setList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const emptyForm = {
    id: null,
    parameter_name: "",
    reference_range: "",
    unit: "",
    description: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);

  const notify = useNotify();

  /* -------------------- FETCH -------------------- */
  const fetchParameters = async () => {
    setTableLoading(true);
    try {
      const res = await getRadiologyParameters();
      setList(res.data);
    } catch {
      notify("error", "Failed to fetch parameters");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  /* -------------------- ADD / EDIT -------------------- */
  const openAdd = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      parameter_name: p.parameter_name,
      reference_range: p.reference_range,
      unit: p.unit,
      description: p.description,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.parameter_name.trim()) {
      notify("error", "Parameter name is required");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        parameter_name: form.parameter_name,
        reference_range: form.reference_range,
        unit: form.unit,
        description: form.description,
      };

      if (form.id) {
        await updateRadiologyParameter(form.id, payload);
        notify("success", "Parameter updated successfully");
      } else {
        await createRadiologyParameter(payload);
        notify("success", "Parameter added successfully");
      }
      setOpen(false);
      // Automatic Refresh
      window.location.reload();
    } catch (err) {
      notify("error", err.response?.data?.parameter_name?.[0] || "Failed to save parameter");
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parameter?"))
      return;

    try {
      await deleteRadiologyParameter(id);
      notify("success", "Parameter deleted successfully");
      // Automatic Refresh
      window.location.reload();
    } catch {
      notify("error", "Failed to delete parameter");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Radiology Parameter</h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Radiology Parameter
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <RadiologySidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            {tableLoading ? (
              <div className="flex justify-center items-center h-48 text-purple-600">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Parameter</th>
                    <th className="px-3 py-2 text-left">Range</th>
                    <th className="px-3 py-2 text-left">Unit</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length > 0 ? (
                    list.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-100 border-b border-gray-200">
                        <td className="px-3 py-2 text-left text-purple-600 font-medium">{p.parameter_name}</td>
                        <td className="px-3 py-2 text-left">{p.reference_range}</td>
                        <td className="px-3 py-2 text-left">{p.unit}</td>
                        <td className="px-3 py-2 text-left">{p.description}</td>
                        <td className="px-3 py-2 text-left">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(p)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">
                        No parameters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-md shadow-lg overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3 className="font-semibold">{form.id ? "Edit Parameter" : "Add Parameter"}</h3>
              <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-gray-200 transition" />
            </div>

            {/* MODAL BODY */}
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Parameter Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Parameter Name"
                  className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  value={form.parameter_name}
                  onChange={(e) => setForm({ ...form, parameter_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <input
                  placeholder="Unit"
                  className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Reference Range</label>
                <input
                  placeholder="e.g., 4.1 to 5.1"
                  className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  value={form.reference_range}
                  onChange={(e) => setForm({ ...form, reference_range: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Description"
                  className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={save}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90 disabled:opacity-70"
              >
                {actionLoading && <Loader2 className="animate-spin" size={16} />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
