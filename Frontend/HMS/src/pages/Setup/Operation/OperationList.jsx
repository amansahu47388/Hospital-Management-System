import { useEffect, useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SideBarMenu from "../../../components/Setup/Operation/OperationSidebarMenu";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getOperationSetups,
  createOperationSetup,
  updateOperationSetup,
  deleteOperationSetup,
} from "../../../api/setupApi";


export default function OperationList() {
  /* -------------------- STATE -------------------- */
  const [operations, setOperations] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    operation_type: "",
  });

  const [selectedId, setSelectedId] = useState(null);

  const notify = useNotify();

  /* -------------------- FETCH -------------------- */
  const fetchOperations = async () => {
    setTableLoading(true);
    try {
      const res = await getOperationSetups();
      setOperations(res.data);
    } catch {
      notify("error", "Failed to fetch operations");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  /* -------------------- ADD -------------------- */
  const handleAdd = async () => {
    if (!form.name.trim()) {
      notify("error", "Operation name is required");
      return;
    }

    setActionLoading(true);
    try {
      await createOperationSetup(form);
      notify("success", "Operation added successfully");
      setShowAdd(false);
      resetForm();
      // Automatic Refresh
      window.location.reload();
    } catch (err) {
      notify("error", err.response?.data?.name?.[0] || "Failed to add operation");
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- UPDATE -------------------- */
  const handleEdit = async () => {
    if (!form.name.trim()) {
      notify("error", "Operation name is required");
      return;
    }

    setActionLoading(true);
    try {
      await updateOperationSetup(selectedId, form);
      notify("success", "Operation updated successfully");
      setShowEdit(false);
      resetForm();
      // Automatic Refresh
      window.location.reload();
    } catch {
      notify("error", "Failed to update operation");
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this operation?"))
      return;

    try {
      await deleteOperationSetup(id);
      notify("success", "Operation deleted successfully");
      // Automatic Refresh
      window.location.reload();
    } catch {
      notify("error", "Failed to delete operation");
    }
  };

  /* -------------------- HELPERS -------------------- */
  const openEditModal = (row) => {
    setForm({
      name: row.name,
      operation_type: row.operation_type || "",
    });
    setSelectedId(row.id);
    setShowEdit(true);
  };

  const resetForm = () => {
    setForm({ name: "", operation_type: "" });
    setSelectedId(null);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Operation Setup</h2>

          <button
            onClick={() => {
              resetForm();
              setShowAdd(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            <Plus size={16} />
            Add Operation
          </button>
        </div>

        <div className="flex gap-4">

          {/* SIDEBAR */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <SideBarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md shadow overflow-x-auto">
            {tableLoading ? (
              <div className="flex justify-center items-center h-64 text-purple-600">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Operation Type</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.length ? (
                    operations.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">{row.name}</td>
                        <td className="px-3 py-2">
                          {row.operation_type || "N/A"}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditModal(row)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
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
                      <td
                        colSpan="3"
                        className="text-center py-8 text-gray-400"
                      >
                        No operations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal
          title="Add Operation"
          onClose={() => setShowAdd(false)}
          form={form}
          setForm={setForm}
          loading={actionLoading}
          onSubmit={handleAdd}
          buttonText="Save"
        />
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal
          title="Edit Operation"
          onClose={() => setShowEdit(false)}
          form={form}
          setForm={setForm}
          loading={actionLoading}
          onSubmit={handleEdit}
          buttonText="Update"
        />
      )}
    </AdminLayout>
  );
}

/* -------------------- MODAL COMPONENT -------------------- */
function Modal({ title, onClose, form, setForm, loading, onSubmit, buttonText }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-md w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">{title}</h3>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Operation Name *</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Operation Type</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={form.operation_type}
              onChange={(e) =>
                setForm({ ...form, operation_type: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
              text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
