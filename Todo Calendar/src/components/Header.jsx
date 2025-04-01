import React from "react"
import "../styles/Header.css"

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <h1 className="header-title">לוח משימות</h1>
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        <span className="slider"></span>
      </label>
    </header>
  )
}

export default Header
