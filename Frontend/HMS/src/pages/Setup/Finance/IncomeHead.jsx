import { useEffect, useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import FinanceSidebarMenu from "../../../components/Setup/Finance/FinanceSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  getIncomeHeads,
  createIncomeHead,
  updateIncomeHead,
  deleteIncomeHead,
} from "../../../api/financeApi";

import { useNotify } from "../../../context/NotificationContext";

export default function IncomeHead() {
  const notify = useNotify();

  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", desc: "" });

  /* ---------- LOAD DATA ---------- */
  const loadData = async () => {
    try {
      const res = await getIncomeHeads();
      setList(res.data);
    } catch (err) {
      notify("error", "Failed to load income heads");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------- MODAL ---------- */
  const openAdd = () => {
    setForm({ id: null, name: "", desc: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      desc: row.description || "",
    });
    setOpen(true);
  };

  /* ---------- SAVE ---------- */
  const saveData = async () => {
    try {
      if (!form.name.trim()) {
        notify("error", "Income head is required");
        return;
      }

      if (form.id) {
        await updateIncomeHead(form.id, {
          name: form.name,
          description: form.desc,
        });
        notify("success", "Income head updated successfully");
      } else {
        await createIncomeHead({
          name: form.name,
          description: form.desc,
        });
        notify("success", "Income head created successfully");
      }

      setOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.name || err.response?.data?.detail || "Something went wrong";
      notify("error", msg);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteRow = async (id) => {
    try {
      await deleteIncomeHead(id);
      notify("success", "Income head deleted successfully");
      loadData();
    } catch (err) {
      notify("error", "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Income Head List</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
          >
            <Plus size={16} /> Add Income Head
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <FinanceSidebarMenu />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Income Head</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                  >
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(row)}
                          className="text-purple-600 hover:text-purple-800 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!list.length && (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-3 py-6 text-center text-gray-400"
                    >
                      No income heads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2">
          <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden">
            {/* MODAL HEADER */}
            <div
              className="flex justify-between items-center px-4 py-3 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <h2 className="font-semibold">
                {form.id ? "Edit Income Head" : "Add Income Head"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Head <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter income head"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) =>
                    setForm({ ...form, desc: e.target.value })
                  }
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition min-h-[100px]"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={saveData}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
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
