import { NavLink } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";

export default function BedStatus() {
  const beds = [
    { name: "GF - 101", type: "Standard", group: "VIP Ward", floor: "Ground Floor", status: "Allotted" },
    { name: "GF - 108", type: "Standard", group: "VIP Ward", floor: "Ground Floor", status: "Available" },
    { name: "GF - 109", type: "VIP", group: "VIP Ward", floor: "Ground Floor", status: "Available" },
    { name: "GF - 118", type: "VIP", group: "VIP Ward", floor: "Ground Floor", status: "Available" },
    { name: "GF - 119", type: "VIP", group: "VIP Ward", floor: "Ground Floor", status: "Allotted" },
    { name: "TF - 102", type: "VIP", group: "Private Ward", floor: "3rd Floor", status: "Allotted" },
    { name: "TF - 103", type: "Normal", group: "Private Ward", floor: "3rd Floor", status: "Allotted" },
    { name: "TF - 107", type: "VIP", group: "Private Ward", floor: "3rd Floor", status: "Available" },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">

        {/* PAGE HEADER */}
        <div className="bg-white rounded-md p-3 mb-4">
          <h2 className="text-lg font-semibold">Bed Status</h2>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT SIDE BLOCK */}
          <div className="w-full md:w-64 bg-white rounded-md p-3">
            <ul className="space-y-1 text-sm">
              {[
                { label: "Bed Status", path: "/admin/setup/bed-status" },
                { label: "Bed", path: "/admin/setup/bed" },
                { label: "Bed Type", path: "/admin/setup/bed-type" },
                { label: "Bed Group", path: "/admin/setup/bed-group" },
                { label: "Floor", path: "/admin/setup/floor" },
              ].map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded
                      ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-100"}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Bed Type</th>
                  <th className="px-3 py-2 text-left">Bed Group</th>
                  <th className="px-3 py-2 text-left">Floor</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {beds.map((bed, index) => (
                  <tr
                    key={index}
                    className={`border-b
                      ${bed.status === "Available" ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {/* BED NAME AS LINK */}
                    <td className="px-3 py-2">
                      <NavLink
                        to={`/admin/setup/bed/${bed.name}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {bed.name}
                      </NavLink>
                    </td>

                    <td className="px-3 py-2">{bed.type}</td>
                    <td className="px-3 py-2">{bed.group}</td>
                    <td className="px-3 py-2">{bed.floor}</td>

                    <td className="px-3 py-2 font-semibold">
                      {bed.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
