import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { BsDot } from 'react-icons/bs'

// Styled components
const Container = styled.div`
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const Button = styled.button`
  padding: 16px 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #46b346;
  }
`

const Month = styled.h3`
  text-align: center;
`

const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

const CalendarHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  text-align: center;
`

const CalendarCell = styled.td`
  vertical-align: center;
  border: 1px solid #ddd;
  position: relative;
  padding: 5px;
  width: 150px; // Set fixed width
  height: 180px;
  font-size: 16px;
`

const DayNumber = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.9em;
  font-weight: bold;
`

const Event = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
`

const InputCustom = styled.input`
  height: 50px;
  padding: 5px 10px;
  font-size: 16px;
`

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

const MiniModal = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px 16px;
  z-index: 10;
  width: 200px; // Same width as CalendarCell
  top: ${({ position }) => position.top}px;
  left: ${({ position }) => position.left}px;
`

const CloseButton = styled.button`
  padding: 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
  margin-top: 10px;

  &:hover {
    background-color: #46b346;
  }
`

const SalaryInfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 40px 0;
`

const SalaryRow = styled.tr`
  border: 1px solid #ddd;
`

const SalaryCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`

const SalaryTitle = styled.h3`
  text-align: center;
  margin-top: 20px;
`

const Salary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
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

        <Button>Export Salary (Excel)</Button>
      </Header>

      <SalaryTitle>Tính lương giáo viên</SalaryTitle>
      <SalaryInfoTable>
        <tbody>
          <SalaryRow>
            <SalaryCell>Họ và tên giáo viên:</SalaryCell>
            <SalaryCell>___________</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Mã giáo viên:</SalaryCell>
            <SalaryCell>___________</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Bộ môn giảng dạy:</SalaryCell>
            <SalaryCell>___________</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Lương cơ bản:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Số giờ dạy trong tháng:</SalaryCell>
            <SalaryCell>___________ giờ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Số tiết dạy thêm (ngoài giờ):</SalaryCell>
            <SalaryCell>___________ giờ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Thưởng chuyên cần:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Thưởng thành tích:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Phụ cấp thâm niên:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Phụ cấp khác:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Trừ bảo hiểm xã hội:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Trừ bảo hiểm y tế:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Các khoản trừ khác:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
          <SalaryRow>
            <SalaryCell>Tổng lương:</SalaryCell>
            <SalaryCell>___________ VNĐ</SalaryCell>
          </SalaryRow>
        </tbody>
      </SalaryInfoTable>
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
    </Container>
  )
}

export default Salary
