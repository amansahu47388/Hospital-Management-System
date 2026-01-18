import AdminLayout from "../../../layout/AdminLayout";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";

export default function DoctorShift() {
  const doctors = [
    "Sonia Bush (9002)",
    "Sansa Gomez (9008)",
    "Amit Singh (9009)",
    "Reyan Jain (9011)",
  ];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* SIDEBAR */}
          <SlotsSidebarMenu />

          {/* CONTENT */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded shadow border">

              {/* HEADER */}
              <div className="px-4 py-3 border-b">
                <h1 className="text-lg font-semibold">Doctor Shift</h1>
              </div>

              {/* BODY */}
              <div className="p-4 overflow-x-auto">
                <input
                  placeholder="Search..."
                  className="mb-3 border-b outline-none text-sm"
                />

                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Doctor Name</th>
                      <th className="px-3 py-2 text-center">Morning</th>
                      <th className="px-3 py-2 text-center">Evening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 text-blue-600">
                          {doc}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="checkbox" defaultChecked />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="checkbox" defaultChecked />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-xs text-gray-500 mt-2">
                  Records: 1 to {doctors.length} of {doctors.length}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
