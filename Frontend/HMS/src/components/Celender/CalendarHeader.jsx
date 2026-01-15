export default function CalendarHeader({
  view,
  date,
  onPrev,
  onNext,
  onToday,
  onChangeView,
}) {
  const title =
    view === "month"
      ? date.toLocaleString("default", { month: "long", year: "numeric" })
      : view === "week"
      ? `Week of ${date.toDateString()}`
      : date.toDateString();

  return (
    <div
      className="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
        mb-4 p-3 rounded-lg
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
        text-white
      "
    >
      {/* LEFT CONTROLS */}
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <HeaderButton onClick={onPrev}>‹</HeaderButton>
        <HeaderButton onClick={onNext}>›</HeaderButton>
        <HeaderButton onClick={onToday} primary>
          Today
        </HeaderButton>
      </div>

      {/* TITLE */}
      <h2
        className="
          text-center font-semibold
          text-sm sm:text-base md:text-lg
          whitespace-nowrap truncate
        "
        title={title}
      >
        {title}
      </h2>

      {/* VIEW SWITCH */}
      <div className="flex items-center gap-1 justify-center sm:justify-end">
        {["month", "week", "day"].map((v) => (
          <HeaderButton
            key={v}
            onClick={() => onChangeView(v)}
            active={view === v}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </HeaderButton>
        ))}
      </div>
    </div>
  );
}

/* ---------------- BUTTON ---------------- */
function HeaderButton({ children, onClick, active, primary }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md
        text-xs sm:text-sm font-medium
        transition
        ${
          active
            ? "bg-white text-[#6046B5] shadow"
            : primary
            ? "bg-black/30 hover:bg-black/40"
            : "bg-white/20 hover:bg-white/30"
        }
        active:scale-95
      `}
    >
      {children}
    </button>
  );
}
