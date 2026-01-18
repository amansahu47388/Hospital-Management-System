import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import RadiologySidebarMenu from "../../../components/Setup/Radiology/RadiologySidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function RadiologyCategory() {
  const [categories, setCategories] = useState([
    { id: 1, name: "X-RAY CHEST PA VIEW" },
    { id: 2, name: "X-RAY PNS (WATER'S VIEW)" },
    { id: 3, name: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS" },
    { id: 4, name: "ULTRASOUND WHOLE ABDOMEN" },
    { id: 5, name: "DOPPLER PERIPHERAL BILATERAL (VENOUS)" },
    { id: 6, name: "CT ORBITS" },
    { id: 7, name: "CT CHEST PLAIN" },
    { id: 8, name: "CT 3D STUDY" },
    { id: 9, name: "M. R. C. P." },
    { id: 10, name: "MRI CARDIAC WITH CONTRAST" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [openModal, setOpenModal] = useState(false);

  const openAdd = () => {
    setForm({ id: null, name: "" });
    setOpenModal(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpenModal(true);
  };

  const saveCategory = () => {
    if (form.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === form.id ? form : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }
    setOpenModal(false);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
     <div className="min-h-screen p-1">
     
             {/* HEADER */}
             <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
               <h2 className="text-lg font-semibold">Radiology Category</h2>
     
               <button
                 onClick={openAdd}
                 className="flex items-center gap-2 bg-gradient-to-b
                 from-[#6046B5] to-[#8A63D2]
                 text-white px-4 py-2 rounded-md"
               >
                 <Plus size={16} /> Add Radiology Category
               </button>
             </div>
     
             <div className="flex gap-4">
     
               {/* LEFT MENU */}
               <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
                 <RadiologySidebarMenu />
               </div>
     
     
               {/* TABLE */}
               <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-100">
                     <tr>
                       <th className="px-3 py-2 text-left">Category Name</th>
                       <th className="px-3 py-2 text-left">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     {categories.map((row) => (
                       <tr key={row.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 text-left">{row.name}</td>
                         <td className="px-3 py-2 text-left">
                           <div className="flex gap-3">
                             <button
                               onClick={() => openEdit(row)}
                               className="text-purple-600 hover:text-purple-800"
                             >
                               <Pencil size={16} />
                             </button>
                             <button
                               onClick={() => deleteCategory(row.id)}
                               className="text-red-600 hover:text-red-800"
                             >
                               <Trash2 size={16} />
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
     

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
          <div className="w-full max-w-lg bg-white rounded shadow-lg">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-t">
              <h2 className="font-semibold">
                {form.id ? "Edit Radiology Category" : "Add Radiology Category"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4">
              <label className="text-sm font-medium">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded
                focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveCategory}
                className="px-6 py-2 text-white rounded
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
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
