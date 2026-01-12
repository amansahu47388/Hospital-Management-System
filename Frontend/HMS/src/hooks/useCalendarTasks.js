import { useState } from "react";

export default function useCalendarTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Doctors Meeting", date: "2026-01-05", endDate: "2026-01-05", start: "2026-01-05T10:00", end: "2026-01-05T11:00", color: "#2563EB", description: "" },
    { id: 2, title: "HIV Vaccine Awareness Day", date: "2026-01-18", endDate: "2026-01-18", start: "2026-01-18T09:00", end: "2026-01-18T17:00", color: "#EC4899", description: "" },
    { id: 3, title: "Staff Meeting", date: "2026-01-25", endDate: "2026-01-25", start: "2026-01-25T14:00", end: "2026-01-25T15:00", color: "#16A34A", description: "" },
  ]);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { id: Date.now(), ...task }]);
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
  };

  return { tasks, addTask, removeTask, updateTask };
}
