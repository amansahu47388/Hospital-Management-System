import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import RadiologySidebarMenu from "../../../components/Setup/Radiology/RadiologySidebarMenu";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function RadiologyUnit() {
  const [units, setUnits] = useState([
    "CT",
    "MRI",
    "Mammography",
    "HVL",
    "KHz",
    "(dGy×cm2)",
    "Teslas",
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if (!unitName) return;
    setUnits([...units, unitName]);
    setUnitName("");
    setShowAdd(false);
  };

  const handleEdit = () => {
    const updated = [...units];
    updated[editIndex] = unitName;
    setUnits(updated);
    setShowEdit(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-12 gap-4">
        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3">
          <RadiologySidebarMenu />
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Unit List</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1 rounded"
            >
              <Plus size={16} /> Add Unit
            </button>
          </div>

          <table className="w-full text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Unit Name</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={index}>
                  <td className="p-3">{unit}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setUnitName(unit);
                        setEditIndex(index);
                        setShowEdit(true);
                      }}
                      className="text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add Unit" onClose={() => setShowAdd(false)}>
          <input
            className="input"
            placeholder="Unit Name"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
          <ModalFooter onSave={handleAdd} />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal title="Edit Unit" onClose={() => setShowEdit(false)}>
          <input
            className="input"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
          <ModalFooter onSave={handleEdit} />
        </Modal>
      )}
    </AdminLayout>
  );
}

/* INLINE MODAL (NOT SEPARATE COMPONENT FILE) */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded shadow-lg">
        <div className="flex justify-between items-center p-4 text-white">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="bg-white p-4 space-y-4 rounded-b">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalFooter({ onSave }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onSave}
        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1 rounded"
      >
        Save
      </button>
    </div>
  );
}
