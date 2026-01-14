import { X } from "lucide-react";

export default function EditChargeTypeModal({ open, onClose, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Edit Charge Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Charge Type *</label>
            <input
              defaultValue={data.name}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Module *</label>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              {["Appointment","OPD","IPD","Pathology","Radiology","Blood Bank","Ambulance"].map(m => (
                <label key={m} className="flex gap-2">
                  <input type="checkbox" defaultChecked />
                  {m}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-3 border-t">
          <button className="text-white px-6 py-2 rounded-md
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
            Update
          </button>
        </div>

      </div>
    </div>
  );
}
