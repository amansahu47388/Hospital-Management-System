import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";

export default function DoctorShift() {
  const [search, setSearch] = useState("");
  const [doctors] = useState([
    { id: 1, name: "Sonia Bush", empId: "9002", morning: true, evening: true },
    { id: 2, name: "Sansa Gomez", empId: "9008", morning: true, evening: false },
    { id: 3, name: "Amit Singh", empId: "9009", morning: false, evening: true },
    { id: 4, name: "Reyan Jain", empId: "9011", morning: true, evening: true },
  ]);

  const [shifts, setShifts] = useState(doctors);

  const handleShiftChange = (id, shift) => {
    setShifts(shifts.map(d =>
      d.id === id ? { ...d, [shift]: !d[shift] } : d
    ));
  };

  const filteredDoctors = shifts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.empId.includes(search)
  );

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Doctor Shift</h2>
        </div>

        <div className="flex gap-4">

          <SlotsSidebarMenu />


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            {/* SEARCH */}
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search by doctor name or ID..."
                className="w-full md:w-64 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Doctor Name</th>
                  <th className="px-3 py-2 text-center">Morning</th>
                  <th className="px-3 py-2 text-center">Evening</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50 border-b last:border-0">
                      <td className="px-3 py-2 text-left text-purple-600 font-medium">
                        {doc.name} ({doc.empId})
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={doc.morning}
                          onChange={() => handleShiftChange(doc.id, 'morning')}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={doc.evening}
                          onChange={() => handleShiftChange(doc.id, 'evening')}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-400">
                      No doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* FOOTER */}
            {filteredDoctors.length > 0 && (
              <div className="px-3 py-2 text-xs text-gray-500 border-t bg-gray-50">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
