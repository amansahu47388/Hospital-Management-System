export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <span className="px-3 py-1">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        className="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  );
}
