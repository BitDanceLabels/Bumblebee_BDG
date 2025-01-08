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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Teacher Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search teacher..."
            value={searchTermTeacher}
            onChange={handleSearchChangeTeacher}
            onBlur={handleBlur}
            style={{
              padding: '10px',
              width: '200px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />

          {/* Teacher Suggestions */}
          {suggestionsVisibleTeacher && searchTermTeacher && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                width: '200px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                zIndex: 10,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
            >
              {filteredTeachers.slice(0, 5).map((teacher) => (
                <div
                  key={teacher.name}
                  onClick={() => handleSuggestionClickTeacher(teacher.name)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ddd'
                  }}
                >
                  {teacher.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search student..."
            value={searchTermStudent}
            onChange={handleSearchChangeStudent}
            onBlur={handleBlur}
            style={{
              padding: '10px',
              width: '200px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />

          {/* Student Suggestions */}
          {suggestionsVisibleStudent && searchTermStudent && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                width: '200px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                zIndex: 10,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
            >
              {studentSuggestions.slice(0, 5).map((student) => (
                <div
                  key={student}
                  onClick={() => handleSuggestionClickStudent(student)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ddd'
                  }}
                >
                  {student}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Class Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search class..."
            value={searchTermClass}
            onChange={handleSearchChangeClass}
            onBlur={handleBlur}
            style={{
              padding: '10px',
              width: '200px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />

          {/* Class Suggestions */}
          {suggestionsVisibleClass && searchTermClass && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                width: '200px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                zIndex: 10,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
            >
              {classSuggestions.slice(0, 5).map((classCode) => (
                <div
                  key={classCode}
                  onClick={() => handleSuggestionClickClass(classCode)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ddd'
                  }}
                >
                  {classCode}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                {Object.entries(teacher.schedule).map(([time, info], index) => {
                  const [hours, minutes] = time.split(':').map(Number)
                  const totalMinutes = hours * 60 + minutes
                  const minutesSinceStart = totalMinutes - 420
                  const left = (minutesSinceStart / 30) * 100 - index * 100

                  return (
                    <td key={index}>
                      <ClassInfo
                        color={
                          info.type === 1
                            ? 'blue'
                            : info.type === 2
                            ? 'green'
                            : info.type === 3
                            ? 'orange'
                            : 'red'
                        }
                        width={`${(info.duration / 1020) * 5000}px`}
                        left={`${left}%`}
                      >
                        <div>{info.code}</div>
                        <div>{info.teacher}</div>
                        <div>{time}</div>
                      </ClassInfo>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>

          <tbody>
            {db_teachers.map((teacher) => (
              <tr key={teacher.name}>
                <StickyTableCell>{teacher.name}</StickyTableCell>
                {timeslots.map((time, index) => {
                  const classInfo = teacher.schedule[time]

                  if (classInfo) {
                    const colSpan = calculateColSpan(classInfo.duration)
                    return (
                      <TableCell
                        key={time}
                        colSpan={Math.ceil(colSpan)}
                      ></TableCell>
                    )
                  } else {
                    return <TableCell key={time} />
                  }
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </WrapperAll>
  )
}

export default ScheduleComponent
