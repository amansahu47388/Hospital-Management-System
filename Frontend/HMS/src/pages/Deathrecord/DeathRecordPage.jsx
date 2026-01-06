import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import useDeathRecords from "../../hooks/useDeathRecords";
import DeathRecordHeader from "../../components/Deathrecord/DeathRecordHeader";
import DeathRecordTable from "../../components/Deathrecord/DeathRecordTable";
import AddDeathRecordModal from "../../components/Deathrecord/AddDeathRecordModal";
import DeathRecordDetailsModal from "../../components/Deathrecord/DeathRecordDetailsModal";
import EditDeathRecordModal from "../../components/Deathrecord/EditDeathRecordModal";
export default function DeathRecordPage() {
  const { records, search, setSearch, deleteRecord } = useDeathRecords();
  const [openModal, setOpenModal] = useState(false);


  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleView = (record) => {
    setSelectedRecord(record);
    setOpenDetails(true);
  };

  // const handleEdit = (record) => {
  //   console.log("EDIT DEATH RECORD", record);
  // };

  const handleDelete = (record) => {
    if (!window.confirm("Delete this death record?")) return;
    console.log("DELETE DEATH RECORD", record);
  };

  const [openEdit, setOpenEdit] = useState(false);
const [selectedRecord1, setSelectedRecord1] = useState(null);

const handleEdit = (record) => {
  setSelectedRecord1(record);
  setOpenEdit(true);
};

const handleSave = (updatedData) => {
  console.log("UPDATE DEATH RECORD API", updatedData);
};

  return (
    <AdminLayout>
      <div className="min-h-full p-1">
        <div className="max-w-7xl mx-auto">
          <DeathRecordHeader
            setOpenModal={setOpenModal}
            search={search}
            setSearch={setSearch}
          />

          <DeathRecordTable
            records={records}
            onDelete={deleteRecord}
            onView={handleView}
            onEdit={handleEdit}
          />

          <AddDeathRecordModal
          open={openModal}
          onClose={() => setOpenModal(false)}
         
        />


        <DeathRecordDetailsModal
          open={openDetails}
          onClose={() => setOpenDetails(false)}
          record={selectedRecord}
          // onEdit={handleEdit}
          
        />

        <EditDeathRecordModal
        open={openEdit}
       onClose={() => setOpenEdit(false)}
      record={selectedRecord1}
  onSave={handleSave}
/>
        </div>
      </div>
    </AdminLayout>
  );
}
