import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {
  WrapperAll,
  TableContainer,
  RedLine,
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

import { db_teachers } from '../../shared/data'

const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSessions, setTotalSessions] = useState(0)
  const [redLinePosition, setRedLinePosition] = useState(null)
  const [tableHeight, setTableHeight] = useState(0)
  const [searchTermTeacher, setSearchTermTeacher] = useState('')
  const [searchTermStudent, setSearchTermStudent] = useState('')
  const [searchTermClass, setSearchTermClass] = useState('')
  const [searchTime, setSearchTime] = useState('')
  const [classInfoPositions, setClassInfoPositions] = useState([]) // Store positions for ClassInfo
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  const timeslots = generateTimeslots(7, 23, 30)

  const handleViewClassesClick = () => {
    navigate('/class-schedule')
  }

  useEffect(() => {
    const updateTableHeight = () => {
      if (tableContainerRef.current) {
        setTableHeight(tableContainerRef.current.scrollHeight)
      }
    }

    updateTableHeight()

    window.addEventListener('resize', updateTableHeight)

    return () => {
      window.removeEventListener('resize', updateTableHeight)
    }
  }, [])

  useEffect(() => {
    const updateRedLinePosition = () => {
      const positionPercent = calculateCurrentTimePosition()
      if (positionPercent !== null) {
        const tableWidth = tableContainerRef.current.scrollWidth
        const redLinePosition = (positionPercent / 100) * tableWidth
        setRedLinePosition(redLinePosition)
      }
    }

    updateRedLinePosition()
    const intervalId = setInterval(updateRedLinePosition, 60000)

    return () => clearInterval(intervalId)
  }, [selectedDate])

  useEffect(() => {
    const calculateTotalSessions = () => {
      let count = 0
      db_teachers.forEach((teacher) => {
        count += Object.keys(teacher.schedule).length
      })
      setTotalSessions(count)
    }

    calculateTotalSessions()
  }, [selectedDate])

  // Calculate positions for ClassInfo
  useEffect(() => {
    const positions = []

    db_teachers.forEach((teacher, teacherIndex) => {
      Object.keys(teacher.schedule).forEach((time) => {
        const classInfo = teacher.schedule[time]
        if (classInfo) {
          const startTimeIndex = timeslots.indexOf(time)
          const durationInSlots = calculateColSpan(classInfo.duration)
          const left = (startTimeIndex / timeslots.length) * 100
          const width = (durationInSlots / timeslots.length) * 100
          const top = teacherIndex * 50 // Assuming each row has a height of 50px

          positions.push({
            left: `${left}%`,
            width: `${width}%`,
            top: `${top}px`,
            code: classInfo.code,
            teacher: classInfo.teacher,
            color: getClassColor(classInfo.type)
          })
        }
      })
    })

    setClassInfoPositions(positions)
  }, [db_teachers, timeslots])

  return (
    <WrapperAll>
      <HeaderWrapper>
        <CustomDatePickerWrapper
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EEEE, dd/MM/yyyy"
            className="date-picker"
          />
          <ViewButton onClick={handleViewClassesClick}>
            View Classes Monthly
          </ViewButton>
        </CustomDatePickerWrapper>

        <div>
          <StatusLabel color="#6b8e23">Trial</StatusLabel>
          <StatusLabel color="#1e90ff">Regular</StatusLabel>
          <StatusLabel color="#ffd700">Bonus</StatusLabel>
          <StatusLabel color="#ff4500">Deferred</StatusLabel>
          <StatusLabel color="#dc143c">Cancelled</StatusLabel>
        </div>
      </HeaderWrapper>

      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}
      >
        <FaCalendarAlt />{' '}
        <span style={{ color: 'red' }}>Total Sessions: {totalSessions}</span>
      </div>

      <TableContainer ref={tableContainerRef}>
        {redLinePosition !== null && (
          <RedLine
            style={{ left: `${redLinePosition}px`, height: `${tableHeight}px` }}
          />
        )}
        {classInfoPositions.map((classPos, index) => (
          <ClassInfo
            key={index}
            style={{
              position: 'absolute',
              left: classPos.left,
              width: classPos.width,
              top: classPos.top,
              backgroundColor: classPos.color
            }}
          >
            <div>{classPos.code}</div>
            <div>{classPos.teacher}</div>
          </ClassInfo>
        ))}
      </TableContainer>
    </WrapperAll>
  )
}

export default ScheduleComponent
