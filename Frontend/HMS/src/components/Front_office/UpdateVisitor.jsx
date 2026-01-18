import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPurposes, updateVisitor } from "../../api/frontofficeApi";
import { getOpdPatientList } from "../../api/opdApi";
import { getStaffList } from "../../api/authApi";
import { getIpdPatientList } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateVisitor({ open, onClose, refresh, data }) {
  const notify = useNotify();
  const [purposes, setPurposes] = useState([]);
  const [visitToList, setVisitToList] = useState([]);

  const [form, setForm] = useState({
    id: "",
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

  /* Load data into form */
  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        name: data.name,
        purpose: data.purpose,
        phone: data.phone,
        id_card: data.id_card || "",
        visit_to: data.visit_to,
        opd_ipd_staff: data.opd_ipd_staff,
        number_of_person: data.number_of_person,
        date: data.date,
        in_time: data.in_time,
        out_time: data.out_time || "",
        note: data.note || "",
      });
    }
  }, [data]);

  /* Load purposes */
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
      data = r.data.map((u) => ({ id: u.id, label: u.full_name }));
    }
    if (value === "OPD") {
      const r = await getOpdPatientList("all");
      data = r.data.map((p) => ({
        id: p.opd_id,
        label: `${p.patient_detail.first_name} ${p.patient_detail.last_name}`,
      }));
    }
    if (value === "IPD") {
      const r = await getIpdPatientList();
      data = r.data.map((p) => ({
        id: p.ipd_id,
        label: `${p.patient_detail.first_name} ${p.patient_detail.last_name}`,
      }));
    }

    setVisitToList(data);
  };

  const handleSubmit = async () => {
  try {
    if (!form.name || !form.purpose || !form.opd_ipd_staff || !form.visit_to) {
      notify("warning","Please fill all required fields");
      return;
    }

    const payload = {
      name: form.name,
      purpose: form.purpose,
      phone: form.phone,
      id_card: form.id_card,
      visit_to: form.visit_to,
      opd_ipd_staff: form.opd_ipd_staff,
      number_of_person: Number(form.number_of_person),
      date: form.date,
      in_time: form.in_time,
      out_time: form.out_time || null,
      note: form.note,
    };

    await updateVisitor(form.id, payload);
    notify("success","Visitor updated successfully");
    refresh();
    onClose();
  } catch (err) {
    console.error(err.response?.data || err);
    notify("error","Failed to update visitor");
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header (Same as AddVisitor) */}
        <div className="flex items-center justify-between px-5 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="text-lg font-semibold">Edit Visitor</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body (Same as AddVisitor) */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium">Purpose *</label>
              <select name="purpose" value={form.purpose} onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2">
                <option value="">Select</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>{p.purpose_name}</option>
                ))}
              </select>
            </div>

            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="ID Card" name="id_card" value={form.id_card} onChange={handleChange} />

            {/* IPD / OPD / Staff */}
            <div>
              <label className="text-sm font-medium">IPD/OPD/Staff</label>
              <select
                name="opd_ipd_staff"
                value={form.opd_ipd_staff}
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
                value={form.visit_to}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">{form.visit_to || "Select"}</option>
                {visitToList.map((v) => (
                  <option key={v.id} value={`${v.label}(${v.id})`}>
                    {`${v.label}(${v.id})`}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Number Of Person" name="number_of_person" value={form.number_of_person} onChange={handleChange} />
            <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} />
            <Input label="In Time" type="time" name="in_time" value={form.in_time} onChange={handleChange} />
            <Input label="Out Time" type="time" name="out_time" value={form.out_time} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Note</label>
              <textarea rows="3" name="note" value={form.note}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2" />
            </div>

          </div>
        </div>

        {/* Footer (Same as AddVisitor) */}
        <div className="flex justify-end px-5 py-3 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md text-white font-medium
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-700"
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
