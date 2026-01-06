import RadiologyHeader from "../../components/Radiology/RadiologyHeader";
import RadiologyTable from "../../components/Radiology/RadiologyTable";
import useRadiologyBills from "../../hooks/useRadiologyBills";
import AdminLayout from "../../layout/AdminLayout";

export default function RadiologyBill() {
  const { bills, search, setSearch } = useRadiologyBills();

  return (
    <AdminLayout>
      {/* PAGE BACKGROUND */}
      <div className="p-4 min-h-full bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
        <div className="max-w-7xl mx-auto">
          <RadiologyHeader
            search={search}
            setSearch={setSearch}
          />

          <RadiologyTable bills={bills} />
        </div>
      </div>
    </AdminLayout>
  );
}
