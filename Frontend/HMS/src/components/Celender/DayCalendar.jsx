export default function DayCalendar({ tasks, date, onEventClick }) {
  const HOUR_HEIGHT = 64;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const dayTasks = tasks.filter((t) => {
    const taskStart = new Date(t.date);
    const taskEnd = new Date(t.endDate || t.date);
    return date >= taskStart && date <= taskEnd;
  });

  const getTop = (start) => {
    const d = new Date(start);
    return (d.getHours() + d.getMinutes() / 60) * HOUR_HEIGHT;
  };

  const getHeight = (start, end) => {
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60);
    return Math.max(diff * HOUR_HEIGHT, 40); // minimum height
  };

  const getEffectiveTimes = (event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const effectiveStart = eventStart < startOfDay ? startOfDay : eventStart;
    const effectiveEnd = eventEnd > endOfDay ? endOfDay : eventEnd;
    return { effectiveStart, effectiveEnd };
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px] grid grid-cols-[80px_1fr] border rounded bg-white">

        {/* TIME COLUMN */}
        <div className="border-r bg-gray-50">
          <div className="h-10 border-b text-xs font-semibold text-center">
            Time
          </div>
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className="h-16 border-b text-xs text-gray-500 text-center flex items-start justify-center pt-1"
            >
              {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
            </div>
          ))}
        </div>

        {/* DAY COLUMN */}
        <div className="relative">

          {/* HEADER */}
          <div className="h-10 border-b text-sm font-semibold text-center bg-gray-50">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* GRID */}
          <div className="relative h-[1536px] overflow-hidden">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="h-16 border-b" />
            ))}

            {/* EVENTS */}
            {dayTasks.map((event) => {
              const { effectiveStart, effectiveEnd } = getEffectiveTimes(event);
              if (effectiveStart >= effectiveEnd) return null;
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="
                    
                    absolute left-2 right-2
                    text-xs text-white p-2 rounded
                    cursor-pointer shadow
                    hover:opacity-90 transition
                  "
                  style={{
                    backgroundColor: event.color,
                    top: getTop(effectiveStart),
                    height: getHeight(effectiveStart, effectiveEnd),
                  }}
                >
                  <div className="font-semibold truncate">
                    {event.title}
                  </div>
                  <div className="text-[10px] opacity-90">
                    {new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(event.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
