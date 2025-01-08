import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {
  WrapperAll,
  TableContainer,
  RedLine,
  Table,
  StickyTableHeader,
  StickyTableCell,
  TableCell,
  ClassInfo,
  StatusLabel,
  HeaderWrapper,
  CustomDatePickerWrapper,
  ViewButton
} from './ScheduleStyle'
import {
  generateTimeslots,
  calculateColSpan,
  calculateCurrentTimePosition,
  getClassColor
} from '../../shared/functions'

const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSessions, setTotalSessions] = useState(0)
  const [redLinePosition, setRedLinePosition] = useState(null)
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  const timeslots = generateTimeslots(7, 23, 30)

  // Other logic and states...

  useEffect(() => {
    const updateRedLinePosition = () => {
      const positionPercent = calculateCurrentTimePosition()
      if (positionPercent !== null) {
        const tableWidth = tableContainerRef.current.scrollWidth
        const redLinePosition = (positionPercent / 100) * tableWidth
        setRedLinePosition(redLinePosition)
        tableContainerRef.current.scrollLeft =
          redLinePosition - tableContainerRef.current.clientWidth / 2
      }
    }

    updateRedLinePosition()
    const intervalId = setInterval(updateRedLinePosition, 60000)

    return () => clearInterval(intervalId)
  }, [selectedDate])

  useEffect(() => {
    // Logic to calculate total sessions
  }, [selectedDate])

  return (
    <WrapperAll>
      {/* Header and Date Picker */}
      <HeaderWrapper>
        <CustomDatePickerWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EEEE, dd/MM/yyyy"
            className="date-picker"
          />
        </CustomDatePickerWrapper>
        <ViewButton onClick={() => navigate('/class-schedule')}>
          View Classes Monthly
        </ViewButton>
        <div>
          {/* Status Labels */}
          <StatusLabel color="#6b8e23">Trial</StatusLabel>
          <StatusLabel color="#1e90ff">Regular</StatusLabel>
          <StatusLabel color="#ffd700">Bonus</StatusLabel>
          <StatusLabel color="#ff4500">Deferred</StatusLabel>
          <StatusLabel color="#dc143c">Cancelled</StatusLabel>
        </div>
      </HeaderWrapper>

      {/* Table */}
      <TableContainer ref={tableContainerRef}>
        {redLinePosition !== null && (
          <RedLine style={{ left: redLinePosition + 'px' }} />
        )}
        <Table>
          <thead>
            <tr>
              <StickyTableHeader>Giáo viên</StickyTableHeader>
              {timeslots.map((time) => (
                <StickyTableHeader key={time}>{time}</StickyTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>{/* Map teacher data here */}</tbody>
        </Table>
      </TableContainer>
    </WrapperAll>
  )
}

export default ScheduleComponent
