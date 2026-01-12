import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Plus } from "lucide-react";
import AddComplainModal from "../../components/Front_office/AddComplainModal";

export default function ComplainList() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-md p-3">
          <h2 className="text-lg font-semibold">Complain List</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Complain
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Complain",
                  "Complain Type",
                  "Source",
                  "Name",
                  "Phone",
                  "Date",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">360</td>
                <td className="px-3 py-2">Hospital services</td>
                <td className="px-3 py-2">Online Front Site</td>
                <td className="px-3 py-2">Jomel Warrican</td>
                <td className="px-3 py-2">899009090</td>
                <td className="px-3 py-2">01/31/2026</td>
                <td className="px-3 py-2">⋮</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">359</td>
                <td className="px-3 py-2">Long Wait Times</td>
                <td className="px-3 py-2">Online Advertising</td>
                <td className="px-3 py-2">Nishant Kadakia</td>
                <td className="px-3 py-2">0890867868</td>
                <td className="px-3 py-2">01/26/2026</td>
                <td className="px-3 py-2">⋮</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <AddComplainModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />

      </div>
    </AdminLayout>
  );
}
