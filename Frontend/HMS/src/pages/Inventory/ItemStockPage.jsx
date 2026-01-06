import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import ItemStockHeader from "../../components/Inventory/ItemStockHeader";
import ItemStockTable from "../../components/Inventory/ItemStockTable";
import useItemStock from "../../hooks/useItemStock";
import AddItemStockModal from "../../components/Inventory/AddItemStockModal";
export default function ItemStockPage() {
  const { search, setSearch, data } = useItemStock();
    const [openAdd, setOpenAdd] = useState(false);
  return (
    <AdminLayout>
      <div className="min-h-full  p-1">
        <ItemStockHeader search={search} setSearch={setSearch} openAdd={openAdd} setOpenAdd={setOpenAdd} />
        <ItemStockTable data={data} />
      </div>

      <AddItemStockModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
         
        />
    </AdminLayout>
  );
}
