import React from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import AddPatient from "../../components/PatientComponent/AddPatient";
import { useState } from "react";
import { MoreVertical, Menu } from "lucide-react";

const samplePatients = [
  { id: 1, name: "Olivier Thomas", age: "41 Year, 7 Month, 5 Day", gender: "Male", phone: "7896541230", guardian: "Edward Thomas", address: "482 Kingsway, Brooklyn West, CA", dead: "No" },
  { id: 2, name: "John Marshall", age: "30 Year, 10 Month, 4 Day", gender: "Male", phone: "9856475632", guardian: "Smith Marshall", address: "Blackstone Park, Brooklyn North, CA", dead: "No" },
  { id: 3, name: "Maria Taylor", age: "14 Year, 10 Month, 5 Day", gender: "Female", phone: "7488548942", guardian: "Jonson", address: "CA,USA", dead: "No" },
];

function PatientDashboard() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">

        {/* Navbar */}
        <div className="sticky top-0 z-20 w-full">
          <Navbar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">

            {/* Header row */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-lg font-semibold text-gray-800">Patient List</h1>

              <div className="flex flex-wrap items-center gap-3">
               <button
               onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm px-3 py-1 rounded"
        >
        + Add New Patient
      </button>

                <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm px-3 py-1 rounded">
                  Import Patient
                </button>
                <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm px-3 py-1 rounded">
                  Disabled Patient List
                </button>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded px-3 py-2 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-200"
                />

                <div className="flex items-center gap-3">
                  <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm px-3 py-1 rounded">
                    Delete Selected
                  </button>

                  <select className="border rounded px-2 py-1 text-sm">
                    <option>100</option>
                    <option>50</option>
                    <option>25</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto mt-4">
  <table className="w-full text-sm border-separate border-spacing-0">
    <thead className="bg-gray-50 border-y">
      <tr>
        <th className="px-4 py-2 text-left"><input type="checkbox" /></th>
        <th className="px-4 py-2 text-left"># Patient Name</th>
        <th className="px-4 py-2 text-left">Age</th>
        <th className="px-4 py-2 text-left">Gender</th>
        <th className="px-4 py-2 text-left">Phone</th>
        <th className="px-4 py-2 text-left">Guardian Name</th>
        <th className="px-4 py-2 text-left">Address</th>
        <th className="px-4 py-2 text-left">Dead</th>
        <th className="px-4 py-2 text-left">Action</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {samplePatients.map((p) => (
        <tr key={p.id} className="hover:bg-gray-50">
          <td className="px-4 py-3"><input type="checkbox" /></td>
          <td className="px-4 py-3 text-blue-600">
            {p.name}
            <span className="text-xs text-gray-400"> ({p.id})</span>
          </td>
          <td className="px-4 py-3">{p.age}</td>
          <td className="px-4 py-3">{p.gender}</td>
          <td className="px-4 py-3">{p.phone}</td>
          <td className="px-4 py-3">{p.guardian}</td>
          <td className="px-4 py-3">{p.address}</td>
          <td className="px-4 py-3">{p.dead}</td>
          <td className="px-4 py-3">
          <td className="px-4 py-3">
  <div className="flex gap-3">
  <button className="p-2 border rounded hover:bg-gray-100">
    <MoreVertical size={20} />
  </button>

  <button className="p-2 border rounded hover:bg-gray-100">
    <Menu size={20} />
  </button>
</div>

</td>


          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <AddPatient open={openAdd} onClose={() => setOpenAdd(false)} />

</div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard;
