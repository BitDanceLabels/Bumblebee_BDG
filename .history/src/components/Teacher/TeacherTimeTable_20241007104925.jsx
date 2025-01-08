import React, { useState, useRef } from 'react'
import { BsDot } from 'react-icons/bs'
import { generateCalendar } from './share'
import {
  Container,
  Header,
  ButtonWrapper,
  ExcelButton,
  TicketButton,
  InputCustom,
  Month,
  CalendarTable,
  CalendarHeader
} from './StyledComponents'

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
        <tbody>
          {generateCalendar(selectedDate, events, openModal, cellRef)}
        </tbody>
      </CalendarTable>

      {/* Mini modal */}
      {/* Full screen modal */}
    </Container>
  )
}

export default TeacherTimeTable
