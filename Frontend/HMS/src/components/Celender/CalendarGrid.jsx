export default function CalendarGrid({ tasks, date, onEventClick, onDateClick }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const cellWidthPercent = 100 / 7;
  const cellHeight = 96; // h-24

  const multiDayEvents = tasks.filter(t => t.endDate && new Date(t.endDate) > new Date(t.date));

  return (
    <div className="relative border border-gray-300 rounded overflow-hidden bg-white">
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div key={d} className={`p-2 text-center font-semibold bg-gray-100 border-b border-gray-300 ${i !== 6 ? 'border-r' : ''}`}>
            {d}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            const colIndex = index % 7;
            return <div key={index} className={`h-24 border-b border-gray-300 p-1 text-md bg-gray-50 ${colIndex !== 6 ? 'border-r' : ''}`}></div>;
          }
          const dayTasks = tasks.filter(
            (t) => {
              const taskStart = new Date(t.date);
              const currentDay = new Date(year, month, day);
              const isMulti = t.endDate && new Date(t.endDate) > taskStart;
              if (isMulti) return false;
              return taskStart.toDateString() === currentDay.toDateString();
            }
          );

          const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const colIndex = index % 7;
          const borderClasses = `border-b border-gray-300 ${colIndex !== 6 ? 'border-r' : ''}`;

          return (
            <div
              key={index}
              className={`h-24 p-1 text-md cursor-pointer hover:bg-gray-200 transition-colors ${borderClasses}`}
              onClick={() => onDateClick?.(formattedDate)}
            >
              <div className="text-right font-semibold">{day}</div>
              {dayTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(t);
                  }}
                  className="bg-pink-600 text-white px-1 py-0.5 rounded mt-1 truncate cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: t.color || "#EC4899" }}
                >
                  {t.title}
                </div>
              ))}
            </div>
          );
        })}

      </div>

      {multiDayEvents.map(event => {
        const start = new Date(event.date);
        const end = new Date(event.endDate);
        if (start.getMonth() !== month || end.getMonth() !== month) return null;
        const startDay = start.getDate();
        const endDay = end.getDate();
        const startCol = (firstDay + startDay - 1) % 7;
        const endCol = (firstDay + endDay - 1) % 7;
        const startRow = Math.floor((firstDay + startDay - 1) / 7);
        const endRow = Math.floor((firstDay + endDay - 1) / 7);
        if (startRow !== endRow) return null; // skip if spans rows for now
        const left = startCol * cellWidthPercent + '%';
        const width = (endCol - startCol + 1) * cellWidthPercent + '%';
        const top = (startRow + 1) * cellHeight + 8 + 'px'; // +1 for header row, +8 for padding
        return (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event)}
            className="absolute text-white px-1 py-0.5 rounded cursor-pointer hover:opacity-80 text-xs"
            style={{ left, top, width, height: '20px', backgroundColor: event.color || "#EC4899" }}
          >
            {event.title}
          </div>
        );
      })}
    </div>
  );
}
