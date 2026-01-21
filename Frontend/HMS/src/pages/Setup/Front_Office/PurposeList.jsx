import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import PurposeSidebarMenu from "../../../components/Setup/Front_Office/PurposeSidebarMenu";
import { getPurposes, createPurpose, updatePurpose, deletePurpose } from "../../../api/frontofficeApi";
import { useNotify } from "../../../context/NotificationContext";

export default function PurposeList() {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [purposeName, setPurposeName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch purposes
  const fetchPurposes = async () => {
    try {
      setLoading(true);
      const res = await getPurposes();
      setPurposes(res.data || []);
    } catch (error) {
      notify("error", "Failed to load purposes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPurposes();
  }, []);

  // Handle Add
  const handleAdd = async () => {
    if (!purposeName.trim()) {
      notify("error", "Purpose name is required");
      return;
    }

    try {
      await createPurpose({
        purpose_name: purposeName,
        description: description
      });
      notify("success", "Purpose added successfully");
      setOpenAdd(false);
      setPurposeName("");
      setDescription("");
      fetchPurposes();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to add purpose");
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!purposeName.trim()) {
      notify("error", "Purpose name is required");
      return;
    }

    try {
      await updatePurpose(editData.id, {
        purpose_name: purposeName,
        description: description
      });
      notify("success", "Purpose updated successfully");
      setOpenEdit(false);
      setEditData(null);
      setPurposeName("");
      setDescription("");
      fetchPurposes();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to update purpose");
    }
  };

  // Handle Delete
  const handleDelete = async (purpose) => {
    if (!window.confirm(`Delete ${purpose.purpose_name}?`)) return;

    try {
      await deletePurpose(purpose.id);
      notify("success", "Purpose deleted successfully");
      fetchPurposes();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to delete purpose");
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditData(item);
    setPurposeName(item.purpose_name);
    setDescription(item.description || "");
    setOpenEdit(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Purpose</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Purpose
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <PurposeSidebarMenu />
          </div>


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Purpose</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : purposes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No purposes found
                    </td>
                  </tr>
                ) : (
                  purposes.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-left">
                        {item.purpose_name}
                      </td>
                      <td className="px-3 py-2 text-left">{item.description}</td>
                      <td className="px-3 py-2 text-left">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-800">
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

      {/* ADD PURPOSE MODAL */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg">
            <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-3 flex justify-between">
              <h3 className="font-semibold">Add Purpose</h3>
              <button onClick={() => {
                setOpenAdd(false);
                setPurposeName("");
                setDescription("");
              }}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Purpose *</label>
                <input
                  value={purposeName}
                  onChange={(e) => setPurposeName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter purpose name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAdd}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
                  ✔ Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PURPOSE MODAL */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg">
            <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-3 flex justify-between">
              <h3 className="font-semibold">Edit Purpose</h3>
              <button onClick={() => {
                setOpenEdit(false);
                setEditData(null);
                setPurposeName("");
                setDescription("");
              }}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Purpose *</label>
                <input
                  value={purposeName}
                  onChange={(e) => setPurposeName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
