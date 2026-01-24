import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";

export default function IPDBedHistory() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        <IPDTabsNavbar />

        <div className="p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="mb-4 font-semibold">Bed History</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="p-2 text-left">Bed Group</th>
                  <th className="p-2 text-left">Bed</th>
                  <th className="p-2 text-left">From</th>
                  <th className="p-2 text-left">Active</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-left">VIP Ward</td>
                  <td className="p-2 text-left">GF-109</td>
                  <td className="p-2 text-left">01/19/2026</td>
                  <td className="p-2 text-left">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
