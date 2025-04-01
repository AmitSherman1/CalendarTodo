import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Holidays = () => {
  const [holidays, setHolidays] = useState([])

  useEffect(() => {
    axios.get(`https://www.hebcal.com/hebcal?cfg=json&year=2025&month=3&v=1&maj=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=il&lg=he`)
      .then(response => 
        {setHolidays(response.data.items || [])
    })
      .catch(error => console.error("Error fetching holiday", error))
  }, [])

  return (
    <div>
      {holidays.map((holiday, index) => (
        <div key={index}>
          {holiday.date}-{holiday.title}
          </div>
      ))}
    </div>
  )
}

export default Holidays