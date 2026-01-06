export default function CalendarHeader() {
  return (
    <div
      className="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
        mb-4
      "
    >
      {/* LEFT CONTROLS */}
      <div className="flex items-center gap-2">
        <button className="px-3 py-1  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-sm">
          ‹
        </button>
        <button className="px-3 py-1  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-sm">
          ›
        </button>
        <button className="px-3 py-1  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-sm">
          Today
        </button>
      </div>

      {/* MONTH TITLE */}
      <h2
        className="
          text-center text-base sm:text-lg font-semibold
          whitespace-nowrap
        "
      >
        January 2026
      </h2>

      {/* VIEW SWITCH */}
      <div className="flex items-center gap-1 justify-center sm:justify-end">
        <button className="px-3 py-1  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-sm">
          Month
        </button>
        <button className="px-3 py-1 bg-gray-300 rounded text-sm">
          Week
        </button>
        <button className="px-3 py-1 bg-gray-300 rounded text-sm">
          Day
        </button>
      </div>
    </div>
  );
}
