
import useIpdDischarged from "../../hooks/useIpdDischarged";
import IpdToolbar from "../../components/ipd/IpdToolbar";
import IpdTable from "../../components/ipd/IpdTable";
import Pagination from "../../components/ipd/Pagination";
import AdminLayout from "../../layout/AdminLayout";
export default function IpdDischargedPatients() {
  const {
    search,
    setSearch,
    data,
    page,
    setPage,
    totalPages,
  } = useIpdDischarged();

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-4">
          IPD Discharged Patient
        </h1>

        <IpdToolbar search={search} setSearch={setSearch} />
        <IpdTable data={data} />
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </AdminLayout>
  );
}
