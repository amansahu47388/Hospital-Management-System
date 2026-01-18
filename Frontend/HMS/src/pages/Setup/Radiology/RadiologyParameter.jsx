import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import RadiologySidebarMenu from "../../../components/Setup/Radiology/RadiologySidebarMenu";
import { Pencil, Plus, X } from "lucide-react";

export default function RadiologyParameter() {
  const [parameters, setParameters] = useState([
    {
      name: "MRI Cardiac with Contrast",
      range: "1.5",
      unit: "CT",
      desc: "MRI Cardiac with Contrast",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    range: "",
    unit: "",
    desc: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const saveParameter = () => {
    if (editIndex !== null) {
      const updated = [...parameters];
      updated[editIndex] = form;
      setParameters(updated);
    } else {
      setParameters([...parameters, form]);
    }
    setForm({ name: "", range: "", unit: "", desc: "" });
    setEditIndex(null);
    setShowModal(false);
  };

  // Modal Component
  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="font-semibold text-lg">{title}</h3>
          <X className="cursor-pointer" onClick={onClose} size={20} />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  // ModalFooter Component
  const ModalFooter = ({ onSave, onClose }) => (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded hover:opacity-90"
      >
        Save
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <RadiologySidebarMenu />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="flex justify-between p-4">
            <h2 className="font-semibold">Radiology Parameter List</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <Plus size={16} /> Add Radiology Parameter
            </button>
          </div>

          <table className="w-full text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3">Range</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, i) => (
                <tr key={i}>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.range}</td>
                  <td className="p-3">{p.unit}</td>
                  <td className="p-3">{p.desc}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setForm(p);
                        setEditIndex(i);
                        setShowModal(true);
                      }}
                      className="text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          title={editIndex !== null ? "Edit Radiology Parameter" : "Add Radiology Parameter"}
          onClose={() => setShowModal(false)}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input 
              className="w-full border px-3 py-2 rounded" 
              placeholder="Name" 
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Range *</label>
            <input 
              className="w-full border px-3 py-2 rounded" 
              placeholder="Range" 
              value={form.range}
              onChange={(e)=>setForm({...form,range:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <input 
              className="w-full border px-3 py-2 rounded" 
              placeholder="Unit" 
              value={form.unit}
              onChange={(e)=>setForm({...form,unit:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full border px-3 py-2 rounded" 
              placeholder="Description" 
              rows="3"
              value={form.desc}
              onChange={(e)=>setForm({...form,desc:e.target.value})}
            />
          </div>
          <ModalFooter onSave={saveParameter} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </AdminLayout>
  );
}