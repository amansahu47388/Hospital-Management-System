import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";

export default function IPDBedHistoryPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        <IPDTabsNavbar />

        <div className="p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="mb-4 font-semibold">Bed History</h2>

            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2">Bed Group</th>
                  <th className="p-2">Bed</th>
                  <th className="p-2">From</th>
                  <th className="p-2">Active</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">VIP Ward</td>
                  <td className="p-2">GF-109</td>
                  <td className="p-2">01/19/2026</td>
                  <td className="p-2">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
