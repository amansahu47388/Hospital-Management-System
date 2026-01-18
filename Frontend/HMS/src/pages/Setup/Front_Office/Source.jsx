import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";

// already created sidebar
import PurposeSidebarMenu from "../../../components/Setup/Front_Office/PurposeSidebarMenu";
import { getSources, createSource, updateSource, deleteSource } from "../../../api/frontofficeApi";
import { useNotify } from "../../../context/NotificationContext";

export default function Source() {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [sourceName, setSourceName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch sources
  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await getSources();
      setData(res.data || []);
    } catch (error) {
      notify("error", "Failed to load sources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchSources();
  }, []);

  // Handle Add
  const handleAdd = async () => {
    if (!sourceName.trim()) {
      notify("error", "Source name is required");
      return;
    }

    try {
      await createSource({
        source_name: sourceName,
        description: description
      });
      notify("success", "Source added successfully");
      setOpenAdd(false);
      setSourceName("");
      setDescription("");
      fetchSources();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to add source");
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!sourceName.trim()) {
      notify("error", "Source name is required");
      return;
    }

    try {
      await updateSource(selected.id, {
        source_name: sourceName,
        description: description
      });
      notify("success", "Source updated successfully");
      setOpenEdit(false);
      setSelected(null);
      setSourceName("");
      setDescription("");
      fetchSources();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to update source");
    }
  };

  // Handle Delete
  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.source_name}?`)) return;

    try {
      await deleteSource(item.id);
      notify("success", "Source deleted successfully");
      fetchSources();
    } catch (error) {
      notify("error", error?.response?.data?.detail || "Failed to delete source");
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelected(item);
    setSourceName(item.source_name);
    setDescription(item.description || "");
    setOpenEdit(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Source</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Source
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
                  <th className="px-3 py-2 text-left">Source</th>
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
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No sources found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-left">
                        {item.source_name}
                      </td>
                      <td className="px-3 py-2 text-left">{item.description}</td>
                      <td className="px-3 py-2 text-left">
                        <div className="flex gap-3">
                          <button onClick={() => openEditModal(item)}
                            className="text-purple-600 hover:text-purple-800">
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

        {/* ADD SOURCE */}
        {openAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
              <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                <h3>Add Source</h3>
                <button onClick={() => {
                  setOpenAdd(false);
                  setSourceName("");
                  setDescription("");
                }}>✕</button>
              </div>
              <div className="p-4 space-y-3">
                <input
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Source"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Description"
                  rows={3}
                />
                <div className="text-right">
                  <button
                    onClick={handleAdd}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT SOURCE */}
        {openEdit && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-md overflow-hidden">
              <div className="p-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] flex justify-between">
                <h3>Edit Source</h3>
                <button onClick={() => {
                  setOpenEdit(false);
                  setSelected(null);
                  setSourceName("");
                  setDescription("");
                }}>✕</button>
              </div>
              <div className="p-4 space-y-3">
                <input
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
                <div className="text-right">
                  <button
                    onClick={handleEdit}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
