import { useState }  from "react";
import AdminLayout from "../../layout/AdminLayout";
import BirthRecordHeader from "../../components/Birthrecord/BirthRecordHeader";
import BirthRecordTable from "../../components/Birthrecord/BirthRecordTable";
import useBirthRecords from "../../hooks/useBirthRecords";
import AddBirthRecordModal from "../../components/Birthrecord/AddBirthRecordModal"
import BirthRecordDetailsModal from "../../components/Birthrecord/BirthRecordDetailsModal";
import EditBirthRecordModal from "../../components/Birthrecord/EditBirthRecordModal";
export default function BirthRecord() {
  const { search, setSearch, data } = useBirthRecords();
  const [openAdd, setOpenAdd] = useState(false);
   const [openDetails, setOpenDetails] = useState(false);
   const [selectedRecord, setSelectedRecord] = useState(null);
   const handleView = (record) => {
    setSelectedRecord(record);
    setOpenDetails(true);
  };


  const [openEdit, setOpenEdit] = useState(false);
const [selectedRecord2, setSelectedRecord2] = useState(null);

const handleEdit = (record) => {
  setSelectedRecord2(record);
  setOpenEdit(true);
};

const handleSave = (updatedRecord) => {
  console.log("UPDATE API CALL", updatedRecord);
};

//deleting

const handleDelete = (record) => {
  if (!record?.id) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this birth record?"
  );

  if (!confirmDelete) return;

  // 🔥 API CALL GOES HERE
  console.log("Deleting record:", record);

  // Example: remove from UI (temporary)
  setRecords((prev) =>
    prev.filter((item) => item.id !== record.id)
  );
};

  return (
    <AdminLayout>
      <div className="min-h-full  p-1">
        <div className="bg-white rounded shadow p-4 max-w-7xl mx-auto">
          <BirthRecordHeader
            search={search}
            setSearch={setSearch}
            setOpenAdd={setOpenAdd}
          />
          <BirthRecordTable data={data} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
          <AddBirthRecordModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />

        <BirthRecordDetailsModal
          open={openDetails}
          onClose={() => setOpenDetails(false)}
          record={selectedRecord || {}}
        />


        <EditBirthRecordModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        record={selectedRecord}
        onSave={handleSave}
/>
        </div>
      </div>
    </AdminLayout>
  );
}
