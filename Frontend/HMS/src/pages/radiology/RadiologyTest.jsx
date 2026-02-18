import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";

import AddRadiologyTest from "../../components/Radiology/AddRadiologyTest";
import UpdateRadiologyTest from "../../components/Radiology/UpdateRadiologyTest";
import RadiologyTestDetails from "../../components/Radiology/RadiologyTestDetails";

import {
  getRadiologyTests,
  deleteRadiologyTest,
} from "../../api/radiologyApi";

import { useNotify } from "../../context/NotificationContext";

export default function RadiologyTest() {
  const notify = useNotify();

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  /* ================= FETCH TESTS ================= */
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await getRadiologyTests();
      setTests(res.data);
    } catch {
      notify("error", "Failed to load radiology tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = useMemo(() => {
    return tests.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, tests]);

  /* ================= EDIT ================= */
  const handleEdit = (test) => {
    setSelectedTest(test);
    setOpenUpdate(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this radiology test?")) {
      return;
    }
    try {
      await deleteRadiologyTest(id);
      notify("success", "Radiology test deleted");
      fetchTests();
    } catch {
      notify("error", "Failed to delete radiology test");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Radiology Test
          </h1>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={18} />
            Add Radiology Test
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
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-[#6046B5] outline-none"
            />
          </div>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 px-2 py-2 rounded text-sm focus:border-[#6046B5] focus:ring-[#6046B5] outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto thin-scrollbar ">
          <table className="w-full text-sm text-gray-600 ">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-2 py-3 text-left">Test Name</th>
                <th className="px-2 py-3">Short Name</th>
                <th className="px-2 py-3">Test Type</th>
                <th className="px-2 py-3">Category</th>
                <th className="px-2 py-3">Sub Category</th>
                <th className="px-2 py-3">Method</th>
                <th className="px-2 py-3">Report Days</th>
                <th className="px-2 py-3">Tax (%)</th>
                <th className="px-2 py-3">Charge ($)</th>
                <th className="px-2 py-3">Amount ($)</th>
                <th className="px-2 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.slice(0, pageSize).map((test) => (
                <tr
                  key={test.id}
                  className="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-2 py-3 font-medium text-indigo-600">
                    {test.test_name}
                  </td>
                  <td className="px-2 py-3">{test.short_name}</td>
                  <td className="px-2 py-3">{test.test_type}</td>
                  <td className="px-2 py-3">{test.category_name || "-"}</td>
                  <td className="px-2 py-3">{test.sub_category || "-"}</td>
                  <td className="px-2 py-3">{test.method || "-"}</td>
                  <td className="px-2 py-3">{test.report_days}</td>
                  <td className="px-2 py-3">{test.tax}</td>
                  <td className="px-2 py-3">{test.standard_charge}</td>
                  <td className="px-2 py-3 font-semibold">
                    {test.total_amount}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        title="View"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowDetail(true);
                        }}
                        className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEdit(test)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
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
                    No radiology tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* MODALS */}
          <AddRadiologyTest
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            onSuccess={fetchTests}
          />

          <RadiologyTestDetails
            open={showDetail}
            test={selectedTest}
            onClose={() => setShowDetail(false)}
          />

          <UpdateRadiologyTest
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
