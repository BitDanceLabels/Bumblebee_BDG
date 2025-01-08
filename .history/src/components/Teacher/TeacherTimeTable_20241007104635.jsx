import React, { useState, useRef } from 'react'
import { BsDot } from 'react-icons/bs'
import TicketModal from '../modal/TicketModal'
import DetailsSession from '../modal/DetailsSessionModal'
import {
  Container,
  Header,
  ButtonWrapper,
  ExcelButton,
  TicketButton,
  InputCustom,
  Month,
  CalendarTable,
  CalendarHeader,
  CalendarCell,
  DayNumber,
  Event,
  RowWrapper
} from './TimeTableStyle'

const TeacherTimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullModalOpen, setIsFullModalOpen] = useState(false)
  const [currentEvents, setCurrentEvents] = useState([])
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const cellRef = useRef(null)

  const getCurrentMonth = () => {
    const year = selectedDate.getFullYear()
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
    return `${year}-${month}`
  }

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-')
    setSelectedDate(new Date(year, month - 1, 1))
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const events = {
    1: [
      '08:00 A10965',
      '18:10 A14776',
      '19:10 A14729',
      '20:00 A10941',
      '21:00 B60002'
    ],
    2: ['09:00 B77095', '10:00 B01305', '16:00 B16031', '17:00 A17779'],
    3: ['08:00 A10965', '18:10 A14776', '19:10 A14729', '20:30 A17964'],
    4: [
      '09:00 B77095',
      '10:00 B01305',
      '11:00 B1035',
      '20:30 A17964',
      '21:00 B96002'
    ],
    5: ['08:00 A10965', '17:00 B16031', '20:30 A17964']
  }

  const openModal = (dayEvents, event) => {
    const rect = event.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY + rect.height,
      left: rect.left + window.scrollX
    })
    setCurrentEvents(dayEvents)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentEvents([])
  }

  const openFullModal = () => {
    setIsFullModalOpen(true)
  }

  const closeFullModal = () => {
    setIsFullModalOpen(false)
  }

  const generateCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    let calendar = []
    let week = []
    let dayCounter = 1

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(<CalendarCell key={`empty-${i}`} />)
    }

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

  return (
    <Container>
      <Header>
        <div>
          <InputCustom
            type="month"
            value={getCurrentMonth()}
            onChange={handleMonthChange}
          />
        </div>
        <ButtonWrapper>
          <ExcelButton>Export Time Table (Excel)</ExcelButton>
          <TicketButton onClick={openFullModal}>Ticket</TicketButton>
        </ButtonWrapper>
      </Header>
      <Month>
        {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
        {selectedDate.getFullYear()}
      </Month>
      <CalendarTable>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <CalendarHeader key={day}>{day}</CalendarHeader>
            ))}
          </tr>
        </thead>
        <tbody>{generateCalendar()}</tbody>
      </CalendarTable>

      {/* Mini modal */}
      {isModalOpen && (
        <DetailsSession
          position={modalPosition}
          events={currentEvents}
          onClose={closeModal}
        />
      )}

      {/* Full screen modal */}
      <TicketModal
        show={isFullModalOpen}
        events={events}
        onClose={closeFullModal}
      />
    </Container>
  )
}

export default TeacherTimeTable
