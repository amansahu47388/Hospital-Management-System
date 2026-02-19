import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PathologySidebarMenu from "../../../components/Setup/Pathology/PathologySidebarMenu";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getPathologyParameters,
  createPathologyParameter,
  updatePathologyParameter,
  deletePathologyParameter,
} from "../../../api/pathologyApi";

export default function PathologyParameter() {
  const [list, setList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const emptyForm = {
    id: null,
    parameter_name: "",
    rangeFrom: "",
    rangeTo: "",
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
      const res = await getPathologyParameters();
      const payload = res?.data ?? res;
      const data = Array.isArray(payload)
        ? payload
        : payload?.results || payload?.data || [];
      setList(data);
    } catch {
      notify("error", "Failed to fetch parameters");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  /* -------------------- SAVE -------------------- */
  const save = async () => {
    if (!form.parameter_name.trim()) {
      notify("error", "Parameter name is required");
      return;
    }
    if (!form.rangeFrom.trim() || !form.rangeTo.trim()) {
      notify("error", "Range is required");
      return;
    }
    if (!form.unit.trim()) {
      notify("error", "Unit is required");
      return;
    }

    const payload = {
      parameter_name: form.parameter_name,
      reference_range: `${form.rangeFrom} to ${form.rangeTo}`,
      unit: form.unit,
      description: form.description,
    };

    setActionLoading(true);
    try {
      if (form.id) {
        await updatePathologyParameter(form.id, payload);
        notify("success", "Parameter updated successfully");
      } else {
        await createPathologyParameter(payload);
        notify("success", "Parameter added successfully");
      }
      setOpen(false);
      // Automatic Refresh
      window.location.reload();
    } catch (err) {
      notify("error", "Failed to save parameter");
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parameter?"))
      return;

    try {
      await deletePathologyParameter(id);
      notify("success", "Parameter deleted successfully");
      // Automatic Refresh
      window.location.reload();
    } catch {
      notify("error", "Failed to delete parameter");
    }
  };

  const openEdit = (row) => {
    const [f, t] = (row.reference_range || "").split(" to ");
    setForm({
      id: row.id,
      parameter_name: row.parameter_name,
      rangeFrom: f || "",
      rangeTo: t || "",
      unit: row.unit || "",
      description: row.description || "",
    });
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Pathology Parameter</h2>

          <button
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Pathology Parameter
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <PathologySidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
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
                  {(Array.isArray(list) && list.length > 0) ? (
                    list.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-100 group border border-gray-200 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2 transition-all">
                        <td className="px-3 py-2 text-left">{p.parameter_name}</td>
                        <td className="px-3 py-2 text-left">{p.reference_range}</td>
                        <td className="px-3 py-2 text-left">{p.unit}</td>
                        <td className="px-3 py-2 text-left text-gray-500 max-w-xs truncate">{p.description}</td>
                        <td className="px-3 py-2 text-left">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(p)}
                              className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 p-1 rounded transition"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-200 p-1 rounded transition"
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-white w-full max-w-2xl rounded-md shadow-xl overflow-hidden">
            <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3 className="font-semibold">{form.id ? "Edit Parameter" : "Add Parameter"}</h3>
              <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-gray-200 transition" />
            </div>

            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 ">Parameter Name <span className="text-red-500">*</span></label>
                <input placeholder="Parameter Name" className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2" value={form.parameter_name}
                  onChange={(e) => setForm({ ...form, parameter_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 ">Unit <span className="text-red-500">*</span></label>
                <input placeholder="Unit" className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2" value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 ">Range From <span className="text-red-500">*</span></label>
                <input placeholder="Range From" className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2" value={form.rangeFrom}
                  onChange={(e) => setForm({ ...form, rangeFrom: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 ">Range To <span className="text-red-500">*</span></label>
                <input placeholder="Range To" className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2" value={form.rangeTo}
                  onChange={(e) => setForm({ ...form, rangeTo: e.target.value })} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 ">Description</label>
                <textarea placeholder="Description" className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-300 bg-gray-50">
              <button
                onClick={save}
                disabled={actionLoading}
                className="flex items-center gap-2 px-8 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90 disabled:opacity-70 shadow-md"
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
