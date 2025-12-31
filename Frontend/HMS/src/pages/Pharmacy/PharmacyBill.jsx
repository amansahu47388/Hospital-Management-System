import AdminLayout from "../../layout/AdminLayout";
import PharmacyHeader from "../../components/Pharmacy/PharmacyHeader";
import PharmacyTable from "../../components/Pharmacy/PharmacyTable";
import usePharmacyBills from "../../hooks/usePharmacyBills";

export default function PharmacyBill() {
  const { bills, search, setSearch, limit, setLimit } = usePharmacyBills();

  return (
    <AdminLayout>
      <div className="min-h-screen  p-2">

        <div className="bg-white rounded shadow overflow-hidden">

          <PharmacyHeader
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
          />

          <PharmacyTable bills={bills} />

        </div>
      </div>
    </AdminLayout>
  );
}
