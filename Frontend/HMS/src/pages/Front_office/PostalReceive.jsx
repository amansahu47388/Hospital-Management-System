import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus, Trash2, Pencil, Eye } from "lucide-react";
import AddReceive from "../../components/Front_office/AddReceive";
import ReceiveDetails from "../../components/Front_office/ReceiveDetails";
import UpdateReceive from "../../components/Front_office/UpdateReceive";
import { getReceiveList, deleteReceive } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function PostalReceive() {
  const { success, error } = useNotify();

  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef("");
  const [, force] = useState(0);

  /* ================= LOAD ================= */
  const loadReceive = async () => {
    try {
      setLoading(true);
      const res = await getReceiveList();
      setData(res.data);
    } catch (e) {
      error("Failed to load receive list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceive();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const k = searchRef.current.toLowerCase();

    if (!k) return data;

    return data.filter((r) =>
      (r.from_title || "").toLowerCase().includes(k) ||
      (r.to_title || "").toLowerCase().includes(k) ||
      (r.reference_no || "").toLowerCase().includes(k)
    );
  }, [data, searchRef.current]);

  /* ================= ACTIONS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this receive?")) return;

    try {
      await deleteReceive(id);
      success("Receive deleted");
      loadReceive();
    } catch {
      error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-md p-3 shadow">
          <div>
            <h2 className="text-lg font-semibold pb-3">Postal Receive List</h2>
            <input
              placeholder="Search by reference, to or from..."
              onChange={(e) => {
                searchRef.current = e.target.value;
                force((x) => x + 1);
              }}
              className="border px-3 py-2 rounded text-sm w-full sm:w-64"
            />
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Receive
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["From Title", "Reference No", "To Title", "Address", "Note", "Date", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{row.from_title}</td>
                  <td className="px-3 py-2">{row.reference_no}</td>
                  <td className="px-3 py-2">{row.to_title}</td>
                  <td className="px-3 py-2">{row.address}</td>
                  <td className="px-3 py-2">{row.note || "-"}</td>
                  <td className="px-3 py-2">
                    {new Date(row.date).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRow(row);
                        setShowModal(true);
                      }}
                      className="bg-blue-100 p-2 rounded text-blue-600"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRow(row);
                        setEditModal(true);
                      }}
                      className="bg-green-100 p-2 rounded text-green-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-100 p-2 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODALS */}
        {openAdd && (
          <AddReceive open={openAdd} onClose={() => setOpenAdd(false)} refresh={loadReceive} />
        )}

        {showModal && selectedRow && (
          <ReceiveDetails open={showModal} data={selectedRow} onClose={() => setShowModal(false)} />
        )}

        {editModal && selectedRow && (
          <UpdateReceive open={editModal} data={selectedRow} onClose={() => setEditModal(false)} refresh={loadReceive} />
        )}

      </div>
    </AdminLayout>
  );
}
