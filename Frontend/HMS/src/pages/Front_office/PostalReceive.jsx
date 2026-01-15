import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus } from "lucide-react";
import AddReceiveModal from "../../components/Front_office/AddReceiveModal";
import ActionButtons from "../../components/Front_office/ActionButtons";
import ShowReceiveModal from "../../components/Front_office/ShowReceiveModal";
import EditReceiveModal from "../../components/Front_office/EditReceiveModal";

export default function PostalReceive() {
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

  const receiveList = [
    {
      id: 1,
      fromTitle: "Medical Information",
      refNo: "RFN678546",
      toTitle: "Medical Information",
      address: "Smart Hospital, UK",
      note: "",
      date: "01/30/2026",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-md p-3">
          <h2 className="text-lg font-semibold">Postal Receive</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Receive
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "From Title",
                  "Reference No",
                  "To Title",
                  "Address",
                  "Note",
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
              {receiveList.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 group">
                  <td className="px-3 py-2">{row.fromTitle}</td>
                  <td className="px-3 py-2">{row.refNo}</td>
                  <td className="px-3 py-2">{row.toTitle}</td>
                  <td className="px-3 py-2">{row.address}</td>
                  <td className="px-3 py-2">{row.note || "-"}</td>
                  <td className="px-3 py-2">{row.date}</td>

                  {/* Action */}
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

        {/* Add Modal */}
        {openAdd && (
          <AddReceiveModal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
          />
        )}

        {/* Show Modal */}
        {showModal && selectedRow && (
          <ShowReceiveModal
            open={showModal}
            data={selectedRow}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Edit Modal */}
        {editModal && selectedRow && (
          <EditReceiveModal
            open={editModal}
            data={selectedRow}
            onClose={() => setEditModal(false)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
