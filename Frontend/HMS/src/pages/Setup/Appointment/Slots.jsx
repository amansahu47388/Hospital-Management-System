import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import { useNotify } from "../../../context/NotificationContext";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";

export default function Slots() {
  const notify = useNotify();

  const [formData, setFormData] = useState({
    doctor: "",
    shift: "",
    duration: "",
    chargeCategory: "",
    charge: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (!formData.doctor || !formData.shift) {
      notify("error", "Please select doctor and shift");
      return;
    }
    notify("info", "Searching for slots...");
    // Add search logic here
  };

  const handleSave = () => {
    if (!formData.duration || !formData.charge) {
      notify("error", "Please fill all required fields");
      return;
    }
    notify("success", "Slot configuration saved successfully");
    // Add save logic here
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Slots</h2>
        </div>

        <div className="flex gap-4">

          <SlotsSidebarMenu />


          {/* CONTENT */}
          <div className="flex-1 bg-white rounded-md shadow">
            <div className="p-6 space-y-6">

              {/* SEARCH SECTION */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Slot</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Doctor <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full mt-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    >
                      <option value="">Select Doctor</option>
                      <option value="1">Dr. Sonia Bush</option>
                      <option value="2">Dr. Sansa Gomez</option>
                      <option value="3">Dr. Amit Singh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Shift <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleChange}
                      className="w-full mt-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    >
                      <option value="">Select Shift</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className="w-full px-4 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* CONFIGURATION SECTION */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Slot Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Consultation Duration (Minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 15, 30"
                      className="w-full mt-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Charge Category
                    </label>
                    <select
                      name="chargeCategory"
                      value={formData.chargeCategory}
                      onChange={handleChange}
                      className="w-full mt-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    >
                      <option value="">Select Category</option>
                      <option value="consultation">Consultation</option>
                      <option value="procedure">Procedure</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Charge <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="charge"
                      value={formData.charge}
                      onChange={handleChange}
                      className="w-full mt-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    >
                      <option value="">Select Charge</option>
                      <option value="1">General Consultation - $50</option>
                      <option value="2">Specialist Consultation - $100</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      disabled
                      className="w-full mt-1 border px-3 py-2 rounded bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSave}
                  className="px-8 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90 shadow-md"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
