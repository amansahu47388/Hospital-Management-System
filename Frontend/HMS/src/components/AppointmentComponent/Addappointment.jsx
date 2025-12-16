import React from "react";

export default function AddAppointmentModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        className="bg-white w-[98%] md:w-[90%] lg:w-[80%]
        rounded-lg shadow-lg max-h-[90vh] overflow-y-auto mx-auto"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">New Appointment</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Doctor *</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Doctor Fees ($) *</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Shift *</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Appointment Date *</label>
              <input type="date" className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Slot *</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Appointment Priority</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Payment Mode</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Status *</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>Select</option>
                <option>Booked</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium">Discount Percentage</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">
                Live Consultant (On Video Conference) *
              </label>
              <select className="w-full border px-3 py-2 rounded">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Message</label>
              <input className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 4 */}
          <div>
            <label className="font-medium">Alternate Address</label>
            <textarea
              rows="2"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t">
          <button className="px-6 py-2 rounded bg-gray-200">
            Save & Print
          </button>
          <button className="px-6 py-2 rounded text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
