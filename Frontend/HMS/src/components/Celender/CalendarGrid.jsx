export default function CalendarGrid({ tasks }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 border rounded overflow-hidden bg-white">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
        <div key={d} className="p-2 text-center font-semibold bg-gray-100 border">
          {d}
        </div>
      ))}

      {days.map((day) => {
        const dayTasks = tasks.filter(
          (t) => new Date(t.date).getDate() === day
        );

        return (
          <div key={day} className="h-24 border p-1 text-xs">
            <div className="text-right font-semibold">{day}</div>
            {dayTasks.map((t) => (
              <div
                key={t.id}
                className="bg-pink-600 text-white px-1 py-0.5 rounded mt-1 truncate"
              >
                {t.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
