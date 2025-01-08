import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
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
  const [firstScroll, setFirstScroll] = useState(true) // New state to track first scroll
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [student, setStudent] = useState('')
  const [teacher, setTeacher] = useState('')

  const timeslots = generateTimeslots(6, 23, 30)

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

  const handleSearchChangeTeacher = (e) => {
    setSearchTermTeacher(e.target.value)
    setSuggestionsVisibleTeacher(true)
  }

  const handleSearchChangeStudent = (e) => {
    setSearchTermStudent(e.target.value)
    setSuggestionsVisibleStudent(true)
  }

  const handleSearchChangeClass = (e) => {
    setSearchTermClass(e.target.value)
    setSuggestionsVisibleClass(true)
  }

  const handleSearchChangeTime = (e) => {
    setSearchTime(e.target.value)
  }

  const handleSuggestionClickTeacher = (teacherName) => {
    setSearchTermTeacher(teacherName)
    setSuggestionsVisibleTeacher(false)
  }

  const handleSuggestionClickStudent = (studentName) => {
    setSearchTermStudent(studentName)
    setSuggestionsVisibleStudent(false)
  }

  const handleSuggestionClickClass = (className) => {
    setSearchTermClass(className)
    setSuggestionsVisibleClass(false)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestionsVisibleTeacher(false)
      setSuggestionsVisibleStudent(false)
      setSuggestionsVisibleClass(false)
    }, 200)
  }

  const getFilteredSuggestions = (term, key) => {
    const suggestions = []
    db_teachers.forEach((teacher) => {
      Object.keys(teacher.schedule).forEach((time) => {
        const classInfo = teacher.schedule[time]
        if (
          classInfo &&
          classInfo[key].toLowerCase().includes(term.toLowerCase())
        ) {
          suggestions.push(classInfo[key])
        }
      })
    })
    return [...new Set(suggestions)]
  }

  const studentSuggestions = getFilteredSuggestions(
    searchTermStudent,
    'teacher'
  )
  const classSuggestions = getFilteredSuggestions(searchTermClass, 'code')

  const openModal = (classInfo) => {
    setSelectedClass(classInfo)
    setStartTime(classInfo.startTime)
    setStudent(classInfo.student)
    setTeacher(classInfo.teacher)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleEdit = () => {
    // Tính lại thời gian kết thúc dựa trên thời gian bắt đầu và duration
    const endTime = calculateEndTime(startTime, selectedClass.duration)

    const updatedClass = {
      ...selectedClass,
      startTime,
      endTime,
      student,
      teacher
    }

    // Cập nhật class (trong state hoặc gọi API)

    closeModal()
  }

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startInMinutes = hours * 60 + minutes
    const endInMinutes = startInMinutes + duration
    const endHours = Math.floor(endInMinutes / 60)
    const endMinutes = endInMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes
      .toString()
      .padStart(2, '0')}`
  }

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
                  const classInfo = teacher.schedule[time]
                  if (classInfo) {
                    return (
                      <td key={index}>
                        <ClassInfo
                          color={getClassColor(classInfo)}
                          onClick={() => openModal(classInfo)}
                        >
                          <div>{classInfo.code}</div>
                          <div>{classInfo.teacher}</div>
                          <div>{time}</div>
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

      {selectedClass && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Class Info Modal"
        >
          <h2>Class Information</h2>
          <p>Class Code: {selectedClass.code}</p>
          <p>Teacher: {selectedClass.teacher}</p>
          <p>Student: {selectedClass.student}</p>
          <p>Start Time: {selectedClass.startTime}</p>
          <p>
            End Time:{' '}
            {calculateEndTime(selectedClass.startTime, selectedClass.duration)}
          </p>
          <p>Duration: {selectedClass.duration} minutes</p>

          <h3>Edit Class</h3>
          <label>
            Student:
            <input
              type="text"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />
          </label>
          <label>
            Start Time:
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            Teacher:
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </label>

          <button onClick={handleEdit}>Save</button>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </WrapperAll>
  )
}

export default ScheduleComponent
