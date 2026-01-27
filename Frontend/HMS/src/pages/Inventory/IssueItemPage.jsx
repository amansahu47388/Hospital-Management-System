import { useEffect, useState, useRef, useMemo } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Trash2 } from "lucide-react";
import ConfirmReturnModal from "../../components/Inventory/ConfirmReturn";
import AddIssueItemModal from "../../components/Inventory/AddIssueItem";
import { getIssueItems, returnIssueItem,deleteIssueItem } from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function IssueItemPage() {
  const notify = useNotify();

  /* ---------------- STATE ---------------- */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef("");
  const [, forceRender] = useState(0);


  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  /* ---------------- LOAD ISSUED ITEMS ---------------- */
  const loadIssueItems = async () => {
    try {
      setLoading(true);
      const res = await getIssueItems();
      const data = res.data || [];

      const mapped = data.map((issue) => {
        const firstDetail = (issue.items && issue.items[0]) || {};
        const period = issue.return_date
          ? `${issue.issue_date} - ${issue.return_date}`
          : issue.issue_date;

        return {
          id: issue.id,
          item: firstDetail.item_name || "-",
          category: firstDetail.category_name || "-",
          period,
          issueTo: issue.issued_to_name,
          issuedBy: issue.issued_by_name,
          quantity: firstDetail.quantity || 0,
          status: issue.status ? "Returned" : "Pending",
        };
      });

      setItems(mapped);
    } catch (err) {
      notify("error", "Failed to load issue items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssueItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- RETURN HANDLERS ---------------- */
  const handleReturnClick = (item) => {
    setSelectedItem(item);
    setOpenConfirm(true);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this issue record?")) return;

  try {
    await deleteIssueItem(id);
    notify("success", "Issue record deleted");
    loadIssueItems();
  } catch (err) {
    notify("error", "Delete failed");
  }
};


  const handleConfirmReturn = async () => {
    if (!selectedItem) return;
    try {
      await returnIssueItem(selectedItem.id);
      notify("success", "Items returned successfully");
      await loadIssueItems();
    } catch (err) {
      notify("error", "Failed to return items");
    } finally {
      setOpenConfirm(false);
      setSelectedItem(null);
    }
  };

  /* ---------------- ADD ISSUE HANDLER ---------------- */
  const handleAddIssueItem = () => {
    setOpenAdd(false);
    loadIssueItems();
  };

const filteredItems = useMemo(() => {
  const term = searchRef.current.toLowerCase();

  if (!term) return items;

  return items.filter((i) =>
    [
      i.item,
      i.category,
      i.issueTo,
      i.issuedBy,
      i.status,
    ].some((field) =>
      String(field).toLowerCase().includes(term)
    )
  );
}, [items, forceRender]);


  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="min-h-full p-1 ">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold pb-4">Issue Item List</h2>
             <input
              placeholder="Search..."
              onChange={(e) => {
                searchRef.current = e.target.value;
                forceRender(n => n + 1);
              }}
              className="border px-3 py-2 rounded text-sm w-full sm:w-64"
            />

          </div>
            
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded"
          >
            + Add Issue Item
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto thin-scrollbar">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Issue - Return</th>
                <th className="p-3 text-left">Issue To</th>
                <th className="p-3 text-left">Issued By</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-500"
                  >
                    No items issued yet.
                  </td>
                </tr>
              ) : (
                filteredItems.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-blue-600 font-medium text-left">
                      {row.item}
                    </td>
                    <td className="p-3 text-left">{row.category}</td>
                    <td className="p-3 text-left">{row.period}</td>
                    <td className="p-3 text-left">{row.issueTo}</td>
                    <td className="p-3 text-left">{row.issuedBy}</td>
                    <td className="p-3 text-left">{row.quantity}</td>

                    {/* STATUS COLUMN */}
                    <td className="p-3 text-left">
                      {row.status === "Returned" ? (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                          Returned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReturnClick(row)}
                          className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs"
                        >
                          Click To Return
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-left">
                    <button onClick={() => handleDelete(row.id)} className="bg-red-100 p-2 rounded text-red-600">
                      <Trash2 size={16} />
                    </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CONFIRM RETURN POPUP */}
        <ConfirmReturnModal
          open={openConfirm}
          item={selectedItem}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirmReturn}
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
