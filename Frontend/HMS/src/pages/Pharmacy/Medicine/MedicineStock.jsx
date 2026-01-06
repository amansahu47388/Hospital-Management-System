import React, { useEffect, useState } from "react";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import AddMedicineModal from "../../../components/Pharmacy/Medicine/AddMedicine";
import { getMedicines, deleteMedicine } from "../../../api/pharmacyApi";
import { useNotify } from "../../../context/NotificationContext";

const buttonClass =
  "flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] " +
  "text-white px-3 py-2 rounded text-sm hover:opacity-90 transition";

export default function MedicineStock() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH MEDICINES ---------------- */
  useEffect(() => {
    fetchMedicines();
  }, [search]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await getMedicines();
      setMedicines(res.data);
    } catch {
      notify.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SELECT HANDLING ---------------- */
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ---------------- DELETE SELECTED ---------------- */
  const handleDelete = async () => {
    if (selected.length === 0) return;

    if (!window.confirm("Delete selected medicines?")) return;

    try {
      setLoading(true);
      await Promise.all(selected.map((id) => deleteMedicine(id)));
      notify.success("Medicine(s) deleted successfully");
      setSelected([]);
      fetchMedicines();
    } catch {
      notify.error("Failed to delete medicines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-lg p-4 shadow">

          {/* HEADER + ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Medicines Stock</h2>

            <div className="flex flex-wrap gap-2 justify-end">
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

              <button
                onClick={handleDelete}
                disabled={selected.length === 0}
                className={`${buttonClass} ${
                  selected.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } bg-gradient-to-b from-[#E74C3C] to-[#C0392B]`}
              >
                <Trash2 size={16} /> Delete Selected
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border rounded px-3 py-2 mb-4 w-full md:w-72"
          />

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">
                    <input type="checkbox" />
                  </th>
                  <th className="p-2 text-left">Medicine Name</th>
                  <th className="p-2 text-left">Medicine Company</th>
                  <th className="p-2 text-left">Medicine Composition</th>
                  <th className="p-2 text-left">Medicine Category</th>
                  <th className="p-2 text-left">Medicine Group</th>
                  <th className="p-2 text-left">Unit</th>
                  <th className="p-2 text-left">Available Qty</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((item) => {
                  const isOut = item.qty === 0;

                  return (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 text-sm"
                    >
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>

                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2">{item.company_name}</td>
                      <td className="p-2">{item.composition}</td>
                      <td className="p-2">{item.category_name}</td>
                      <td className="p-2">{item.group_name}</td>
                      <td className="p-2">{item.unit_name}</td>

                      {/* <td className="p-2 font-semibold">
                        {isOut ? (
                          <span className="text-red-600">
                            0 (Out of Stock)
                          </span>
                        ) : (
                          item.qty
                        )}
                      </td> */}
                    </tr>
                  );
                })}

                {!loading && medicines.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
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
    </AdminLayout>
  );
}
