import React from 'react'
import { BsDot } from 'react-icons/bs'
import { CalendarCell, DayNumber, Event, RowWrapper } from './StyledComponents'

export const generateCalendar = (selectedDate, events, openModal, cellRef) => {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let calendar = []
  let week = []
  let dayCounter = 1

  // Tạo các ô trống trước ngày đầu tiên của tháng
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(<CalendarCell key={`empty-${i}`} />)
  }

  // Lặp qua các ngày trong tháng và tạo ô cho từng ngày
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
