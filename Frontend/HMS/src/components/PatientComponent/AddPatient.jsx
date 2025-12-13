import React from "react";

export default function AddPatient({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white w-[98%] md:w-[90%] lg:w-[80%] 
        rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto"
      >

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Add Patient</h2>
          <button onClick={onClose} className="text-xl text-black font-bold">×</button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name *</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Guardian Name</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Gender</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Date Of Birth</label>
              <input type="date" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Age (yy-mm-dd)</label>
              <div className="flex gap-2">
                <input placeholder="Year" className="border px-2 py-2 w-full rounded" />
                <input placeholder="Month" className="border px-2 py-2 w-full rounded" />
                <input placeholder="Day" className="border px-2 py-2 w-full rounded" />
              </div>
            </div>

            <div>
              <label className="font-medium">Blood Group</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Marital Status</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Patient Photo</label>
              <div className="border rounded py-2 px-3 text-center text-sm text-gray-600 cursor-pointer">
                📁 Drop a file here or click
              </div>
            </div>
          </div>

          {/* ROW 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Phone</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Address</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Any Known Allergies</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 6 */}
          <div>
            <label className="font-medium">Remarks</label>
            <input className="w-full border px-3 py-2 rounded" />
          </div>

          {/* ROW 7 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium">TPA</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">TPA ID</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">TPA Validity</label>
              <input type="date" className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">National Identification Number</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Alternate Number</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t">
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
