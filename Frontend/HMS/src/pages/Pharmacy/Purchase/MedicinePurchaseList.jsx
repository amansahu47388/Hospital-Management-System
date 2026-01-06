import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import useMedicinePurchase from "../../../hooks/useMedicinePurchase";

import PurchaseHeader from "../../../components/Pharmacy/Purchase/PurchaseHeader";
import PurchaseTable from "../../../components/Pharmacy/Purchase/PurchaseTable";
import PurchaseMedicineModal from "../../../components/Pharmacy/Purchase/PurchaseMedicine";

export default function MedicinePurchaseList() {
  const { search, setSearch, purchases } = useMedicinePurchase();
  const [openPurchase, setOpenPurchase] = useState(false);
  
  return (
    <AdminLayout>
      <div className="min-h-screen  p-1">
        <div className="bg-white rounded-lg p-4 shadow">

          <PurchaseHeader onAdd={() => setOpenPurchase(true)} />

          <div className="my-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border rounded px-3 py-2 w-full md:w-72"
            />
          </div>

          <PurchaseTable purchases={purchases} />
        </div>
        
        <PurchaseMedicineModal 
          open={openPurchase} 
          onClose={() => setOpenPurchase(false)} 
        />
      </div>
    </AdminLayout>
  );
}