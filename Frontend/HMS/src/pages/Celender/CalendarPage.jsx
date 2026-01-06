import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import CalendarHeader from "../../components/Celender/CalendarHeader";
import CalendarGrid from "../../components/Celender/CalendarGrid";
import TodoList from "../../components/Celender/TodoList";
import AddTaskModal from "../../components/Celender/AddTaskModal";
import useCalendarTasks from "../../hooks/useCalendarTasks";

export default function CalendarPage() {
  const { tasks, addTask, removeTask } = useCalendarTasks();
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-full p-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* CALENDAR */}
          <div className="lg:col-span-3 bg-white p-4 rounded shadow">
            <CalendarHeader />
            <CalendarGrid tasks={tasks} />
          </div>

          {/* TODO */}
          <TodoList
            tasks={tasks}
            onAddClick={() => setOpenAdd(true)}
            onDelete={removeTask}
          />
        </div>

        <AddTaskModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onSave={addTask}
        />
      </div>
    </AdminLayout>
  );
}
