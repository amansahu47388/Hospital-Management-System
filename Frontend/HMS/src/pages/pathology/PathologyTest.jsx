import React, { useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import GenerateTextModal from "../../components/Pathology/GenerateTextModal";
const testData = [
  {
    name: "Appendicitis",
    shortName: "Appendicitis",
    testType: "Appendicitis",
    category: "Hematology",
    subCategory: "Appendicitis",
    method: "open appendectomy",
    reportDays: 2,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Chest X-rays",
    shortName: "C",
    testType: "Chest X-rays",
    category: "Clinical Microbiology",
    subCategory: "Chest X-rays",
    method: "Painless imaging test",
    reportDays: 2,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Breast Ultrasound",
    shortName: "BU",
    testType: "Breast Ultrasound",
    category: "Clinical Microbiology",
    subCategory: "",
    method: "",
    reportDays: 2,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Vascular Sonography",
    shortName: "VSG",
    testType: "VSG",
    category: "Molecular Diagnostics",
    subCategory: "",
    method: "",
    reportDays: 2,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Signal-averaged electrocardiogram",
    shortName: "SAECG",
    testType: "SAECG",
    category: "Clinical Chemistry",
    subCategory: "",
    method: "",
    reportDays: 1,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Cardiac MRI",
    shortName: "CMRI",
    testType: "CMRI",
    category: "Clinical Microbiology",
    subCategory: "",
    method: "",
    reportDays: 1,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Liver test",
    shortName: "LFT",
    testType: "Liver test",
    category: "Clinical Microbiology",
    subCategory: "LFT",
    method: "Liver test",
    reportDays: 2,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Abdomen X-rays",
    shortName: "AX",
    testType: "Abdomen X-rays",
    category: "Clinical Microbiology",
    subCategory: "Abdomen X-rays",
    method: "Ionizing radiation",
    reportDays: 1,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
  {
    name: "Chest X-rays (COPD)",
    shortName: "C",
    testType: "COPD",
    category: "Molecular Diagnostics",
    subCategory: "COPD",
    method: "COPD",
    reportDays: 1,
    tax: 18,
    charge: 156,
    amount: 184.08,
  },
];

export default function PathologyTest() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);

  const filteredData = useMemo(() => {
    return testData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
              {filteredData.slice(0, pageSize).map((item, index) => (
                <tr key={index} className="border-t text-gray-500 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-indigo-600">
                    {item.name}
                  </td>
                  <td className="px-3 py-2">{item.shortName}</td>
                  <td className="px-3 py-2">{item.testType}</td>
                  <td className="px-3 py-2">{item.category}</td>
                  <td className="px-3 py-2">{item.subCategory || "-"}</td>
                  <td className="px-3 py-2">{item.method || "-"}</td>
                  <td className="px-3 py-2 text-center">{item.reportDays}</td>
                  <td className="px-3 py-2 text-center">{item.tax.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">{item.charge.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center font-semibold">
                    {item.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200">
                        <Pencil size={16} />
                      </button>
                      <button className="p-1 rounded hover:bg-red-100 text-red-600">
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
              <GenerateTextModal
             open={openAdd}
            onClose={() => setOpenAdd(false)}
            type="pathology"
/>

            
        </div>
      </div>
    </AdminLayout>
  );
}
