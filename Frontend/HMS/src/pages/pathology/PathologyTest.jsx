import React, { useEffect, useMemo, useState, useRef } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import AddPathologyTest from "../../components/Pathology/AddPathologyTest";
import { getPathologyTests } from "../../api/pathologyApi";
import { useNotify } from "../../context/NotificationContext";
import { deletePathologyTest } from "../../api/pathologyApi";
import PathologyTestDetails from "../../components/Pathology/PathologyTestDetails";
import UpdatePathologyTest from "../../components/Pathology/UpdatePathologyTest";

export default function PathologyTest() {
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await getPathologyTests();
      setTests(res.data);
    } catch {
      notify("error", "Failed to load pathology tests");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (hasFetchedRef.current) return;
  hasFetchedRef.current = true;
  fetchTests();
}, []);


  const filteredData = useMemo(() => {
    return tests.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, tests]);


  /* ================= EDIT HANDLER ================= */
  const handleEdit = (test) => {
    setSelectedTest(test);
    setOpenUpdate(true);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this pathology test?")) {
    return;
  }
  try {
    await deletePathologyTest(id);
    notify("success", "Pathology test deleted");
    fetchTests(); // reload list
  } catch (err) {
    notify("error", "Failed to delete pathology test");
  }
};

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center bg-white p-4 shadow md:justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Pathology Test
          </h1>

          <button
           onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
          <Plus size={18} />
              Add Pathology Test
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded-md px-3 py-2 w-24"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr >
                <th className="px-3 py-2 text-left">Test Name</th>
                <th className="px-3 py-2">Short Name</th>
                <th className="px-3 py-2">Test Type</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Sub Category</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Report Days</th>
                <th className="px-3 py-2">Tax (%)</th>
                <th className="px-3 py-2">Charge ($)</th>
                <th className="px-3 py-2">Amount ($)</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.slice(0, pageSize).map((test) => (
                <tr key={test.id} className="border-t border-gray-200 text-gray-600 hover:bg-gray-100">
                  <td className="px-3 py-2 font-medium text-indigo-600">
                    {test.test_name}
                  </td>
                  <td className="px-3 py-2  text-center">{test.short_name}</td>
                  <td className="px-3 py-2  text-center">{test.test_type}</td>
                  <td className="px-3 py-2  text-center">{test.category_name || "-"}</td>
                  <td className="px-3 py-2  text-center">{test.sub_category || "-"}</td>
                  <td className="px-3 py-2  text-center">{test.method || "-"}</td>
                  <td className="px-3 py-2 text-center">{test.report_days}</td>
                  <td className="px-3 py-2 text-center">{test.tax}</td>
                  <td className="px-3 py-2 text-center">{test.standard_charge}</td>
                  <td className="px-3 py-2 text-center font-semibold">
                    {test.total_amount}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-2">
                     <button
                      title="view"
                        onClick={(e) => {
                          setSelectedTest(test);
                          setShowDetail(true);
                        }} 
                      >
                        <Eye size={16} />
                      </button>
                     <button
                        onClick={() => handleEdit(test)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                     <button
                      onClick={() => handleDelete(test.id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-500">
                    No pathology tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
              <AddPathologyTest
             open={openAdd}
            onClose={() => setOpenAdd(false)}
            />    

            <PathologyTestDetails
              open={showDetail}
              test={selectedTest}
              onClose={() => setShowDetail(false)}
              onDelete={(id) => setTests(prev => prev.filter(test => test.id !== id))}
              onDischarge={() => { setShowDetail(false); fetchIpd(); }}
              /> 
            <UpdatePathologyTest
              open={openUpdate}
              test={selectedTest}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedTest(null);
                fetchTests();
              }}
            />  
        </div>
      </div>
    </AdminLayout>
  );
}


