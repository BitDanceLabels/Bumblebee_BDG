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

const teachers = [
  {
    name: 'Giáo viên A',
    schedule: {
      '08:00': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên B',
    schedule: {
      '09:00': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 2
      }
    }
  },
  {
    name: 'Giáo viên C',
    schedule: {
      '07:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 3 },
      '11:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 3 }
    }
  },
  {
    name: 'Giáo viên D',
    schedule: {
      '08:00': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 4
      }
    }
  },
  {
    name: 'Giáo viên E',
    schedule: {
      '09:30': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 5
      }
    }
  },
  {
    name: 'Giáo viên F',
    schedule: {
      '10:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 2 }
    }
  },
  {
    name: 'Giáo viên G',
    schedule: {
      '08:30': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên H',
    schedule: {
      '10:00': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 3
      }
    }
  },
  {
    name: 'Giáo viên J',
    schedule: {
      '07:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 4 }
    }
  }
]

const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSessions, setTotalSessions] = useState(0)
  const [redLinePosition, setRedLinePosition] = useState(null)
  const [searchTermTeacher, setSearchTermTeacher] = useState('')
  const [searchTermStudent, setSearchTermStudent] = useState('')
  const [searchTermClass, setSearchTermClass] = useState('')
  const [searchTime, setSearchTime] = useState('')
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  const timeslots = generateTimeslots(7, 23, 30)

  const handleViewClassesClick = () => {
    navigate('/class-schedule')
  }

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
    const calculateTotalSessions = () => {
      let count = 0
      teachers.forEach((teacher) => {
        count += Object.keys(teacher.schedule).length
      })
      setTotalSessions(count)
    }

    calculateTotalSessions()
  }, [selectedDate])

  const filteredTeachers = teachers.filter((teacher) => {
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
    setSuggestionsVisible(true)
  }

  const handleSearchChangeStudent = (e) => {
    setSearchTermStudent(e.target.value)
  }

  const handleSearchChangeClass = (e) => {
    setSearchTermClass(e.target.value)
  }

  const handleSearchChangeTime = (e) => {
    setSearchTime(e.target.value)
  }

  const handleSuggestionClick = (teacherName) => {
    setSearchTermTeacher(teacherName)
    setSuggestionsVisible(false)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestionsVisible(false)
    }, 200)
  }

  return (
    <WrapperAll>
      <HeaderWrapper>
        <CustomDatePickerWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EEEE, dd/MM/yyyy"
            className="date-picker"
          />
        </CustomDatePickerWrapper>

        <ViewButton onClick={handleViewClassesClick}>
          View Classes Monthly
        </ViewButton>

        <div>
          <StatusLabel color="#6b8e23">Trial</StatusLabel>
          <StatusLabel color="#1e90ff">Regular</StatusLabel>
          <StatusLabel color="#ffd700">Bonus</StatusLabel>
          <StatusLabel color="#ff4500">Deferred</StatusLabel>
          <StatusLabel color="#dc143c">Cancelled</StatusLabel>
        </div>
      </HeaderWrapper>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
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

          {suggestionsVisible && searchTermTeacher && (
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
                  onClick={() => handleSuggestionClick(teacher.name)}
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

        <input
          type="text"
          placeholder="Search student..."
          value={searchTermStudent}
          onChange={handleSearchChangeStudent}
          style={{
            padding: '10px',
            width: '200px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />

        <input
          type="text"
          placeholder="Search class..."
          value={searchTermClass}
          onChange={handleSearchChangeClass}
          style={{
            padding: '10px',
            width: '200px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />

        <input
          type="text"
          placeholder="Search time (e.g., 08:00)"
          value={searchTime}
          onChange={handleSearchChangeTime}
          style={{
            padding: '10px',
            width: '200px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
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
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.name}>
                <StickyTableCell>{teacher.name}</StickyTableCell>
                {timeslots.map((time, index) => {
                  const classInfo = teacher.schedule[time]
                  if (classInfo) {
                    const colSpan = calculateColSpan(classInfo.duration)
                    const colSpanFraction = colSpan / Math.ceil(colSpan)
                    return (
                      <TableCell key={time} colSpan={Math.ceil(colSpan)}>
                        <ClassInfo
                          colSpanFraction={colSpanFraction}
                          color={getClassColor(classInfo.type)}
                        >
                          <div>{classInfo.code}</div>
                          <div>{classInfo.teacher}</div>
                        </ClassInfo>
                      </TableCell>
                    )
                  } else {
                    return index === 0 ||
                      !teacher.schedule[timeslots[index - 1]] ? (
                      <TableCell key={time} />
                    ) : null
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
