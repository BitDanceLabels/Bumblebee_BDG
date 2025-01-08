import React, { useState, useRef } from 'react'
import { generateCalendar } from './Calender'
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
  ViewTicketButton,
  TeacherSelect
} from './TimeTableStyle'
import DetailsSession from '../modal/DetailsSessionModal'
import TicketModal from '../modal/TicketModal'
import ViewTicketModal from '../modal/ViewTicketModal'

const TeacherTimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTeacher, setSelectedTeacher] = useState('') // State for selected teacher
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullModalOpen, setIsFullModalOpen] = useState(false)
  const [currentEvents, setCurrentEvents] = useState([])
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [isViewTicketModalOpen, setIsViewTicketModalOpen] = useState(false)
  const cellRef = useRef(null)

  // Sample list of teachers (could be fetched from API)
  const teachers = [
    { id: 1, name: 'Teacher A' },
    { id: 2, name: 'Teacher B' },
    { id: 3, name: 'Teacher C' }
  ]

  const getCurrentMonth = () => {
    const year = selectedDate.getFullYear()
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
    return `${year}-${month}`
  }

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-')
    setSelectedDate(new Date(year, month - 1, 1))
  }

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value) // Update selected teacher
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

  const openViewTicketModal = () => {
    setIsViewTicketModalOpen(true)
  }

  const closeViewTicketModal = () => {
    setIsViewTicketModalOpen(false)
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
          <TeacherSelect value={selectedTeacher} onChange={handleTeacherChange}>
            <option value="" disabled>
              Select a Teacher
            </option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
          </TeacherSelect>
        </div>
        <ButtonWrapper>
          <ExcelButton>Export Time Table (Excel)</ExcelButton>
          <TicketButton onClick={openFullModal}>Ticket</TicketButton>
          <ViewTicketButton onClick={openViewTicketModal}>
            View Ticket
          </ViewTicketButton>
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

      {/* Modal View Ticket */}
      <ViewTicketModal
        show={isViewTicketModalOpen}
        events={events}
        onClose={closeViewTicketModal}
      />
    </Container>
  )
}

export default TeacherTimeTable
