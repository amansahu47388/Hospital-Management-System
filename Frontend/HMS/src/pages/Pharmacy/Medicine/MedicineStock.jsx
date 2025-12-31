import React ,{useState} from "react";
import AdminLayout from "../../../layout/AdminLayout";
import useMedicineStock from "../../../hooks/useMedicineStock";
import MedicineTable from "../../../components/Pharmacy/Medicine/MedicineTable";
import MedicineActions from "../../../components/Pharmacy/Medicine/MedicineActions";
import AddMedicineModal from "../../../components/Pharmacy/Medicine/AddMedicineModal";
import MedicineHeader from "../../../components/Pharmacy/Medicine/MedicineHeader";

export default function MedicineStock() {
  const [open, setOpen] = useState(false);
  
  const {
    search,
    setSearch,
    medicines,
    selected,
    toggleSelect,
    handleImport,
    handlePurchase,
    handleDelete
  } = useMedicineStock();

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // TODO: Add your save logic here
    alert("Medicine Saved Successfully");
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen  p-1">
        <div className="bg-white rounded-lg p-4 shadow">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Medicines Stock</h2>

            <MedicineActions
              selected={selected}
              onAdd={handleAdd}
              onImport={handleImport}
              onPurchase={handlePurchase}
              onDelete={handleDelete}
            />
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border rounded px-3 py-2 mb-4 w-full md:w-72"
          />

          <MedicineTable
            medicines={medicines}
            selected={selected}
            toggleSelect={toggleSelect}
          />
        </div>
      </div>
      
      <AddMedicineModal
        open={open}
        onClose={handleClose}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}