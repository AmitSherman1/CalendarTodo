import React, { useState } from "react";

const TaskPanel = ({ selectedDate, tasks, setTasks, closePanel }) => {

  const [newTask, setNewTask] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)
  const [editedTask, setEditedTask] = useState("")

  const todayStr = new Date().toLocaleDateString('sv-SE');
  const isPastDay = selectedDate < todayStr;

  const handleAddTask = () => {
    if(!newTask.trim()) 
      return

    const newTaskObj = {
      text: newTask,
      completed: false
    }

    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedDate]:[...(prevTasks[selectedDate] || []), newTaskObj],
    }))

    setNewTask("")
  }

  const toggleTaskCompleted = (index) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [selectedDate]: prevTasks[selectedDate].map((task, i) => 
        i === index ? {...task, completed: !task.completed} : task
      ),
    }))
  }

  const handleDeleteTask = (indexToRemove) => {
    const updatedTasks = tasks[selectedDate].filter((_, index) => index !== indexToRemove)

    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedDate]: updatedTasks
    }))
  }

  const handleEditTask = (index) => {
    setEditingIndex(index)
    setEditedTask(tasks[selectedDate][index].text)
  }

  const handleSaveTask = (index) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedDate]: prevTasks[selectedDate].map((task, i) =>
        i === index ? { ...task, text: editedTask } : task
      )
    }))
    setEditingIndex(null)
  }

  return (
    <div className="panel-overlay" onClick={closePanel}>
      <div 
        className="task-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-actions">
          <button className="close-panel" onClick={closePanel}>X</button>
        </div>
  
        <h3>משימות לתאריך {selectedDate}</h3>
  
        <div className="task-dashboard">
          {!isPastDay && (
            <div className="task-input-container">
              <button className="add" onClick={handleAddTask}>+</button>
              <input 
                type="text"
                placeholder="הוסף משימה"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
          )}
  
          {isPastDay && 
            <p className="notice">לא ניתן להוסיף משימות חדשות לתאריך שכבר עבר.</p>
          }
  
          <div className="task-scrollable">
            <ul>
              {(tasks[selectedDate] || []).map((task, index) => (
                <li key={index} className="task-item">
                  <div className="task-row">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(index)} 
                    />
                    
                    {editingIndex === index ? (
                      <input 
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="task-edit-input"
                      />
                    ) : (
                      <span className={task.completed ? "task-completed" : ""}>
                        {task.text}
                      </span>
                    )}
  
                    <div className="task-actions">
                      {editingIndex === index && (
                        <button className="save" onClick={() => handleSaveTask(index)}>שמור</button>
                      )}
                      {!isPastDay && editingIndex !== index && (
                        <button className="edit" onClick={() => handleEditTask(index)}>ערוך</button>
                      )}
                      <button className="delete" onClick={() => handleDeleteTask(index)}>מחק</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )    
};

export default TaskPanel
