import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPurposes, createVisitor } from "../../api/frontofficeApi";
import { getOpdPatientList } from "../../api/opdApi";
import { getStaffList } from "../../api/authApi";
import { getIpdPatientList } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";



export default function AddVisitor({ open, onClose, refresh }) {
  const notify = useNotify(); 
  const [purposes, setPurposes] = useState([]);
  const [visitToList, setVisitToList] = useState([]);


  const [form, setForm] = useState({
    name: "",
    purpose: "",
    phone: "",
    id_card: "",
    visit_to: "",
    opd_ipd_staff: "",
    number_of_person: 1,
    date: "",
    in_time: "",
    out_time: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      getPurposes().then((r) => setPurposes(r.data));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleTypeChange = async (e) => {
  const value = e.target.value;
  setForm((p) => ({ ...p, opd_ipd_staff: value, visit_to: "" }));

  let data = [];

  if (value === "STAFF") {
  const r = await getStaffList();
  data = r.data.map(u => ({
    id: u.id,
    label: u.full_name
  }));
}


 if (value === "OPD") {
  const r = await getOpdPatientList("all");
  data = r.data.map(p => ({
    id: p.opd_id,
    label: `${p.patient_detail.first_name} ${p.patient_detail.last_name}`
  }));
}

if (value === "IPD") {
  const r = await getIpdPatientList();
  data = r.data.map(p => ({
    id: p.ipd_id,
    label: `${p.patient_detail.first_name} ${p.patient_detail.last_name}`
  }));
}
  setVisitToList(data);
};

  const handleSubmit = async () => {
  try {
    if (!form.name || !form.purpose || !form.opd_ipd_staff || !form.visit_to || !form.date) {
      notify("warning","Please fill all required fields");
      return;
    }

    await createVisitor(form);

    notify("success","Visitor added successfully");

    refresh();
    onClose();
  } catch (err) {
    console.error(err);
    notfy("error","Failed to add visitor");
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="text-lg font-semibold">Add Visitor</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium">Purpose *</label>
              <select
                name="purpose"
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">Select</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>{p.purpose_name}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input name="name" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input name="phone" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* ID Card */}
            <div>
              <label className="text-sm font-medium">ID Card</label>
              <input name="id_card" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* IPD/OPD/Staff */}
            <div>
              <label className="text-sm font-medium">IPD/OPD/Staff</label>
              <select
                name="opd_ipd_staff"
                onChange={handleTypeChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="STAFF">Staff</option>
                <option value="OPD">OPD Patient</option>
                <option value="IPD">IPD Patient</option>
              </select>
            </div>

            {/* Visit To */}
            <div>
              <label className="text-sm font-medium">Visit To</label>
              <select
                name="visit_to"
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">Select</option>
               {visitToList.map((v) => (
                <option key={v.id} value={`${v.label}(${v.id})`}>
                  {`${v.label}(${v.id})`}
                </option>
              ))}

              </select>
            </div>

            {/* Number */}
            <div>
              <label className="text-sm font-medium">Number Of Person</label>
              <input name="number_of_person" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Date *</label>
              <input type="date" name="date" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* In Time */}
            <div>
              <label className="text-sm font-medium">In Time</label>
              <input type="time" name="in_time" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Out Time */}
            <div>
              <label className="text-sm font-medium">Out Time</label>
              <input type="time" name="out_time" onChange={handleChange} className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Note</label>
              <textarea
                rows="3"
                name="note"
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-3 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md text-white font-medium
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-700"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
