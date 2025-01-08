import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import DetailClassInfo from '../modal/DetailClassInfo' // Import Modal component
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
  const [suggestionsVisibleTeacher, setSuggestionsVisibleTeacher] =
    useState(false)
  const [suggestionsVisibleStudent, setSuggestionsVisibleStudent] =
    useState(false)
  const [suggestionsVisibleClass, setSuggestionsVisibleClass] = useState(false)
  const [firstScroll, setFirstScroll] = useState(true) // Track first scroll
  const [modalOpen, setModalOpen] = useState(false) // Track modal open state
  const [selectedClassInfo, setSelectedClassInfo] = useState(null) // Track selected class info
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  const timeslots = generateTimeslots(6, 23, 30)

  const handleViewClassesClick = () => {
    navigate('/class-schedule')
  }

  const openModal = (classInfo) => {
    setSelectedClassInfo(classInfo)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
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

        if (firstScroll) {
          tableContainerRef.current.scrollLeft =
            redLinePosition - tableContainerRef.current.clientWidth / 2
          setFirstScroll(false)
        }
      }
    }

    updateRedLinePosition()
    const intervalId = setInterval(updateRedLinePosition, 60000)

    return () => clearInterval(intervalId)
  }, [selectedDate, firstScroll])

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

  const filteredTeachers = db_teachers.filter((teacher) => {
    return (
      teacher.name.toLowerCase().includes(searchTermTeacher.toLowerCase()) &&
      Object.keys(teacher.schedule).some((time) => {
        const classInfo = teacher.schedule[time]
        return (
          classInfo &&
          classInfo.teacher
            .toLowerCase()
            .includes(searchTermStudent.toLowerCase()) &&
          classInfo.code
            .toLowerCase()
            .includes(searchTermClass.toLowerCase()) &&
          time.includes(searchTime)
        )
      })
    )
  })

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
        <Table>
          <thead>
            <tr>
              <StickyTableHeader>Giáo viên</StickyTableHeader>
              {timeslots.map((time) => (
                <StickyTableHeader key={time}>{time}</StickyTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.name}>
                <StickyTableCell>{teacher.name}</StickyTableCell>
                {timeslots.map((time, index) => {
                  const [hours, minutes] = time.split(':').map(Number)
                  const slotTimeInMinutes = hours * 60 + minutes
                  const matchingClass = Object.keys(teacher.schedule).find(
                    (classTime) => {
                      const [classHours, classMinutes] = classTime
                        .split(':')
                        .map(Number)
                      const classTimeInMinutes = classHours * 60 + classMinutes

                      return (
                        Math.abs(classTimeInMinutes - slotTimeInMinutes) <= 29
                      )
                    }
                  )

                  if (matchingClass) {
                    const info = teacher.schedule[matchingClass]
                    const [hours, minutes] = matchingClass
                      .split(':')
                      .map(Number)
                    const totalMinutes = hours * 60 + minutes
                    const minutesSinceStart = totalMinutes - 360
                    const left = (minutesSinceStart / 30) * 100 - index * 100

                    return (
                      <td key={index}>
                        <ClassInfo
                          color={getClassColor(info.type)}
                          width={`${(info.duration / 1080) * 5000}px`}
                          left={`${left}%`}
                          onClick={() => openModal(info)} // Open modal on click
                        >
                          <div>{info.code}</div>
                          <div>{info.teacher}</div>
                          <div>{matchingClass}</div>
                        </ClassInfo>
                      </td>
                    )
                  } else {
                    return (
                      <TableCell
                        key={index}
                        style={{ border: '1px solid #ccc' }}
                      />
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* Modal for ClassInfo */}
      <DetailClassInfo
        isOpen={modalOpen}
        onClose={closeModal}
        classInfo={selectedClassInfo}
      />
    </WrapperAll>
  )
}

export default ScheduleComponent
