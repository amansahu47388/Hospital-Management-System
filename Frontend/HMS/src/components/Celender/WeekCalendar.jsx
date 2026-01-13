export default function WeekCalendar({ tasks, date, onEventClick }) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 border rounded overflow-hidden">
      {days.map((d) => (
        <div key={d} className="border p-2 text-sm">
          <div className="font-semibold text-center">
            {d.toLocaleDateString()}
          </div>

          {tasks
            .filter(
              (t) => {
                const taskStart = new Date(t.date);
                return d.toDateString() === taskStart.toDateString();
              }
            )
            .map((t) => (
              <div
                key={t.id}
                onClick={() => onEventClick?.(t)}
                className="bg-pink-600 text-white text-xs p-1 rounded mt-1 cursor-pointer hover:opacity-80"
                style={{ backgroundColor: t.color || "#EC4899" }}
              >
                {t.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
