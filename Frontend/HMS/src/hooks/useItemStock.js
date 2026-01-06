import { useState } from "react";

const mockData = [
  {
    id: 1,
    name: "Automatic Blood Pressure",
    category: "Automatic Blood Pressure Cuff",
    supplier: "Quick Service",
    store: "Vinay Pharmacy",
    date: "12/30/2025",
    description: "High Quality Medical Equipment",
    quantity: 15,
    generatedBy: "Super Admin (9001)",
    price: 180,
  },
  {
    id: 2,
    name: "Syringe",
    category: "Syringe Packs",
    supplier: "Quick Service",
    store: "SK Pharma",
    date: "11/30/2025",
    description: "Syringe Packs",
    quantity: 15,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 160.0,
  },
  {
    id: 3,
    name: "Personal Protective Equipment Kit",
    category: "Medical Equipment",
    supplier: "Quick Service",
    store: "Vinay Pharmacy",
    date: "11/10/2025",
    description:
      "High Quality Medical Equipment Pharmaceutical Testing Machines.",
    quantity: 15,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 200.0,
  },
  {
    id: 4,
    name: "Uniform (Patient-Staff)",
    category: "Uniforms",
    supplier: "Quick Service",
    store: "Vinay Pharmacy",
    date: "12/05/2025",
    description:
      "Staff Dress Code using OT",
    quantity: 20,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 180.0,
  },
  {
    id: 5,
    name: "Uniform (Patient-Staff)",
    category: "Uniforms",
    supplier: "VK Supplier",
    store: "Vardaan",
    date: "11/15/2025",
    description:
      "Wearing a uniform in the workplace helps to identify employees, avoiding mistakes and uncomfortable situations.",
    quantity: 20,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 150.0,
  },
  {
    id: 6,
    name: "Dressing Cotton",
    category: "Cotton Packs",
    supplier: "VK Supplier",
    store: "SK Pharma",
    date: "10/01/2025",
    description: "Dressing Cotton",
    quantity: 20,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 80.0,
  },
  {
    id: 7,
    name: "Operating Scissors",
    category: "Medical Scissors",
    supplier: "VK Supplier",
    store: "SK Pharma",
    date: "12/25/2025",
    description:
      "For prefilled syringes, plastic or glass syringes are the primary packaging devices.",
    quantity: 25,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 130.0,
  },
  {
    id: 8,
    name: "Dressing Cotton",
    category: "Cotton Packs",
    supplier: "Quick Service",
    store: "SK Pharma",
    date: "11/20/2025",
    description: "Dressing Cotton",
    quantity: 25,
    generatedBy: "Super Admin (9001)",
    purchasePrice: 150.0,
  },
];

export default function useItemStock() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(mockData);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    data: filteredData,
  };
}
