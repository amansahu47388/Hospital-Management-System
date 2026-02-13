import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import PatientLayout from "../../layout/PatientLayout";
import CalendarHeader from "../../components/Celender/CalendarHeader";
import CalendarGrid from "../../components/Celender/CalendarGrid";
import WeekCalendar from "../../components/Celender/WeekCalendar";
import DayCalendar from "../../components/Celender/DayCalendar";
import TodoList from "../../components/Celender/TodoList";
import AddTaskModal from "../../components/Celender/AddTaskModal";
import ShowEventModal from "../../components/Celender/ShowEventModal";
import useCalendarTasks from "../../hooks/useCalendarTasks";
import EventModal from "../../components/Celender/EventModal";
import { useAuth } from "../../context/AuthContext";

export default function CalendarPage() {
  const { user } = useAuth();
  const isPatient = user?.role?.toLowerCase() === "patient";

  const { tasks, addTask, removeTask, updateTask, loading } = useCalendarTasks();

  const [view, setView] = useState("month"); // month | week | day
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openAdd, setOpenAdd] = useState(false);
  const [initialDate, setInitialDate] = useState("");

  const handleDateClick = (dateStr) => {
    if (isPatient) return;
    setInitialDate(dateStr);
    setOpenAdd(true);
  };

  /* NAVIGATION */
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    if (view === "week") d.setDate(d.getDate() - 7);
    if (view === "day") d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    if (view === "week") d.setDate(d.getDate() + 7);
    if (view === "day") d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => setCurrentDate(new Date());

  // calendar
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openShow, setOpenShow] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenShow(true);
  };

  const handleEditEvent = () => {
    if (isPatient) return;
    setOpenShow(false);
    setOpenEvent(true);
  };

  const handleSaveEvent = (updated) => {
    updateTask(updated);
    setOpenEvent(false);
  };

  const handleDeleteEvent = (id) => {
    removeTask(id);
    setOpenEvent(false);
  };

  const Layout = isPatient ? PatientLayout : AdminLayout;

  return (
    <Layout>
      <div className="min-h-full p-1">
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6046B5]"></div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* CALENDAR */}
          <div className="lg:col-span-3 bg-white p-4 rounded shadow">
            <CalendarHeader
              view={view}
              date={currentDate}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={handleToday}
              onChangeView={setView}
            />

            {view === "month" && (
              <CalendarGrid
                tasks={tasks}
                date={currentDate}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}

            {view === "week" && (
              <WeekCalendar
                tasks={tasks}
                date={currentDate}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}

            {view === "day" && (
              <DayCalendar
                tasks={tasks}
                date={currentDate}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
          </div>

          {/* TODO */}
          <TodoList
            tasks={tasks}
            readOnly={isPatient}
            onAddClick={() => {
              setInitialDate("");
              setOpenAdd(true);
            }}
            onDelete={removeTask}
          />
        </div>

        {!isPatient && (
          <AddTaskModal
            open={openAdd}
            initialDate={initialDate}
            onClose={() => setOpenAdd(false)}
            onSave={addTask}
          />
        )}

        <ShowEventModal
          open={openShow}
          event={selectedEvent}
          readOnly={isPatient}
          onClose={() => setOpenShow(false)}
          onEdit={handleEditEvent}
        />

        {!isPatient && (
          <EventModal
            open={openEvent}
            event={selectedEvent}
            onClose={() => setOpenEvent(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </Layout>
  );
}
