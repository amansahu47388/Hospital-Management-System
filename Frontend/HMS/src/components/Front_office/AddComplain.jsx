import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {createComplaint,getComplaintTypes,getSources,} from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddComplain({ open, onClose, refresh }) {
  const notify = useNotify();

  const [types, setTypes] = useState([]);
  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    complain_type: "",
    source: "",
    complain_by: "",
    phone: "",
    date: "",
    description: "",
    action_taken: "",
    assigned: "",
    note: "",
  });

  /* Load dropdowns */
  useEffect(() => {
    if (open) {
      getComplaintTypes().then((r) => setTypes(r.data));
      getSources().then((r) => setSources(r.data));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.complain_type || !form.source || !form.complain_by || !form.date || !form.phone){
      notify("warning","Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      await createComplaint(form);
      notify("success","Complaint registered successfully");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      notify("error","Failed to register complaint");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;


    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-lg overflow-hidden max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Complain</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label>Complain Type *</label>
            <select name="complain_type" value={form.complain_type} onChange={handleChange}
              className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.complaint_type}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Source *</label>
            <select name="source" value={form.source} onChange={handleChange}
              className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              {sources.map(s => (
                <option key={s.id} value={s.id}>{s.source_name}</option>
              ))}
            </select>
          </div>

          <Input label="Complain By *" name="complain_by" value={form.complain_by} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input type="date" label="Date" name="date" value={form.date} onChange={handleChange} />

          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
          <Input label="Action Taken" name="action_taken" value={form.action_taken} onChange={handleChange} />
          <Input label="Assigned" name="assigned" value={form.assigned} onChange={handleChange} />
          <Textarea label="Note" name="note" value={form.note} onChange={handleChange} />

        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3  bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-gray-800">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="sm:col-span-2">
    <label>{label}</label>
    <textarea {...props} rows="3" className="w-full border rounded px-3 py-2" />
  </div>
);
