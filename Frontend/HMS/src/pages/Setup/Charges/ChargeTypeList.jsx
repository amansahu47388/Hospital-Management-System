import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddChargeTypeModal from "../../../components/Setup/Charges/AddChargeTypeModal";
import EditChargeTypeModal from "../../../components/Setup/Charges/EditChargeTypeModal";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";

export default function ChargeTypeList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const chargeTypes = [
    { name: "Appointment", appointment: true },
    { name: "OPD", opd: true },
    { name: "IPD", ipd: true },
    { name: "Pathology", pathology: true },
    { name: "Radiology", radiology: true },
    { name: "Blood Bank", bloodbank: true },
    { name: "Ambulance", ambulance: true },
    { name: "Others", all: true },
  ];

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-3">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Charge Type List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
          >
            <Plus size={16} /> Add Charge Type
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
                <th className="px-3 py-2 text-left">Charge Type</th>
                <th className="px-3 py-2 text-center">Appointment</th>
                <th className="px-3 py-2 text-center">OPD</th>
                <th className="px-3 py-2 text-center">IPD</th>
                <th className="px-3 py-2 text-center">Pathology</th>
                <th className="px-3 py-2 text-center">Radiology</th>
                <th className="px-3 py-2 text-center">Blood Bank</th>
                <th className="px-3 py-2 text-center">Ambulance</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {chargeTypes.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 group">
                  <td className="px-3 py-2 font-medium text-blue-600">
                    {row.name}
                  </td>

                  {["appointment","opd","ipd","pathology","radiology","bloodbank","ambulance"].map((key) => (
                    <td key={key} className="px-3 py-2 text-center">
                      <input type="checkbox" checked={!!row[key]} readOnly />
                    </td>
                  ))}

                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleEdit(row)}
                      className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </div>
        <AddChargeTypeModal open={openAdd} onClose={() => setOpenAdd(false)} />

        <EditChargeTypeModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          data={selectedRow}
        />

      </div>
    </AdminLayout>
  );
}
