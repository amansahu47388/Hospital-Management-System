import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddChargesModal from "../../../components/Setup/Charges/AddChargesModal.jsx";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";

export default function ChargesDetailsList() {
  const [openModal, setOpenModal] = useState(false);

  const charges = [
    {
      name: "Private Charge",
      category: "ERS/Patient Transport Service",
      type: "Ambulance",
      unit: "per hour",
      tax: "15%",
      amount: "125.00",
    },
    {
      name: "Stay Charge",
      category: "Admission and Discharge",
      type: "IPD",
      unit: "Hour",
      tax: "18%",
      amount: "1010.00",
    },
    {
      name: "ICU",
      category: "Intensive Care Units",
      type: "IPD",
      unit: "per day",
      tax: "18%",
      amount: "515.00",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Charges Details List</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Charges
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT SIDEBAR MENU */}
          <ChargesSidebar />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Charge Category</th>
                  <th className="px-3 py-2 text-left">Charge Type</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-left">Tax (%)</th>
                  <th className="px-3 py-2 text-left">Standard Charge ($)</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {charges.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-2 font-medium text-blue-600">
                      {item.name}
                    </td>
                    <td className="px-3 py-2">{item.category}</td>
                    <td className="px-3 py-2">{item.type}</td>
                    <td className="px-3 py-2">{item.unit}</td>
                    <td className="px-3 py-2">{item.tax}</td>
                    <td className="px-3 py-2">{item.amount}</td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Pencil size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* ADD CHARGES MODAL */}
        <AddChargesModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />

      </div>
    </AdminLayout>
  );
}
