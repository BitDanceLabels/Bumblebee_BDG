import React from 'react'
import { BsDot } from 'react-icons/bs'
import { CalendarCell, DayNumber, Event, RowWrapper } from './TimeTableStyle'

export const generateCalendar = (selectedDate, events, openModal, cellRef) => {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  // Get the first day of the month (in JS, 0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  // Adjust so that week starts from Monday (JS getDay() returns 0 for Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let weeks = []
  let currentDay = 1

  // Loop through the weeks (6 rows for a full month display)
  for (let i = 0; i < 6; i++) {
    let days = []

    // Loop through the days of the week (7 columns)
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < adjustedFirstDay) {
        // Empty cells before the start of the month
        days.push(<td key={`${i}-${j}`}></td>)
      } else if (currentDay > daysInMonth) {
        // Empty cells after the end of the month
        days.push(<td key={`${i}-${j}`}></td>)
      } else {
        const dayEvents = events[currentDay] || []
        days.push(
          <td
            key={`${i}-${j}`}
            ref={cellRef}
            onClick={(e) => openModal(dayEvents, e)}
          >
            {currentDay}
          </td>
        )
        currentDay++
      }
    }

    weeks.push(<tr key={i}>{days}</tr>)
  }

  return weeks
}
