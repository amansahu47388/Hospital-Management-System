import PathologyHeader from "../../components/Pathology/PathologyHeader";
import PathologyTable from "../../components/Pathology/PathologyTable";
import usePathologyBills from "../../hooks/usePathologyBills";
import AdminLayout from "../../layout/AdminLayout";
export default function PathologyBill() {
  const { bills, search, setSearch } = usePathologyBills();

  return (
    <AdminLayout>
      {/* PAGE BACKGROUND */}
      <div className="p-4 min-h-full bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
        <div className="max-w-7xl mx-auto">
          <PathologyHeader
            search={search}
            setSearch={setSearch}
          />

          <PathologyTable bills={bills} />
        </div>
      </div>
    </AdminLayout>
  );
}