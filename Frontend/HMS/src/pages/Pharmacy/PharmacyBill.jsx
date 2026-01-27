import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import GeneratePharmacyBill from "../../components/Pharmacy/GeneratePharmacyBill";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNotify } from "../../context/NotificationContext";
import { getPharmacyBills, deletePharmacyBill, generatePharmacyBill as generatePharmacyBillApi, } from "../../api/pharmacyApi";
import PharmacyBillDetail from "../../components/Pharmacy/PharmacyBillDetails";
import UpdatePharmacyBill from "../../components/Pharmacy/UpdatePharmacyBill";



export default function PharmacyBillList() {
  const notify = useNotify();
  const isFetching = useRef(false);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openGenerateBill, setOpenGenerateBill] = useState(false);
  const [viewBill, setViewBill] = useState(null);
  const [editBill, setEditBill] = useState(null);



  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchBills();  
  }, []);


  const fetchBills = async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await getPharmacyBills({ limit });
      setBills(Array.isArray(res.data) ? res.data : []);
    } catch {
      notify("error", "Failed to load pharmacy bills");
      setBills([]);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };




  const filteredBills = useMemo(() => {
    if (!search) return bills;

    const term = search.toLowerCase();

    return bills.filter(b =>
      String(b.id).includes(term) ||
      b.patient_name?.toLowerCase().includes(term) ||
      b.doctor_name?.toLowerCase().includes(term) ||
      b.created_by_name?.toLowerCase().includes(term)
    );
  }, [bills, search]);




  const deleteBill = async (id) => {
    if (!window.confirm("Delete bill?")) return;
    try {
      setLoading(true);
      await deletePharmacyBill(id);
      notify("success","Bill deleted successfully");
      fetchBills();
    } catch (err) {
      notify("error","Failed to delete bill");
    } finally {
      setLoading(false);
    }
  };

  const createBill = async (data) => {
    try {
      setLoading(true);
      const res = await generatePharmacyBillApi(data);
      notify("success","Bill generated successfully");
      fetchBills();
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Failed to generate bill";
      notify("error",msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-3 py-2 rounded shadow text-sm font-medium">
            Loading...
          </div>
        </div>
      )}
      <div className="min-h-screen">
        <div className="bg-white rounded shadow overflow-hidden">

          {/* HEADER */}
          <div className=" bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Pharmacy Bill
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setOpenGenerateBill(true)}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-3 py-2 rounded text-sm
                             hover:opacity-90"
                >
                  + Generate Bill
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/pharmacy-bill/medicine-stock")
                  }
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-3 py-2 rounded text-sm
                             hover:opacity-90"
                >
                  Medicines
                </button>
              </div>
            </div>

            {/* SEARCH & LIMIT */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="border px-3 py-2 rounded w-64"
              />

              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <button className="border px-2 py-1 rounded">📄</button>
                <button className="border px-2 py-1 rounded">📑</button>
                <button className="border px-2 py-1 rounded">🖨</button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Bill No</th>
                  <th className="px-3 py-2 text-left">Case ID</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Patient Name</th>
                  <th className="px-3 py-2 text-left">Generated By</th>
                  <th className="px-3 py-2 text-left">Doctor Name</th>
                  <th className="px-3 py-2 text-right">Amount ($)</th>
                  <th className="px-3 py-2 text-right">Discount ($)</th>
                  <th className="px-3 py-2 text-right">Tax ($)</th>
                  <th className="px-3 py-2 text-right">Net Amount ($)</th>
                  <th className="px-3 py-2 text-right">Paid Amount ($)</th>
                  <th className="px-3 py-2 text-right">Refund ($)</th>
                  <th className="px-3 py-2 text-right">Balance ($)</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan="14"
                      className="text-center py-6 text-gray-500"
                    >
                      No pharmacy bills found
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((row) => (
                    <tr
                      key={row.id}
                      className=" hover:bg-gray-100 text-sm"
                    >
                      <td className="px-3 py-2 text-blue-600 font-medium">
                        {row.id}
                      </td>
                      <td className="px-3 py-2">{row.case_id || "-"}</td>
                      <td className="px-3 py-2">{new Date(row.bill_date || row.created_at || Date.now()).toLocaleString()}</td>
                      <td className="px-3 py-2">{row.patient_name}</td>
                      <td className="px-3 py-2">{row.created_by_name || "-"}</td>
                      <td className="px-3 py-2">{row.doctor_name || row.doctor || "-"}</td>

                      <td className="px-3 py-2 text-right">
                        {Number(row.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.discount_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.tax_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.net_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.paid_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.refund_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(row.balance_amount || 0).toFixed(2)}
                      </td>

                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            title="View"
                            className="text-blue-600"
                            onClick={() => setViewBill(row)}
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            title="Edit"
                            className="text-purple-600"
                            onClick={() => setEditBill(row)}
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            title="Delete"
                            className="text-red-600"
                            onClick={() => deleteBill(row.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <GeneratePharmacyBill
            open={openGenerateBill}
            onClose={() => setOpenGenerateBill(false)}
            onSuccess={fetchBills}
            onSave={createBill}
          />
          {viewBill && (
            <PharmacyBillDetail
              bill={viewBill}
              onClose={() => setViewBill(null)}
            />
          )}

          {editBill && (
            <UpdatePharmacyBill
              bill={editBill}
              onClose={() => setEditBill(null)}
              onUpdated={fetchBills}
            />
          )}


        </div>
      </div>
    </AdminLayout>
  );
}
