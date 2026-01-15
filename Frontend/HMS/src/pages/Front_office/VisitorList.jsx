import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import VisitorHeader from "../../components/Front_office/VisitorHeader";
import VisitorTable from "../../components/Front_office/VisitorTable";
import { useVisitors } from "../../hooks/useVisitors";
import AddVisitorModal from "../../components/Front_office/AddVisitorModal";
import ShowVisitorModal from "../../components/Front_office/ShowVisitorModal";
import EditVisitorModal from "../../components/Front_office/EditVisitorModal";
export default function VisitorList() {
  const { visitors } = useVisitors();
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
    if (confirm("Are you sure you want to delete?")) {
      console.log("Delete ID:", id);
      // API CALL HERE
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
       <VisitorHeader setOpenAdd={setOpenAdd} />
        <VisitorTable visitors={visitors}   onShow={handleShow}
          onEdit={handleEdit}
          onDelete={handleDelete} />
        <AddVisitorModal open={openAdd} onClose={() => setOpenAdd(false)} />

         {showModal && selectedRow && (
  <ShowVisitorModal
    open={editModal}
    data={selectedRow}
    onClose={() => setShowModal(false)}
  />
)}

{editModal && selectedRow && (
  <EditVisitorModal
    open={editModal}
    data={selectedRow}
    onClose={() => setEditModal(false)}
  />
)}

      </div>
    </AdminLayout>
  );
}
