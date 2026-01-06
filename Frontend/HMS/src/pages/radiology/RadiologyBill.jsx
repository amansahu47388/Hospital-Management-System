import React, { useState } from "react";
// import AdminLayout from "../../layout/AdminLayout";
// import useRadiologyBills from "../../hooks/useRadiologyBills";
// import RadiologyHeader from "../../components/Radiology/RadiologyHeader";
// import RadiologyTable from "../../components/Radiology/RadiologyTable";
// import GenerateTextModal from "../../components/Pathology/GenerateTextModal";
export default function RadiologyBill() {
  const { search, setSearch, bills } = useRadiologyBills();
  const [openGenerate, setOpenGenerate] = useState(false);
  return (
    <AdminLayout>
      <div className="min-h-screen  p-1">

        <div className="bg-white/95 rounded-lg p-4 shadow">

          <RadiologyHeader search={search}     setSearch={setSearch} />
           
          <RadiologyTable bills={bills} />
       
        </div>
      </div>

      <GenerateTextModal
      open={openGenerate}
      onClose={() => setOpenGenerate(false)}
      type="radiology"
     />
    </AdminLayout>
  );
}
