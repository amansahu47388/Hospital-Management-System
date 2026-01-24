import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import {  Trash2, Loader2, Pencil } from "lucide-react";
import { getNurseNotes, createNurseNote, updateNurseNote, deleteNurseNote } from "../../api/ipdApi";
import { getNurses } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";

export default function IPDNurseNotes() {
  const { ipdId } = useParams();
  const notify = useNotify();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ipd_patient: ipdId,
    nurse: "",
    note: "",
    comment: ""
  });

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await getNurseNotes({ ipd_patient: ipdId });
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching nurse notes:", error);
      notify("error", "Failed to load nurse notes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNurses = async () => {
    try {
      const res = await getNurses();
      setNurses(res.data);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  useEffect(() => {
    if (ipdId) {
      fetchNotes();
      fetchNurses();
    }
  }, [ipdId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nurse || !formData.note) {
      return notify("error", "Please fill required fields (*)");
    }

    try {
      setIsSubmitting(true);
      if (selectedNote) {
        await updateNurseNote(selectedNote.id, formData);
        notify("success", "Nurse note updated successfully");
      } else {
        await createNurseNote(formData);
        notify("success", "Nurse note created successfully");
      }
      setShowAdd(false);
      setShowEdit(false);
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving nurse note:", error);
      notify("error", "Failed to save nurse note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNurseNote(id);
      notify("success", "Nurse note deleted successfully");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting nurse note:", error);
      notify("error", "Failed to delete nurse note");
    }
  };

  const resetForm = () => {
    setFormData({
      ipd_patient: ipdId,
      nurse: "",
      note: "",
      comment: ""
    });
    setSelectedNote(null);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setFormData({
      ipd_patient: ipdId,
      nurse: note.nurse,
      note: note.note,
      comment: note.comment
    });
    setShowEdit(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/30">
        {/* HEADER */}
        <IPDTabsNavbar />

        {/* CONTENT */}
        <div className="p-4 md:p-1">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px]">

            {/* TITLE BAR */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Nurse Notes</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowAdd(true);
                }}
                className="bg-[#6046B5] text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2 transition-all shadow-sm"
              >
                + Add Nurse Note
              </button>
            </div>

            {/* TIMELINE */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="text-purple-500 animate-spin" />
                <p className="text-gray-500 font-medium italic">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">No nurse notes recorded for this patient.</p>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="relative pl-10 group transition-all"
                  >
                    {/* DOT */}
                    <div className="absolute left-2 top-2 w-4 h-4 bg-[#6046B5] rounded-full z-10 border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>

                    {/* DATE */}
                    <span className="inline-block mb-2 text-[10px] font-black uppercase tracking-wider bg-[#6046B5] text-white px-3 py-1 rounded shadow-sm">
                      {n.formatted_date || new Date(n.created_at).toLocaleString()}
                    </span>

                    {/* CARD */}
                    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group-hover:border-purple-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#6046B5] text-sm">
                            {n.nurse_name || "N/A"}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Assigned Nurse</p>
                        </div>

                        {/* ACTIONS */}
                        <div className=" flex gap-2">
                          <button
                            onClick={() => handleEdit(n)}
                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 text-sm space-y-2">
                        <div className="flex gap-2">
                          <b className="w-16 shrink-0 text-gray-500 uppercase text-[10px] py-1">Note:</b>
                          <p className="text-gray-800 font-medium flex-grow leading-relaxed">{n.note}</p>
                        </div>
                        {n.comment && (
                          <div className="flex gap-2 bg-gray-50 p-2 rounded-md">
                            <b className="w-16 shrink-0 text-gray-500 uppercase text-[10px] py-1">Comment:</b>
                            <p className="text-gray-600 flex-grow italic text-xs">{n.comment}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <p className="text-[10px] text-gray-400 font-bold italic">
                          Entry confirmed by system
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] border-b border-white/10 shrink-0">
                <div className="flex justify-between items-center px-6 py-5 text-white">
                  <h3 className="text-lg font-bold tracking-tight">Add Nurse Note</h3>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="bg-white p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Date</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
                      value={new Date().toLocaleString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Nurse *</label>
                    <select
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      value={formData.nurse}
                      onChange={(e) => setFormData({ ...formData, nurse: e.target.value })}
                    >
                      <option value="">Select Nurse *</option>
                      {nurses.map(nurse => (
                        <option key={nurse.id} value={nurse.id}>{nurse.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Note *</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all h-24"
                    placeholder="Enter observation note..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Comment</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all h-20"
                    placeholder="Enter additional comment..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-purple-100 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] border-b border-white/10 shrink-0">
                <div className="flex justify-between items-center px-6 py-5 text-white">
                  <h3 className="text-lg font-bold tracking-tight">Edit Nurse Note</h3>
                  <button
                    onClick={() => setShowEdit(false)}
                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Date</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
                      value={selectedNote?.formatted_date || ""}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Nurse</label>
                    <select
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      value={formData.nurse}
                      onChange={(e) => setFormData({ ...formData, nurse: e.target.value })}
                    >
                      <option value="">Select Nurse *</option>
                      {nurses.map(nurse => (
                        <option key={nurse.id} value={nurse.id}>{nurse.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Note *</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all h-24"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Comment</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all h-20"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-purple-100 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Update Note"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
