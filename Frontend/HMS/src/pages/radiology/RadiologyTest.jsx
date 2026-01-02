import AdminLayout from "../../layout/AdminLayout";
import useRadiologyTests from "../../hooks/useRadiologyTests";
import RadiologyTestHeader from "../../components/Radiology/RadiologyTestHeader";
import RadiologyTestTable from "../../components/Radiology/RadiologyTestTable";
import { useState } from "react";
import GenerateTestModal from "../../components/Pathology/GenerateTextModal";

export default function RadiologyTest() {
  const { search, setSearch, tests } = useRadiologyTests();
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen  to-[#8A63D2] p-1">

        <div className="bg-white/95 rounded-lg p-4 shadow">

          <RadiologyTestHeader
            search={search}
            setSearch={setSearch}
            onAdd={() => setOpenAdd(true)}
          />
        
          <RadiologyTestTable tests={tests} />
        </div>

        {/* Reuse your existing modal */}
        <GenerateTestModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          type="radiology"
        />
      </div>
    </AdminLayout>
  );
}
