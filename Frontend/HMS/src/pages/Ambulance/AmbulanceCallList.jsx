import React,{ useState,useMemo } from "react";

import AdminLayout from "../../layout/AdminLayout";
import AmbulanceHeader from "../../components/Ambulance/AmbulanceHeader";
import AmbulanceTable from "../../components/Ambulance/AmbulanceTable";
import useAmbulanceCalls from "../../hooks/useAmbulanceCalls";
import AddAmbulanceCallModal from "../../components/Ambulance/AddAmbulanceCallModal";

export default function AmbulanceCallList() {
  const { search, setSearch, data } = useAmbulanceCalls();
  const [open, setOpen] = useState(false);
  const [onClose, setClose] = useState(false);
  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-4">
        <AmbulanceHeader
          search={search}
          setSearch={setSearch}
          onAdd={() => setOpen(true)}
        />

        <AmbulanceTable data={data} />


        <AddAmbulanceCallModal
  open={open}
  onClose={() => setOpen(false)}
/>
      </div>
    </AdminLayout>
  );
}
