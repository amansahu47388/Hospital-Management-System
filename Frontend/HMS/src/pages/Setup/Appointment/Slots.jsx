import AdminLayout from "../../../layout/AdminLayout";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";

export default function Slots() {
  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* SIDEBAR */}
          <SlotsSidebarMenu />

          {/* CONTENT */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded shadow border">

              {/* HEADER */}
              <div className="px-4 py-3 border-b">
                <h1 className="text-lg font-semibold">Slots</h1>
              </div>

              {/* BODY */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Doctor <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full mt-1 border px-3 py-2 rounded">
                      <option>Select</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Shift <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full mt-1 border px-3 py-2 rounded">
                      <option>Select</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      className="px-4 py-2 text-white rounded
                      bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Consultation Duration Minutes *
                    </label>
                    <input className="w-full mt-1 border px-3 py-2 rounded" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Charge Category
                    </label>
                    <select className="w-full mt-1 border px-3 py-2 rounded">
                      <option>Select</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Charge *
                    </label>
                    <select className="w-full mt-1 border px-3 py-2 rounded">
                      <option>Select</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Amount ($)
                    </label>
                    <input
                      disabled
                      className="w-full mt-1 border px-3 py-2 rounded bg-gray-100"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
