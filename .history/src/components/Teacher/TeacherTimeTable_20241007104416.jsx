import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { BsDot } from 'react-icons/bs'
import TicketModal from '../modal/TicketModal'
import DetailsSession from '../modal/DetailsSessionModal'

export const Container = styled.div`
  padding: 20px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const ButtonWrapper = styled.div``

export const Button = styled.button`
  padding: 16px 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
  }
`

export const ExcelButton = styled(Button)`
  margin-right: 20px;
`

export const TicketButton = styled(Button)`
  background-color: orange;
`

export const CancelButton = styled(Button)`
  background-color: red;
`

export const SubmitButton = styled(Button)``

export const Month = styled.h3`
  text-align: center;
  font-size: 20px;
`

export const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

export const CalendarHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 16px;
`

export const CalendarCell = styled.td`
  vertical-align: center;
  border: 1px solid #ddd;
  position: relative;
  padding: 5px;
  width: 150px; // Set fixed width
  height: 180px;
  font-size: 16px;
`

export const DayNumber = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.9em;
  font-weight: bold;
`

export const Event = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
`

export const InputCustom = styled.input`
  height: 50px;
  padding: 5px 10px;
  font-size: 16px;
`

export const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const CloseButton = styled(Button)`
  margin-left: auto;
  margin-top: 10px;
  background-color: #46b346;
  &:hover {
    background-color: #3fa139;
  }
`

export const SelectClass = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`

export const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  resize: none;
  height: 100px;
  margin-bottom: 20px;
`

export const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

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
