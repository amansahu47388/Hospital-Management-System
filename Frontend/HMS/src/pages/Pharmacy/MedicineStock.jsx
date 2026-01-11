import React, { useEffect, useState, useRef } from "react";
import { Plus, ShoppingCart, Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import AddMedicineModal from "../../components/Pharmacy/Medicine/AddMedicine";
import { getMedicines, deleteMedicine,getMedicineDetail, getMedicineStock } from "../../api/pharmacyApi";
import { useNotify } from "../../context/NotificationContext";
import MedicineDetails from "../../components/Pharmacy/Medicine/MedicineDetails";
import UpdateMedicine from "../../components/Pharmacy/Medicine/UpdateMedicine";


const buttonClass =
  "flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] " +
  "text-white px-3 py-2 rounded text-sm hover:opacity-90 transition";

export default function MedicineStock() {
  const navigate = useNavigate();
  const notify = useNotify();
  const hasFetched = useRef(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMedicine, setViewMedicine] = useState(null);
  const [stockList, setStockList] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);


  /* ---------------- FETCH MEDICINES ---------------- */
useEffect(() => {
  if (hasFetched.current) return;

  hasFetched.current = true;
  fetchMedicines();
}, []);



  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await getMedicines({ search: search || undefined });
      console.debug("getMedicines response:", res.data);
      setMedicines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load medicines", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to load medicines";
      notify("error",msg);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };



  /* ---------------- DELETE SELECTED ---------------- */
const handleDelete = async (id) => {
  if (!window.confirm("Delete this medicine?")) return;

  try {
    setLoading(true);
    await deleteMedicine(id);
    notify("success","Medicine deleted");
    fetchMedicines();
  } catch (err) {
    notify("error",err.response?.data?.detail||"Delete failed");
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
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-lg p-4 shadow">

          {/* HEADER + ACTIONS */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
            <h2 className="text-xl font-semibold">Medicines Stock</h2>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:justify-end">
              <button onClick={() => setOpen(true)} className={buttonClass}>
                <Plus size={16} /> Add Medicine
              </button>

              <button
                onClick={() =>
                  navigate("/admin/pharmacy-bill/medicine-purchase-list")
                }
                className={buttonClass}
              >
                <ShoppingCart size={16} /> Purchase
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="w-full md:w-72 mb-4">
            <input
              value={search}
                onChange={(e) => {
                hasFetched.current = false;
                setSearch(e.target.value);
                fetchMedicines();
              }}

              placeholder="Search..."
              className="border rounded px-3 py-2 w-full"
            />
          </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">Medicine Name</th>
                  <th className="p-2 text-left">Medicine Company</th>
                  <th className="p-2 text-left">Medicine Composition</th>
                  <th className="p-2 text-left">Medicine Category</th>
                  <th className="p-2 text-left">Medicine Group</th>
                  <th className="p-2 text-left">Unit</th>
                  <th className="p-2 text-left">Available Qty</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((item) => {
                  const isOut = item.available_qty  === 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 text-sm">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2">{item.company_name}</td>
                      <td className="p-2">{item.composition}</td>
                      <td className="p-2">{item.category_name}</td>
                      <td className="p-2">{item.group_name}</td>
                      <td className="p-2">{item.unit_name}</td>
 
                      <td className="p-2 font-semibold">
                        {isOut ? (
                          <span className="text-red-600">
                            0 (Out of Stock)
                          </span>
                        ) : (
                          item.available_qty 
                        )}
                      </td> 

                      <td>
                      <div className="flex flex-wrap justify-center gap-2">
                          <button
                          title="View"
                          className="text-blue-600"
                          onClick={async () => {
                            const res = await getMedicineDetail(item.id);
                            const stockRes = await getMedicineStock(item.id);
                            setViewMedicine(res.data);
                            setStockList(stockRes.data);
                            setShowDetails(true);
                          }}

                        >
                          <Eye size={18} />
                        </button>
                        <button onClick={() => setEditMedicine(item)} className="text-purple-600">
                            <Pencil size={18} />
                          </button>

                          <button
                          title="Delete"
                          className="text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}

                {loading && (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      Loading medicines...
                    </td>
                  </tr>
                )}

                {!loading && medicines.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No medicines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
        </div>
      </div>

      {/* ADD MEDICINE MODAL */}
      <AddMedicineModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchMedicines}
      />
      <MedicineDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        medicine={viewMedicine}
        stockList={stockList}
      />
      <UpdateMedicine
        open={!!editMedicine}
        medicine={editMedicine}
        onClose={() => setEditMedicine(null)}
        onSuccess={fetchMedicines}
      />


    </AdminLayout>
  );
}
