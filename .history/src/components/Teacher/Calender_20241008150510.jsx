import React from 'react'
import { BsDot } from 'react-icons/bs'
import { CalendarCell, DayNumber, Event, RowWrapper } from './TimeTableStyle'

export const generateCalendar = (selectedDate, events, openModal, cellRef) => {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  // Get the first day of the month and adjust to start from Monday
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let calendar = []
  let week = []
  let dayCounter = 1

  // Create empty cells before the first day of the month (Monday as the first day)
  for (let i = 0; i < adjustedFirstDay; i++) {
    week.push(<CalendarCell key={`empty-${i}`} />)
  }

  // Loop through the days of the month and generate cells
  while (dayCounter <= daysInMonth) {
    for (let i = week.length; i < 7; i++) {
      if (dayCounter <= daysInMonth) {
        const dayEvents = events[dayCounter] || []
        const eventLimit = 4
        const moreCount = dayEvents.length - eventLimit

        week.push(
          <CalendarCell key={dayCounter} ref={cellRef}>
            <DayNumber>{dayCounter}</DayNumber>
            {dayEvents.slice(0, eventLimit).map((event, index) => (
              <RowWrapper key={index}>
                <Event>
                  <BsDot fontSize={16} color="blue" />
                  {event}
                </Event>
              </RowWrapper>
            ))}
            {moreCount > 0 && (
              <Event
                onClick={(e) => openModal(dayEvents, e)}
                style={{ color: 'blue', cursor: 'pointer' }}
              >
                +{moreCount} more
              </Event>
            )}
          </CalendarCell>
        )
        dayCounter++
      } else {
        week.push(<CalendarCell key={`empty-${i}`} />)
      }
    }
    calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>)
    week = []
  }

  return calendar
}
