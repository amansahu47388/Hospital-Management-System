export function BillActions() {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-700 text-white px-5 py-2 rounded">
        Save
      </button>

      <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-800 text-white px-5 py-2 rounded">
        Save & Print
      </button>
    </div>
  );
}
