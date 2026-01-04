import { useState }  from "react";
import AdminLayout from "../../layout/AdminLayout";
import BirthRecordHeader from "../../components/birthrecord/BirthRecordHeader";
import BirthRecordTable from "../../components/birthrecord/BirthRecordTable";
import useBirthRecords from "../../hooks/useBirthRecords";
import AddBirthRecordModal from "../../components/BirthRecord/AddBirthRecordModal"
export default function BirthRecord() {
  const { search, setSearch, data } = useBirthRecords();

  return (
    <AdminLayout>
      <div className="min-h-full  p-1">
        <div className="bg-white rounded shadow p-4 max-w-7xl mx-auto">
          <BirthRecordHeader
            search={search}
            setSearch={setSearch}
          />
          <BirthRecordTable data={data} />
        </div>
      </div>
    </AdminLayout>
  );
}
