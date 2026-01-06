import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {Plus, Eye, Pencil, Trash2 } from "lucide-react"
import GeneratePathologyBill from "../../components/Pathology/GeneratePathologyBill"; 
import { getPathologyBills, getPathologyBillDetail, deletePathologyBill } from "../../api/pathologyApi";
import UpdatePathologyBill from "../../components/Pathology/UpdatePathologyBill";
import { useNotify } from "../../context/NotificationContext";
import PathologyBillDetails from "../../components/Pathology/PathologyBillDetails";


export default function PathologyBill() {
  const navigate = useNavigate();
  const notify = useNotify();
  const hasFetchedRef = useRef(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [editBillId, setEditBillId] = useState(null);
  const [search, setSearch] = useState("");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);


useEffect(() => {
  if (hasFetchedRef.current) return;
  hasFetchedRef.current = true;
  loadBills();
}, []);


const filteredBills = useMemo(() => {
  return bills.filter((bill) => {
    const text = search.toLowerCase();

    return (
      bill.bill_no?.toLowerCase().includes(text) ||
      bill.patient_name?.toLowerCase().includes(text) ||
      bill.doctor_name?.toLowerCase().includes(text) ||
      bill.created_by_name?.toLowerCase().includes(text)
    );
  });
}, [search, bills]);

  



const loadBills = async (searchText = "") => {
  try {
    setLoading(true);
    const res = await getPathologyBills(searchText);
    const data =
      Array.isArray(res?.data)
        ? res.data
        : res?.data?.results || [];

    setBills(data);
  } catch (err) {
    console.error("Failed to load bills:", err);
    setBills([]);
  } finally {
    setLoading(false);
  }
};


  const handleViewDetail = async (billId) => {
    try {
      const res = await getPathologyBillDetail(billId);
      const data = res?.data || res;
      setSelectedBillId(billId);
      setShowDetail(true);
    } catch (err) {
      notify("error", "failed to load bill details")
    }
  };

  const handleEdit = (billId) => {
  setEditBillId(billId);
  setOpenUpdate(true);
};



const handleDelete = async (billId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this pathology bill?"
  );

  if (!confirmDelete) return;

  try {
    await deletePathologyBill(billId);
    notify("success", "Bill deleted successfully");
    loadBills();
  } catch (error) {
    notify(
      "error",
      error?.response?.data?.message || "Failed to delete bill"
    );
  }
};


  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-gray-50 rounded-lg shadow border border-gray-200 p-4 md:p-6">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">Pathology Bills</h2>

              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                              onClick={() => setOpenGenerate(true)}
                >
                  <Plus size={16} /> Generate Bill
                   
                </button>

                <button   
                  onClick={() => navigate("/admin/pathology-tests")}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                >
                  Pathology Test
                </button>
              </div>
            </div>

            {/* SEARCH + ACTIONS */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full lg:w-64"
              />

              <div className="flex flex-wrap gap-3 items-center justify-between lg:justify-end">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border px-2 py-2 rounded text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <div className="flex gap-2">
                  {/* <FileText size={18} className="cursor-pointer text-gray-600" />
                  <FileSpreadsheet size={18} className="cursor-pointer text-gray-600" />
                  <File size={18} className="cursor-pointer text-gray-600" />
                  <Printer size={18} className="cursor-pointer text-gray-600" /> */}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto" >
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : bills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bills found</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-200 ">
                    <tr>
                      <th className="px-2 py-4 text-center">Bill No</th>
                      <th className="px-2 py-4 text-center">Case ID</th>
                      <th className="px-2 py-4 text-center">Doctor</th>
                      <th className="px-2 py-4 text-center">Patient Name</th>
                      <th className="px-2 py-4 text-center">Bill Date</th>
                      <th className="px-2 py-4 text-center">Generated By</th>
                      <th className="px-2 py-4 text-center">Amount</th>
                      <th className="px-2 py-4 text-center">Discount</th>
                      <th className="px-2 py-4 text-center">Tax</th>
                      <th className="px-2 py-4 text-center">Net Amount ($)</th>
                      <th className="px-2 py-4 text-center">Paid ($)</th>
                      <th className="px-2 py-4 text-center">Balance</th>
                      <th className="px-2 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredBills.slice(0, limit).map((bill) => (
                      <tr key={bill.id} className="border-t hover:bg-gray-50">
                        <td className="p-2 text-center font-medium">{bill.bill_no || `#${bill.id}`}</td>
                        <td className="p-2 text-center">
                          {bill.case_id || "-"}
                        </td>
                        <td className="p-2 text-center">{bill.doctor_name || "-"}</td>
                        <td className="p-2 text-center">{bill.patient_name || "-"}</td>
                        <td className="p-2 text-center">
                          {bill.created_at ? new Date(bill.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-2 text-center">{bill.created_by_name || "-"}</td>
                        <td className="p-2 text-center">{Number(bill.subtotal || 0).toFixed(2)}</td>
                        <td className="p-2 text-center">{Number(bill.discount || 0).toFixed(2)}</td>
                        <td className="p-2 text-center">{Number(bill.tax || 0).toFixed(2)}</td>
                       
                        <td className="p-2 text-center font-semibold">{Number(bill.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2 text-center">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                        <td
                          className={`p-2 text-center ${
                            Number(bill.balance || 0) > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {Number(bill.balance || 0).toFixed(2)}
                        </td>
                        
                      <td className="px-3 py-2">
                    <div className="flex justify-center gap-2">
                     <button
                      title="view"
                        onClick={(e) => {
                          handleViewDetail(bill.id);
                        }} 
                      >
                        <Eye size={16} />
                      </button>
                     <button
                     title="Edit"
                        onClick={() => handleEdit(bill.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                     <button
                     title="Delete"
                      onClick={() => handleDelete(bill.id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                    </div>
                  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
        <GeneratePathologyBill
          open={openGenerate}
          onClose={() => {
            setOpenGenerate(false);
            loadBills(); // Refresh bills list after closing
          }}
        /> 
        <UpdatePathologyBill
          open={openUpdate}
          billId={editBillId}
          onClose={() => {
            setOpenUpdate(false);
            setEditBillId(null);
            loadBills();
          }}
          />
          <PathologyBillDetails
          open={showDetail}
          billId={selectedBillId}
          onClose={() => {
            setShowDetail(false);
            setSelectedBillId(null);
          }}
        />


    </AdminLayout>
  );
}

