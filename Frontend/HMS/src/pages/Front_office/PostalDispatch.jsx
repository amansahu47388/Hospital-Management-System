import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus } from "lucide-react";
import AddDispatchModal from "../../components/Front_office/AddDispatchModal";
import ActionButtons from "../../components/Front_office/ActionButtons";
import ShowDispatchModal from "../../components/Front_office/ShowDispatchModal";
import EditDispatchModal from "../../components/Front_office/EditDispatchModal";

export default function PostalDispatch() {
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleShow = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      console.log("Delete ID:", id);
      // 🔥 API CALL HERE
    }
  };

  const dispatchList = [
    {
      id: 1,
      toTitle: "Patient Daily Clothes",
      refNo: "RFN6754",
      fromTitle: "Patient Daily Clothes",
      address: "",
      note: "",
      date: "01/31/2026",
    },
    {
      id: 2,
      toTitle: "Cardiac SPECT perfusion",
      refNo: "RFN9008",
      fromTitle: "Cardiac SPECT perfusion",
      address: "",
      note: "",
      date: "01/26/2026",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-md p-3">
          <h2 className="text-lg font-semibold">Postal Dispatch List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Dispatch
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "To Title",
                  "Reference No",
                  "From Title",
                  "Date",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dispatchList.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 group">
                  <td className="px-3 py-2">{row.toTitle}</td>
                  <td className="px-3 py-2">{row.refNo}</td>
                  <td className="px-3 py-2">{row.fromTitle}</td>
                  <td className="px-3 py-2">{row.date}</td>

                  {/* ACTION FIELD */}
                  <td className="px-3 py-2">
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <ActionButtons
                        row={row}
                        onShow={handleShow}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD MODAL */}
        {openAdd && (
          <AddDispatchModal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
          />
        )}

        {/* SHOW MODAL */}
        {showModal && selectedRow && (
          <ShowDispatchModal
            open={showModal}
            data={selectedRow}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* EDIT MODAL */}
        {editModal && selectedRow && (
          <EditDispatchModal
            open={editModal}
            data={selectedRow}
            onClose={() => setEditModal(false)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
