import { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api/calendarApi";

export default function useCalendarTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addTask = async (task) => {
    try {
      const response = await createEvent(task);
      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteEvent(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error removing event:", error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const response = await updateEvent(updatedTask.id, updatedTask);
      setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? response.data : t));
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return { tasks, addTask, removeTask, updateTask, loading, fetchEvents };
}
