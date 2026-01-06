import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Trash2, Plus ,Pencil} from "lucide-react";
import EditItemModal from "../../components/Inventory/EditItemModal";
import AddItemModal from "../../components/Inventory/AddItemModal";

export default function ItemListPage() {
  /* ---------------- STATE ---------------- */

const [openEdit, setOpenEdit] = useState(false);
const [editItem, setEditItem] = useState(null);
const [openAdd, setOpenAdd] = useState(false);

  const [search, setSearch] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      name: "manual wheelchairs",
      category: "Patient wheelchairs",
      unit: 250,
      available: 0,
      description:
        "A user-powered wheelchair that can be pushed from behind by an assistant",
    },
    {
      id: 2,
      name: "Operating Scissors",
      category: "Medical scissors",
      unit: 200,
      available: 60,
      description:
        "Operating scissors are general medical scissors that allow for variety in size and design.",
    },
    {
      id: 3,
      name: "Head or beard covers and nets",
      category: "Apparel",
      unit: 100,
      available: 0,
      description: "",
    },
    {
      id: 4,
      name: "Medical shoe and boot covers",
      category: "Apparel",
      unit: 100,
      available: 71,
      description: "",
    },
    {
      id: 5,
      name: "Cardiac monitors, implantable or external",
      category: "Cardiology",
      unit: 100,
      available: 0,
      description: "",
    },
    {
      id: 6,
      name: "Electrocardiography machines",
      category: "Cardiology",
      unit: 100,
      available: 0,
      description: "",
    },
    {
      id: 7,
      name: "Monitor for glucose management",
      category: "Medical Equipment",
      unit: 100,
      available: 0,
      description: "Monitor for glucose management",
    },
    {
      id: 8,
      name: "Surgical blade",
      category: "Surgical blades",
      unit: 500,
      available: 98,
      description:
        "An operating table or surgical table is the table on which the patient lies during surgery.",
    },
    {
      id: 9,
      name: "Automatic Blood Pressure",
      category: "Automatic Blood Pressure Cuff",
      unit: 500,
      available: 40,
      description:
        "Displays simultaneous readings of systolic and diastolic blood pressure and pulse.",
    },
  ]);

  /* ---------------- FILTER ---------------- */
  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };
  

  const handleSaveEdit = (updatedItem) => {
  setItems((prev) =>
    prev.map((i) =>
      i.id === updatedItem.id ? updatedItem : i
    )
  );
};
    const handleEdit = (item) => {
    setEditItem(item);
    setOpenEdit(true);
  }


  const handleAddItem = (data) => {
  setItems((prev) => [
    ...prev,
    {
      id: Date.now(),
      name: data.name,
      category: data.category,
      unit: Number(data.unit),
      available: 0,
      description: data.description,
    },
  ]);
};

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="min-h-full p-1 ">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow p-4 mb-1 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Item List</h2>
          <button onClick={() => setOpenAdd(true)} className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* SEARCH */}
        {/* <div className="bg-white rounded-lg shadow p-3 mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 border px-3 py-2 rounded"
          />
        </div> */}

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Unit</th>
                <th className="p-3 text-center">Available Quantity</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((row) => (
                <tr
                  key={row.id}
                  className="group border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-blue-600 font-medium">
                    {row.name}
                  </td>
                  <td className="p-3">{row.category}</td>
                  <td className="p-3 text-center">{row.unit}</td>
                  <td className="p-3 text-center">{row.available}</td>
                  <td className="p-3 max-w-md">
                    {row.description || "—"}
                  </td>

                  {/* ACTION (HOVER ONLY) */}
                  <td className="p-3 text-center">
  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
    
    {/* EDIT */}
    <button
      onClick={() => handleEdit(row)}
      className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
      title="Edit"
    >
      <Pencil size={16} />
    </button>

    {/* DELETE */}
    <button
      onClick={() => handleDelete(row.id)}
      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>

  </div>
</td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

<EditItemModal
  open={openEdit}
  item={editItem}
  onClose={() => setOpenEdit(false)}
  onSave={handleSaveEdit}
/>


<AddItemModal
  open={openAdd}
  onClose={() => setOpenAdd(false)}
  onSave={handleAddItem}
/>
    </AdminLayout>
  );
}
