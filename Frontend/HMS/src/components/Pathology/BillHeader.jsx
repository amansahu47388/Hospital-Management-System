import { X, Search, Plus } from "lucide-react";

export default function BillHeader({
  title = "Generate Bill",
  applyTPA,
  setApplyTPA,
  onClose,
  onAddPatient,
  showPrescription = true,
  showTPA = true
}) {
  return (
    <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-3">

      <div className="flex flex-wrap items-center gap-3">

        {/* PATIENT SELECT */}
        <div className="flex flex-1 min-w-[260px] gap-2">
          <select className="w-full px-3 py-2 rounded text-black">
            <option>Select Patient</option>
          </select>

          <button
            onClick={onAddPatient}
            className="flex items-center gap-1 px-3 py-2 rounded bg-white text-[#6046B5] font-semibold whitespace-nowrap"
          >
            <Plus size={16} />
            New Patient
          </button>
        </div>

        {/* PRESCRIPTION */}
        {showPrescription && (
          <div className="flex items-center gap-2 min-w-[220px]">
            <input
              placeholder="Prescription No"
              className="px-3 py-2 rounded text-black w-full"
            />
            <button className="bg-white p-2 rounded">
              <Search size={18} className="text-[#6046B5]" />
            </button>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 ml-auto">
          {showTPA && (
            <label className="flex items-center gap-2 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={applyTPA}
                onChange={(e) => setApplyTPA?.(e.target.checked)}
              />
              Apply TPA
            </label>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/20"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
