import { useState } from "react";

export default function useCalendarTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Doctors Meeting", date: "2026-01-05" },
    { id: 2, title: "HIV Vaccine Awareness Day", date: "2026-01-18" },
    { id: 3, title: "Staff Meeting", date: "2026-01-25" },
  ]);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { id: Date.now(), ...task }]);
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, addTask, removeTask };
}
