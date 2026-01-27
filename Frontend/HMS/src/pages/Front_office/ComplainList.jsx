import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import AddComplain from "../../components/Front_office/AddComplain";
import { getComplaints, deleteComplaint } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";
import UpdateComplain from "../../components/Front_office/UpdateComplain";
import ComplainDetails from "../../components/Front_office/ComplainDetails";

export default function ComplainList() {
  const notify = useNotify();
  const searchRef = useRef("");
  const [, forceRender] = useState(0);

  const [complaints, setComplaints] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);

  /* LOAD DATA */
  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await getComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      notify("error","Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  /* SEARCH */
  const filtered = useMemo(() => {
    const key = searchRef.current.toLowerCase();
    if (!key) return complaints;

    return complaints.filter((c) =>
      c.complain_by.toLowerCase().includes(key) ||
      c.phone.includes(key) ||
      c.complain_type_name.toLowerCase().includes(key) ||
      c.source_name.toLowerCase().includes(key)
    );
  }, [complaints, searchRef.current]);

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      await deleteComplaint(id);
      notify("success","Complaint deleted");
      loadComplaints();
    } catch (err) {
      notify("error","Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center bg-white shadow rounded-md p-3">
          <div>
            <h2 className="text-lg font-semibold">Complain List</h2>
            <input
              placeholder="Search..."
              onChange={(e) => {
                searchRef.current = e.target.value;
                forceRender((n) => n + 1);
              }}
              className="border px-3 py-2 mt-2 rounded text-sm w-64"
            />
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Complain
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto shadow thin-scrollbar">
          <table className="w-full text-sm shadow">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "ID",
                  "Type",
                  "Source",
                  "Name",
                  "Phone",
                  "Date",
                  "Assigned",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className=" hover:bg-gray-50">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.complain_type_name}</td>
                  <td className="px-3 py-2">{c.source_name}</td>
                  <td className="px-3 py-2">{c.complain_by}</td>
                  <td className="px-3 py-2">{c.phone}</td>
                  <td className="px-3 py-2">{new Date(c.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{c.assigned || "-"}</td>
                  <td className="p-3 flex justify-center gap-2">
                   <button
                      onClick={() => setViewId(c.id)}
                      className="bg-blue-100 p-2 rounded text-blue-600"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => setEditId(c.id)}
                      className="bg-green-100 p-2 rounded text-green-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-100 p-2 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD MODAL */}
        <AddComplain
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={loadComplaints}
        />
        <UpdateComplain
          open={!!editId}
          complainId={editId}
          onClose={() => setEditId(null)}
          refresh={loadComplaints}
        />
        <ComplainDetails
          open={!!viewId}
          complainId={viewId}
          onClose={() => setViewId(null)}
        />
    </div>
    </AdminLayout>
  );
}
