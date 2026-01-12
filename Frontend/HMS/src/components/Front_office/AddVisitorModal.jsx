import { X } from "lucide-react";

export default function AddVisitorModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      {/* Modal */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="text-lg font-semibold">Add Visitor</h2>
          <button onClick={onClose}>
            <X className="cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium">Purpose *</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
                <option>Visit</option>
                <option>Inquiry</option>
                <option>Seminar</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* ID Card */}
            <div>
              <label className="text-sm font-medium">ID Card</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Visit To */}
            <div>
              <label className="text-sm font-medium">Visit To</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
                <option>Staff</option>
                <option>OPD Patient</option>
                <option>IPD Patient</option>
              </select>
            </div>

            {/* IPD/OPD/Staff */}
            <div>
              <label className="text-sm font-medium">IPD/OPD/Staff</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
              </select>
            </div>

            {/* Related To */}
            <div>
              <label className="text-sm font-medium">Related To</label>
              <input
                disabled
                className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Number of Person */}
            <div>
              <label className="text-sm font-medium">Number Of Person</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Date *</label>
              <input type="date" className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* In Time */}
            <div>
              <label className="text-sm font-medium">In Time</label>
              <input type="time" className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Out Time */}
            <div>
              <label className="text-sm font-medium">Out Time</label>
              <input type="time" className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Note</label>
              <textarea
                rows="3"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Attach Document */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Attach Document</label>
              <input type="file" className="w-full mt-1" />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-3 border-t bg-gray-50">
          <button
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
