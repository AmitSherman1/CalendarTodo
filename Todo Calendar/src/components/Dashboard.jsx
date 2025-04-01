import React, { useState, useEffect } from "react"
import "../styles/Dashboard.css"

const Dashboard = ({ tasks, closeDashboard }) => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDashboard();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDashboard]);
  

  function stripTime(date) {
    return new  Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const [range, setRange] = useState("week")

  const now = new Date()
  let startDate
  let endDate

  if(range === "week") {
    const dayOfWeek = now.getDay()
    startDate = new Date(now)
    startDate.setDate(now.getDate() - dayOfWeek)
    endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
  } else if (range === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  } else if (range === "year") {
    startDate = new Date(now.getFullYear(), 0, 1)
    endDate = new Date(now.getFullYear(), 11, 31)
  }

  const tasksInRange = Object.entries(tasks).filter(([dateStr]) => {
    const [year, month, day] = dateStr.split("-").map(Number)
    const date = new Date(year, month - 1, day)

    return date >= stripTime(startDate) && date <= stripTime(endDate)
  })

  let total = 0
  let completed = 0
  let uncompleted = 0

  tasksInRange.forEach(([, taskArray]) => {
    total += taskArray.length
    completed += taskArray.filter(t => t.completed).length
    uncompleted += taskArray.filter(t => !t.completed).length
  })

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return(
  <>
    <div className="dashboard-overlay" onClick={closeDashboard}></div>

    <div className="dashboard-panel">
      <button className="close-button" onClick={closeDashboard}>X</button>
    
      <div className="range-buttons">
        <button onClick={() => setRange("week")}>שבוע</button>
        <button onClick={() => setRange("month")}>חודש</button>
        <button onClick={() => setRange("year")}>שנה</button>
      </div>
      
      <div className="dashboard">
        <h3>סיכום המשימות שלך</h3>
        <p>סך הכל משימות:{total}</p>
        <p>משימות שהושלמו:{completed}</p>
        <p>משימות פתוחות:{uncompleted}</p>
        <p>אחוז ביצוע: {completionRate}%</p>

      <div className="progress-bar-container">
        <div
          className={`progress-bar-fill ${
          completionRate >= 80
            ? "green"
            : completionRate >= 50
            ? "orange"
            : "red"
          }`}
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Dashboard