import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Pencil, Trash2, Eye, Plus, X } from "lucide-react";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "SGS Pharmacy",
      contact: "7864251478",
      person: "Nitin Viraj",
      phone: "7864251478",
      license: "RTD-74586",
      address: "Civil lines",
    },
    {
      id: 2,
      name: "Anant Pharmacy",
      contact: "9856478521",
      person: "Anant Singh",
      phone: "9856478521",
      license: "SFR-96-HJNFV",
      address: "Indore",
    },
  ]);

  const emptyForm = {
    id: null,
    name: "",
    contact: "",
    person: "",
    phone: "",
    license: "",
    address: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [openModal, setOpenModal] = useState(false);

  const openAdd = () => {
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpenModal(true);
  };

  const saveSupplier = () => {
    if (form.id) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === form.id ? form : s))
      );
    } else {
      setSuppliers((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setOpenModal(false);
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <MedicineSidebarMenu />
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Supplier List</h1>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                <Plus size={16} /> Add Supplier
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Supplier Name",
                      "Supplier Contact",
                      "Contact Person",
                      "Person Phone",
                      "Drug License",
                      "Address",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="px-3 py-2 text-left whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {suppliers.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">{row.contact}</td>
                      <td className="px-3 py-2">{row.person}</td>
                      <td className="px-3 py-2">{row.phone}</td>
                      <td className="px-3 py-2">{row.license}</td>
                      <td className="px-3 py-2">{row.address}</td>

                      {/* ACTION */}
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1 rounded bg-blue-500 text-white"
                          >
                            <Pencil size={14} />
                          </button>

                          <button className="p-1 rounded bg-green-500 text-white">
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => deleteSupplier(row.id)}
                            className="p-1 rounded bg-red-500 text-white"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
          <div className="w-full max-w-2xl bg-white rounded shadow-lg">
            <div className="flex justify-between items-center px-4 py-3 text-white rounded-t bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {form.id ? "Edit Supplier" : "Add Supplier"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Supplier Name", "name"],
                ["Supplier Contact", "contact"],
                ["Contact Person Name", "person"],
                ["Contact Person Phone", "phone"],
                ["Drug License Number", "license"],
                ["Address", "address"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveSupplier}
                className="px-6 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
