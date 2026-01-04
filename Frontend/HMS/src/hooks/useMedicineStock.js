import { useState } from "react";

export default function useMedicineStock() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Amlodipine",
      company: "Johnson & Johnson",
      composition: "Amlodipine",
      category: "Tablet",
      group: "Antimycobacterials",
      unit: "mg/mL",
      qty: 930,
    },
    {
      id: 2,
      name: "VARICELLA",
      company: "Biocon Limited",
      composition: "Injection",
      category: "Injection",
      group: "Antiparasitics",
      unit: "ml",
      qty: 492,
    },
    {
      id: 3,
      name: "Zukolite Wen",
      company: "Alkem Laboratories",
      composition: "Multivitamin",
      category: "Cream",
      group: "Antibacterials",
      unit: "mg",
      qty: 0,
    },
  ]);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Select checkbox
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // ✅ ACTIONS
  // const handleAdd = () => {
  //   alert("Open Add Medicine Modal");
  // };

  const handleImport = () => {
    alert("Import Medicines (CSV / Excel)");
  };

  const handlePurchase = () => {
    alert("Redirect to Purchase Page");
  };

  const handleDelete = () => {
    if (!selected.length) return;

    if (!window.confirm("Are you sure you want to delete selected medicines?"))
      return;

    setMedicines(prev =>
      prev.filter(item => !selected.includes(item.id))
    );

    setSelected([]);
  };

  return {
    search,
    setSearch,
    medicines: filtered,
    selected,
    toggleSelect,

    // actions
    //handleAdd,
    handleImport,
    handlePurchase,
    handleDelete,
    //addOpen,
  };
}
