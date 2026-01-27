import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";
import AddCharges from "../../../components/Setup/Charges/AddCharges";
import UpdateCharges from "../../../components/Setup/Charges/Updatecharges";
import {
  getHospitalCharges,
  deleteHospitalCharge,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function ChargesDetailsList() {
  const notify = useNotify();
  const fetched = useRef(false);

  const [rows, setRows] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCharges = async () => {
    try {
      const res = await getHospitalCharges();
      setRows(res.data);
    } catch {
      notify("error", "Failed to load charges");
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchCharges();
  }, []);

  const handleDelete = async (row) => {
    if (!confirm(`Delete ${row.charge_name}?`)) return;
    try {
      await deleteHospitalCharge(row.id);
      notify("success", "Charge deleted");
      fetchCharges();
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2 shadow">
        <div className="bg-white p-3 flex justify-between shadow">
          <h2 className="font-semibold">Charges Details List</h2>
          <button onClick={() => setOpenAdd(true)}
             className="flex items-center gap-2 text-white px-4 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
            <Plus size={16}/> Add Charges
          </button>
        </div>

        <div className="flex gap-4 mt-4 shadow">
          <ChargesSidebar />

          <div className="flex-1 bg-white rounded shadow overflow-x-auto thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-left">Tax</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 group">
                    <td className="px-3 py-2 text-left">{row.charge_name}</td>
                    <td className="px-3 py-2 text-left">{row.charge_category}</td>
                    <td className="px-3 py-2 text-left">{row.charge_type}</td>
                    <td className="px-3 py-2 text-left">{row.unit}</td>
                    <td className="px-3 py-2 text-left">{row.tax}%</td>
                    <td className="px-3 py-2 text-left">{row.charge_amount}</td>
                    <td className="px-3 py-2 text-left">
                      <div className="flex gap-3">
                        <button
                        onClick={() => {
                          setSelected(row);
                          setOpenEdit(true);
                        }}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Pencil size={16} />
                      </button>

                        <button
                          title="Delete"
                          onClick={() => handleDelete(row)}
                          className="text-red-600 hover:text-red-800"
                        >
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

        <AddCharges open={openAdd} onClose={() => setOpenAdd(false)} refresh={fetchCharges}/>
       <UpdateCharges
          open={openEdit}
          data={selected}
          onClose={() => setOpenEdit(false)}
          refresh={fetchCharges}
        />
      </div>
    </AdminLayout>
  );
}
