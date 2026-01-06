import React, { useState } from "react";



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
