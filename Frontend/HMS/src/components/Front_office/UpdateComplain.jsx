import { NutIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getComplaintDetails, updateComplaint } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateComplain({ open, onClose, refresh, complainId }) {
  const notify = useNotify();

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

  /* Load existing data */
  useEffect(() => {
    if (open && complainId) {
      getComplaintDetails(complainId).then((res) => {
        setForm(res.data);
      });
    }
  }, [open, complainId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.complain_by || !form.complain_type || !form.source) {
        notify("warning","Please fill all required fields");
      return;
    }

    try {
      await updateComplaint(complainId, form);
      notify("success","Complaint updated successfully");
      refresh();
      onClose();
    } catch (err) {
      notify("error","Update failed");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-lg overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold text-base sm:text-lg">Update Complain</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Input label="Complain Type" name="complain_type" value={form.complain_type} onChange={handleChange} />
          <Input label="Source" name="source" value={form.source} onChange={handleChange} />
          <Input label="Complain By" name="complain_by" value={form.complain_by} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} />
          <Input label="Action Taken" name="action_taken" value={form.action_taken} onChange={handleChange} />
          <Input label="Assigned" name="assigned" value={form.assigned} onChange={handleChange} />

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" rows="3" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Note</label>
            <textarea name="note" value={form.note} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" rows="3" />
          </div>

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 border rounded px-3 py-2" />
  </div>
);
