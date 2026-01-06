import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Trash2 } from "lucide-react";
import ConfirmReturnModal from "../../components/Inventory/ConfirmReturnModal";
import AddIssueItemModal from "../../components/Inventory/AddIssueItemModal";
export default function IssueItemPage() {
  /* ---------------- STATE ---------------- */
  const [items, setItems] = useState([
    {
      id: 1,
      item: "Pharmacist Equipment",
      category: "Medical Equipment",
      period: "12/12/2025 - 12/16/2025",
      issueTo: "Pharmacist Harry Grant (9012)",
      issuedBy: "Super Admin",
      quantity: 5,
      status: "Pending",
    },
    {
      id: 2,
      item: "Medical shoe and boot covers",
      category: "Apparel",
      period: "12/01/2025 - 12/03/2025",
      issueTo: "Doctor Amit Singh (9009)",
      issuedBy: "Super Admin",
      quantity: 0,
      status: "Returned",
    },
    {
      id: 3,
      item: "Dressing Cotton",
      category: "Cotton Packs",
      period: "12/05/2025 - 12/10/2025",
      issueTo: "Nurse April Clinton (9020)",
      issuedBy: "Super Admin",
      quantity: 10,
      status: "Pending",
    },
  ]);
 
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  /* ---------------- STATUS HANDLER (UNCHANGED) ---------------- */
  const handleReturn = (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: "Returned" }
          : i
      )
    );
  };

  /* ---------------- DELETE HANDLERS (SEPARATE) ---------------- */
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    setItems((prev) =>
      prev.filter((i) => i.id !== selectedItem.id)
    );
    setOpenConfirm(false);
    setSelectedItem(null);
  };
  


  const [openAdd, setOpenAdd] = useState(false);

const handleAddIssueItem = (data) => {
  console.log("ADD ISSUE ITEM:", data);
};

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="min-h-full p-1 ">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Issue Item List</h2>
          <button onClick={() => setOpenAdd(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
            + Add Issue Item
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Issue - Return</th>
                <th className="p-3">Issue To</th>
                <th className="p-3">Issued By</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className="group border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-blue-600 font-medium">
                    {row.item}
                  </td>
                  <td className="p-3">{row.category}</td>
                  <td className="p-3">{row.period}</td>
                  <td className="p-3">{row.issueTo}</td>
                  <td className="p-3">{row.issuedBy}</td>
                  <td className="p-3 text-center">{row.quantity}</td>

                  {/* ✅ STATUS COLUMN — WORKS AS BEFORE */}
                  <td className="p-3 text-center">
                    {row.status === "Returned" ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                        Returned
                      </span>
                    ) : (
                      <button
                        onClick={() => handleReturn(row)}
                        className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs"
                      >
                        Click To Return
                      </button>
                    )}
                  </td>

                  {/* ✅ ACTION COLUMN — DELETE ONLY, HOVER ONLY */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteClick(row)}
                      className="opacity-0 group-hover:opacity-100 transition
                        p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CONFIRM DELETE POPUP */}
        <ConfirmReturnModal
          open={openConfirm}
          item={selectedItem}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirmDelete}
        />

        <AddIssueItemModal
        open={openAdd}
       onClose={() => setOpenAdd(false)}
       onSave={handleAddIssueItem}
/>

      </div>
    </AdminLayout>
  );
}
