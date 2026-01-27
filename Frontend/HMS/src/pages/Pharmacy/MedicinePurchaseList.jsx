import React, { useState, useEffect, useRef} from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import PurchaseMedicine from "../../components/Pharmacy/Purchase/PurchaseMedicine";
import { useNotify } from "../../context/NotificationContext";
import { getPurchases, deletePurchase, getPurchase  } from "../../api/pharmacyApi";
import PurchaseDetails from "../../components/Pharmacy/Purchase/PurchaseDetails";



export default function MedicinePurchaseList() {
    const notify = useNotify();
    const hasFetched = useRef(false);
    const [search, setSearch] = useState("");
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);


  
useEffect(() => {
  if (!hasFetched.current) {
    hasFetched.current = true;
    fetchPurchases();
    return;
  }

  // This runs only when search changes
  fetchPurchases();
}, [search]);

  
  const fetchPurchases = async () => {
  try {
    setLoading(true);
    const res = await getPurchases({ search });
      setPurchases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      notify("error","Failed to load purchases");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

const openPurchaseDetails = async (id) => {
  try {
    setLoading(true);
    const res = await getPurchase(id);
    setSelectedPurchase(res.data);
    setOpenDetails(true);
  } catch {
    notify("error","Failed to load purchase details");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
  if (!window.confirm("Delete purchase?")) return;

  try {
    setLoading(true);
    await deletePurchase(id);
    notify("success","Purchase deleted successfully");

    // If currently viewing same purchase, close it
    if (selectedPurchase?.id === id) {
      setOpenDetails(false);
      setSelectedPurchase(null);
    }

    await fetchPurchases();
  } catch {
    notify("error", "Failed to delete purchase");
  } finally {
    setLoading(false);
  }
};


  return (
    <AdminLayout>
        {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-6 py-3 rounded shadow text-sm font-medium">
            Loading...
          </div>
        </div>
        )}

      <div className="min-h-screen">
        <div className="bg-white rounded-lg p-4 shadow">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-black">
              Medicine Purchase List
            </h2>

            <button
              onClick={() => setOpenPurchaseModal(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                         text-white px-3 py-2 rounded text-sm
                         hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={16} />
              Purchase Medicine
            </button>
          </div>

          {/* SEARCH */}
          <div className="my-4">
            <input
              value={search}
              onChange={(e) => {
                hasFetched.current = true;
                setSearch(e.target.value);
              }}

              placeholder="Search..."
              className="border rounded px-3 py-2 w-full md:w-72"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full thin-scrollbar">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">Pharmacy Purchase No</th>
                  <th className="p-2 text-left">Purchase Date</th>
                  <th className="p-2 text-left">Bill No</th>
                  <th className="p-2 text-left">Supplier Name</th>
                  <th className="p-2 text-left">Total ($)</th>
                  <th className="p-2 text-left">Discount ($)</th>
                  <th className="p-2 text-left">Tax (%)</th>
                  <th className="p-2 text-left">Net Amount ($)</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {(!loading && purchases.length === 0) ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No purchase records found
                    </td>
                  </tr>
                ) : (
                  purchases.map((item) => (
                    <tr
                      key={item.id}
                      className=" text-sm hover:bg-gray-100"
                    >
                      <td className="p-2">
                        PCHNO{item.id}
                      </td>
                      <td className="p-2">{new Date(item.purchase_date).toLocaleString()}</td>
                      <td className="p-2">{item.bill_no || "-"}</td>
                      <td className="p-2">{item.supplier_name || item.supplier}</td>
                      <td className="p-2">
                        {Number(item.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">
                        {Number(item.discount_amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">
                        {Number(item.tax_amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2 font-semibold">
                        {Number(item.net_amount || 0).toFixed(2)}
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                      <button
                      title="View"
                      className="text-blue-600"
                      onClick={() => openPurchaseDetails(item.id)}
                    >
                      <Eye size={18} />
                    </button>


                        <button
                          title="Delete"
                          className="text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PURCHASE MODAL */}
        <PurchaseMedicine
          open={openPurchaseModal}
          onClose={() => setOpenPurchaseModal(false)}
          onSaved={fetchPurchases}
        />

        {openDetails && selectedPurchase && (
          <PurchaseDetails
            data={selectedPurchase}
            onClose={() => {
              setOpenDetails(false);
              setSelectedPurchase(null);
            }}
          />
        )}


      </div>
    </AdminLayout>
  );
}
