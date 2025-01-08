import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { BsDot, BsTrash } from 'react-icons/bs'

// Styled components
// (keep all the styled components the same as before)

const DeleteIcon = styled(BsTrash)`
  cursor: pointer;
  color: red;
  margin-left: 10px;

  &:hover {
    opacity: 0.6;
  }
`

// Ticket data sample
const sampleTickets = [
  { id: 1, class: 'A10965', time: '08:00', status: 'Defer' },
  { id: 2, class: 'A14776', time: '18:10', status: 'Cancel' },
  { id: 3, class: 'B77095', time: '09:00', status: 'Defer' }
]

const TeacherTimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullModalOpen, setIsFullModalOpen] = useState(false)
  const [isViewTicketsOpen, setIsViewTicketsOpen] = useState(false) // View Tickets modal state
  const [currentEvents, setCurrentEvents] = useState([])
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [tickets, setTickets] = useState(sampleTickets) // Manage tickets
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

  const openViewTicketsModal = () => {
    setIsViewTicketsOpen(true)
  }

  const closeViewTicketsModal = () => {
    setIsViewTicketsOpen(false)
  }

  const deleteTicket = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id))
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
          <TicketButton onClick={openFullModal}>Ticket</TicketButton>{' '}
          {/* Nút mở modal */}
          <Button onClick={openViewTicketsModal}>View Tickets</Button>{' '}
          {/* View tickets button */}
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
        <MiniModal position={modalPosition}>
          {currentEvents.map((event, index) => (
            <div key={index}>
              <BsDot fontSize={16} color="blue" />
              {event}
            </div>
          ))}
          <CloseButton onClick={closeModal}>Close</CloseButton>
        </MiniModal>
      )}

      {/* Full screen modal */}
      <FullModalOverlay show={isFullModalOpen}>
        <FullModal>
          <ModalContent>
            {/* Combobox chọn lớp và thời gian */}
            <SelectClass>
              {Object.keys(events).map((day) =>
                events[day].map((event, index) => (
                  <option key={`${day}-${index}`} value={`${day} - ${event}`}>
                    {`Day ${day}: ${event}`}
                  </option>
                ))
              )}
            </SelectClass>

            {/* Combobox chọn trạng thái */}
            <SelectClass>
              <option value="defer">Defer</option>
              <option value="cancel">Cancel</option>
            </SelectClass>

            {/* Textarea nhập lý do */}
            <TextArea placeholder="Enter your reason" />

            <ModalButtonWrapper>
              <CancelButton onClick={closeFullModal}>Cancel</CancelButton>
              <SubmitButton>Submit</SubmitButton>
            </ModalButtonWrapper>
          </ModalContent>
        </FullModal>
      </FullModalOverlay>

      {/* View tickets modal */}
      <FullModalOverlay show={isViewTicketsOpen}>
        <FullModal>
          <ModalContent>
            <h3>Tickets List</h3>
            {tickets.map((ticket) => (
              <div key={ticket.id}>
                {`${ticket.time} - ${ticket.class} (${ticket.status})`}
                <DeleteIcon onClick={() => deleteTicket(ticket.id)} />
              </div>
            ))}
            <ModalButtonWrapper>
              <SubmitButton onClick={closeViewTicketsModal}>Close</SubmitButton>
            </ModalButtonWrapper>
          </ModalContent>
        </FullModal>
      </FullModalOverlay>
    </Container>
  )
}

export default TeacherTimeTable
