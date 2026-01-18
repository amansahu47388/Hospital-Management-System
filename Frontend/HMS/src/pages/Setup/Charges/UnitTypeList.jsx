import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import AddUnitType from "../../../components/Setup/Charges/AddUnitType";
import UpdateUnitType from "../../../components/Setup/Charges/UpdateUnitType";
import {getChargeUnits,deleteChargeUnit,} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";
import ChargesSidebar from "../../../components/Setup/Charges/ChargesSidebar";


export default function UnitTypeList() {
  const notify = useNotify();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const fetched = useRef(false);

  // 🔹 Fetch units (StrictMode safe)
  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await getChargeUnits();
      setUnits(res.data);
    } catch {
      notify("error", "Failed to load unit types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchUnits();
  }, []);

  // 🔹 Delete
  const handleDelete = async (unit) => {
    if (!confirm(`Delete "${unit.unit_type}" ?`)) return;

    try {
      await deleteChargeUnit(unit.id);
      notify("success", "Unit type deleted successfully");
      fetchUnits();
    } catch {
      notify("error", "Failed to delete unit type");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Unit Type List</h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Unit Type
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 shadow">

          <ChargesSidebar/>
          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left">Unit Type</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center">Loading...</td>
                  </tr>
                )}

                {!loading && units.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500">
                      No unit types found
                    </td>
                  </tr>
                )}

                {units.map((unit) => (
                  <tr key={unit.id} className=" hover:bg-gray-100 group">
                    <td className="px-3 py-2 font-medium">
                      {unit.unit_type}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-3 ">
                        <button
                        title="Edit"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setOpenEdit(true);
                          }}
                          className="text-purple-500 hover:text-purple-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Delete"
                          onClick={() => handleDelete(unit)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-3 py-2 text-xs text-gray-500">
              Records: {units.length}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <AddUnitType
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={fetchUnits}
        />

        <UpdateUnitType
          open={openEdit}
          unit={selectedUnit}
          onClose={() => {
            setSelectedUnit(null);
            setOpenEdit(false);
          }}
          refresh={fetchUnits}
        />
      </div>
    </AdminLayout>
  );
}
