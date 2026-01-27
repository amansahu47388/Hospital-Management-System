import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus, Trash2, Pencil, Eye } from "lucide-react";
import AddDispatch from "../../components/Front_office/AddDispatch";
import DispatchDetails from "../../components/Front_office/DispatchDetails";
import UpdateDispatch from "../../components/Front_office/UpdateDispatch";
import {getDispatchList,deleteDispatch,} from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function PostalDispatch() {
  const notify = useNotify();

  const [openAdd, setOpenAdd] = useState(false);
  const [dispatches, setDispatches] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef("");
  const [, force] = useState(0);

  // ================= FETCH DATA =================
  const loadDispatch = async () => {
    try {
      setLoading(true);
      const res = await getDispatchList();
      setDispatches(res.data);
    } catch (e) {
      notify("error","Failed to load postal dispatch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDispatch();
  }, []);

  // ================= SEARCH =================
  const filtered = useMemo(() => {
    const keyword = searchRef.current.toLowerCase();

    if (!keyword) return dispatches;

    return dispatches.filter((d) =>
      d.reference_no.toLowerCase().includes(keyword) ||
      d.to_title.toLowerCase().includes(keyword) ||
      d.from_title.toLowerCase().includes(keyword)
    );
  }, [dispatches, searchRef.current]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this postal dispatch?")) return;

    try {
      await deleteDispatch(id);
      notify("success","Dispatch deleted successfully");
      loadDispatch();
      refresh();
    } catch {
      notify("error","Failed to delete dispatch");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* ================= HEADER ================= */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-md p-4 shadow">
          <div>
            <h2 className="text-lg font-semibold pb-3">Postal Dispatch List</h2>
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
            <Plus size={16} /> Add Dispatch
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto shadow thin-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["To Title", "Reference No", "From Title", "Date", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className=" hover:bg-gray-50">
                  <td className="px-3 py-2">{row.to_title}</td>
                  <td className="px-3 py-2 font-medium">{row.reference_no}</td>
                  <td className="px-3 py-2">{row.from_title}</td>
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
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MODALS ================= */}
        {openAdd && (
          <AddDispatch
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            refresh={loadDispatch}
          />
        )}

        {showModal && selectedRow && (
          <DispatchDetails
            open={showModal}
            data={selectedRow}
            onClose={() => setShowModal(false)}
          />
        )}

        {editModal && selectedRow && (
          <UpdateDispatch
            open={editModal}
            data={selectedRow}
            onClose={() => setEditModal(false)}
            refresh={loadDispatch}
          />
        )}

      </div>
    </AdminLayout>
  );
}
