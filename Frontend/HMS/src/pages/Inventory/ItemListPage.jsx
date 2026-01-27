import { useEffect, useState, useRef, useMemo } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Trash2, Plus, Pencil } from "lucide-react";
import UpdateItem from "../../components/Inventory/UpdateItem";
import AddItem from "../../components/Inventory/AddItem";
import { getItems, deleteItem } from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function ItemListPage() {
  const [items, setItems] = useState([]);
  const notify = useNotify();
  const searchRef = useRef("");
  const [, forceRender] = useState(0);
  const [search, setSearch] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  /* LOAD ITEMS */
  const fetchItems = async () => {
    const res = await getItems();
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const filteredItems = useMemo(() => {
  const keyword = searchRef.current.toLowerCase();

  if (!keyword) return items;

  return items.filter((item) =>
    item.item_name.toLowerCase().includes(keyword) ||
    item.category_name?.toLowerCase().includes(keyword) ||
    String(item.unit).includes(keyword)
  );
}, [items, searchRef.current]);



const handleDelete = async (id) => {
  if (!window.confirm("Delete this item?")) return;

  try {
    await deleteItem(id);
    notify("success", "Item deleted successfully");
    fetchItems();
  } catch (err) {
    notify("error", "Failed to delete item");
  }
};

  return (
    <AdminLayout>
      <div className="min-h-full">
        <div className="bg-white mt-2 shadow rounded overflow-x-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 p-4">
            <div>
            <h1 className="text-xl font-semibold pb-4">Item List</h1>
           <input
                placeholder="Search..."
                onChange={(e) => {
                  searchRef.current = e.target.value;
                  forceRender(n => n + 1);   // tell React to re-evaluate useMemo
                }}
                className="border px-3 py-2 rounded text-sm w-full sm:w-64"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setOpenAdd(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded flex gap-2">
              <Plus size={16} /> Add Item
            </button>
            </div>
          </div>

          <table className="min-w-full text-sm shadow thin-scrollbar">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Available Quantity</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className=" hover:bg-gray-100">
                  <td className="p-3 text-blue-600 text-left" text-left>{item.item_name}</td>
                  <td className="p-3 text-left">{item.category_name}</td>
                  <td className="p-3 text-left">{item.unit}</td>
                 <td className="p-3 text-left">{item.available_quantity}</td>
                  <td className="p-3 text-left">{item.description}</td>
                  <td className="p-3 text-left flex gap-2">
                    <button onClick={() => {setEditItem(item);setOpenEdit(true)}} className="bg-green-100 p-2 rounded text-green-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-100 p-2 rounded text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddItem open={openAdd} onClose={() => setOpenAdd(false)} refresh={fetchItems} />
        <UpdateItem open={openEdit} onClose={() => setOpenEdit(false)} item={editItem} refresh={fetchItems} />

      </div>
    </AdminLayout>
  );
}
