export default function BirthRecordHeader({ search, setSearch }) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-lg font-semibold">Birth Record</h1>
  
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded text-sm w-full sm:w-64"
          />
  
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm">
            + Add Birth Record
          </button>
        </div>
      </div>
    );
  }
  