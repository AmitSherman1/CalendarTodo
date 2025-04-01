import React, { useState, useEffect  } from "react";
import "../styles/Calendar.css";
import '../styles/CalendarDaysColors.css'
import "../styles/darkMode.css"
import TaskPanel from "./TaskPanel.jsx"
import Dashboard from "./Dashboard.jsx"
import Header from "./Header.jsx"

const Calendar = () => {
  const weekDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const [darkMode, setDarkMode] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const handleToggle = () => {
    setDarkMode(!darkMode)
  }

  const toggleDashboard = () => {
    setShowDashboard(prev => !prev)
  }

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [holidays, setHolidays] = useState([])

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : {}
  })
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDateOfTheMonth = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])
  
  const handleMonth = (direction) => {
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  useEffect(() => {
    const fetchHoliday = async () => {
      try {
        const response =  await fetch(`https://www.hebcal.com/hebcal?cfg=json&year=${year}&v=1&maj=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=il&lg=he`);

        const data = await response.json()
        setHolidays(data.items || [])
      } catch (error) {
        console.error("Error fetching holidays", error)
      }
    }
    fetchHoliday()
  })

  function getDay(formattedDate) {
    const today = new Date();
    const todayStr = today.toLocaleDateString('sv-SE');

    const isToday = formattedDate === todayStr
    const isPast = formattedDate < todayStr
    const isFuture = formattedDate > todayStr
    const hasTasks = tasks[formattedDate]?.length > 0
    const hasIncompleteTasks = hasTasks && tasks[formattedDate].some(task => !task.completed)
    const hasCompleteTasks = hasTasks && tasks[formattedDate].some(task => task.completed)
    const isSelected = formattedDate === selectedDate
    const todayIncomplete = hasCompleteTasks && hasIncompleteTasks

    let status = "default"

   
    if (isSelected) {
      status = "selected"
    } else if (todayIncomplete) {
      status = "today-incomplete"
    } else if (isToday && hasIncompleteTasks) {
      status = "today-incomplete"
    } else if (isToday && hasCompleteTasks) {
      status = "today-complete"
    } else  if(isToday) {
      status = "today"
    } else if (isPast && hasIncompleteTasks) {
      status = "past-incomplete"
    } else if (isPast && hasCompleteTasks) {
      status = "past-completed"
    } else if (isPast) {
      status = "past"
    } else if (isFuture && hasCompleteTasks) {
      status = "future-task-completed"
    } else if (isFuture && hasTasks) {
      status = "future-has-tasks"
    }

    switch (status) {
      case "selected":
        return "day selected"
      case "today":
        return "day today"
      case "today-incomplete":
        return "day today-incomplete" 
      case "today-complete":
        return "day today-complete"
      case "past-incomplete":
        return "day past-incomplete"
      case "past":
        return "day past"
      case "past-completed":
        return "day past-completed"
      case "future-has-tasks":
        return "day future-has-tasks"
      case "future-task-completed":
        return "day future-task-completed"
      case "todayIncomplete":
        return "day today-incomplete"
      default:
        return "day"
    }
  }

  const openPanel = (day) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
  }

  return (
    <div className={darkMode ? "dark" : ""}>
     <Header darkMode={darkMode} toggleDarkMode={handleToggle}/>


    <div className="main-layout">
      <div className="calendar-container">
        <div className="calendar-header-buttons">
          <button onClick={() => handleMonth(-1)}>קודם</button>
          <h2>{new Date(year, month).toLocaleString("he-IL", { month: "long" })} {year}</h2>
          <button onClick={() => handleMonth(1)}>הבא</button>
        </div>
        <button className="task-button" onClick={toggleDashboard}>סיכום משימות</button>

        <div className="week-days">
          {weekDays.map((day, index) => (
            <div key={index} className="week-day">
              {day}
            </div>
          ))}
        </div>

      <div className="days-grid">
        {Array(firstDateOfTheMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="empty-cell"></div>
        ))}

        {daysArray.map((day) => {
          const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const holiday = holidays.find(h => h.date === formattedDate && h.category === "holiday")

          return (
          <div 
            key={day} 
            className={getDay(formattedDate)}
            onClick={() => openPanel(day)}
            >
            {day}
            {holiday && <div className="holiday-name">{holiday.title}</div>}
          </div>
          )
        })}
      </div>

    {selectedDate && (
      <TaskPanel 
        selectedDate={selectedDate}
        tasks={tasks} 
        setTasks={setTasks} 
        closePanel={() => setSelectedDate(null)}
      />
    )}
    </div>

      {showDashboard && (
        <Dashboard
          tasks={tasks}
          closeDashboard={toggleDashboard}
        />
      )}
    </div>
  </div>
  );
}

export default Calendar;
