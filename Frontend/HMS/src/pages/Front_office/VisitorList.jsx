import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus, Trash2, Pencil, Eye,ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVisitors, deleteVisitor } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";
import AddVisitor from "../../components/Front_office/AddVisitor";
import VisitorDetails from "../../components/Front_office/VisitorDetails";
import UpdateVisitor from "../../components/Front_office/UpdateVisitor";


export default function VisitorList() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef("");
  const [, forceRender] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  /* ================= FETCH ================= */
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await getVisitors();
      setVisitors(res.data);
    } catch (err) {
      console.error(err);
      notify("error","Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  /* ================= SEARCH (useMemo + useRef) ================= */
  const filteredVisitors = useMemo(() => {
    const keyword = searchRef.current.toLowerCase();

    if (!keyword) return visitors;

    return visitors.filter((v) =>
      v.name?.toLowerCase().includes(keyword) ||
      v.phone?.includes(keyword) ||
      v.purpose_name?.toLowerCase().includes(keyword) ||
      v.visit_to?.toLowerCase().includes(keyword) ||
      v.opd_ipd_staff?.toLowerCase().includes(keyword)
    );
  }, [visitors, searchRef.current]);

  /* ================= ACTIONS ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visitor?")) return;

    try {
      await deleteVisitor(id);
      notify("success","Visitor deleted successfully");
      fetchVisitors();
    } catch (err) {
      console.error(err);
      notify("error","Failed to delete visitor");
    }
  };

  const handleView = (row) => {
    setSelectedVisitor(row);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setSelectedVisitor(row);
    setEditModal(true);
  };

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="min-h-full">

        {/* ================= HEADER ================= */}
        <div className="bg-white mt-2 shadow rounded overflow-x-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 p-4">
            <div>
              <h1 className="text-xl font-semibold pb-4">Visitor List</h1>
              <input
                placeholder="Search..."
                onChange={(e) => {
                  searchRef.current = e.target.value;
                  forceRender((n) => n + 1);
                }}
                className="border px-3 py-2 rounded text-sm w-full sm:w-64"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setOpenAdd(true)}
                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded flex gap-2"
              >
                <Plus size={18} /> Add Visitor
              </button>

              {/* <PortalDropdown /> */}
               <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
                >
                  Portal <ChevronDown size={16} />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                    <button onClick={() => navigate("/admin/front-office/postal-dispatch")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                      Dispatch List
                    </button>
                    <button onClick={() => navigate("/admin/front-office/postal-receive")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                      Receive List
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/admin/front-office/complain-list")}
                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded"
              >
                Complain
              </button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <table className="min-w-full text-sm shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Visit To</th>
                <th className="p-3 text-left">IPD / OPD / Staff</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">In Time</th>
                <th className="p-3 text-left">Out Time</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && filteredVisitors.map((v) => (
                <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3">{v.purpose_name}</td>
                  <td className="p-3 text-blue-600">{v.name}</td>
                  <td className="p-3">{v.visit_to}</td>
                  <td className="p-3">{v.opd_ipd_staff}</td>
                  <td className="p-3">{v.phone}</td>
                  <td className="p-3">{new Date(v.date).toLocaleDateString()}</td>
                  <td className="p-3">{v.in_time}</td>
                  <td className="p-3">{v.out_time || "-"}</td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleView(v)}
                      className="bg-blue-100 p-2 rounded text-blue-600"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleEdit(v)}
                      className="bg-green-100 p-2 rounded text-green-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="bg-red-100 p-2 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredVisitors.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-5 text-center text-gray-500">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MODALS ================= */}
        <AddVisitor
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={fetchVisitors}
        />

        {showModal && selectedVisitor && (
          <VisitorDetails
            open={showModal}
            data={selectedVisitor}
            onClose={() => setShowModal(false)}
          />
        )}

        {editModal && selectedVisitor && (
          <UpdateVisitor
            open={editModal}
            data={selectedVisitor}
            onClose={() => setEditModal(false)}
            refresh={fetchVisitors}
          />
        )}
      </div>
    </AdminLayout>
  );
}
