export function PharmacyTableToolbar({ search, setSearch, limit, setLimit }) {
  return (
    <div className="flex flex-wrap justify-between items-center px-4 py-2 border-b gap-3">

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-1.5 rounded w-60"
      />

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>

        <button className="border px-2 py-1 rounded">⧉</button>
        <button className="border px-2 py-1 rounded">📄</button>
        <button className="border px-2 py-1 rounded">📑</button>
        <button className="border px-2 py-1 rounded">🖨</button>
      </div>
    </div>
  );
}
