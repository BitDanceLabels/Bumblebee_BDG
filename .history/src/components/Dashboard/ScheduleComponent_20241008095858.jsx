import React, { useState, useEffect, useRef } from 'react'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const WrapperAll = styled.div`
  width: 100%;
`
const TimeRangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

const TimeLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 200px;
`
// Styled component cho Table container
const TableContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 500px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ddd;
  position: relative;
`

// Styled component cho thanh dọc màu đỏ
const RedLine = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 1.2px;
  background-color: red;
  z-index: 1000;
  transition: left 1s linear;
`

// Styled component cho Table
const Table = styled.table`
  width: 5000px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
`

// Styled component cho Table Header
const TableHeader = styled.th`
  height: 50px;
  position: sticky;
  top: 0;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  z-index: 1;
`

// Styled component cho Table Header cố định cột "Giáo viên"
const StickyTableHeader = styled(TableHeader)`
  left: 0;
  z-index: 3;
  background: white;
`

// Styled component cho cột "Giáo viên" cố định
const StickyTableCell = styled.td`
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  height: 50px;
`

// Styled component cho Table Cell
const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  padding: 10px 0px;
`

// Styled component cho lớp học
const ClassInfo = styled.div`
  background-color: ${(props) => getClassColor(props.type)};
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  width: ${(props) =>
    props.colSpanFraction ? `${props.colSpanFraction * 100}%` : '100%'};
  overflow: hidden;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
`

const StatusLabel = styled.div`
  display: inline-block;
  background-color: ${(props) => props.color || '#ddd'};
  color: white;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 15px;
  font-size: 14px;
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`

const CustomDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    z-index: 1000;
  }

  .react-datepicker-popper {
    z-index: 1001;
  }
  .date-picker {
    text-align: center;
    height: 40px;
    border-radius: 5px;
    letter-spacing: 1px;
    width: 200px;
  }

  .react-datepicker {
    font-size: 12px;
  }

  .react-datepicker__header {
    font-size: 12px;
  }

  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
`

const TotalSessions = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`

const TextRed = styled.span`
  color: red;
`
// Styled component cho Button
const ViewButton = styled.button`
  padding: 10px 20px;
  margin: 0 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`

// Khung giờ cho lớp học
const generateTimeslots = (startTime, endTime, step) => {
  const timeslots = []
  let currentHour = startTime
  let currentMinute = 0

  while (
    currentHour < endTime ||
    (currentHour === endTime && currentMinute === 0)
  ) {
    const hour = currentHour.toString().padStart(2, '0')
    const minute = currentMinute.toString().padStart(2, '0')
    timeslots.push(`${hour}:${minute}`)

    // Cộng thêm bước thời gian (step)
    currentMinute += step
    if (currentMinute >= 60) {
      currentMinute = 0
      currentHour++
    }
  }

  return timeslots
}

// Khung giờ cho lớp học
const timeslots = generateTimeslots(7, 23, 30)

// Dữ liệu lớp học (duration: thời gian kéo dài lớp học)
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

// Hàm tính số cột dựa trên thời gian kéo dài lớp học
const calculateColSpan = (duration) => {
  const timeslotDuration = 30
  return duration / timeslotDuration
}

// Hàm ánh xạ type thành màu sắc tương ứng
const getClassColor = (type) => {
  switch (type) {
    case 1:
      return '#6b8e23' // Trial
    case 2:
      return '#1e90ff' // Regular
    case 3:
      return '#ffd700' // Bonus
    case 4:
      return '#ff4500' // Deferred
    case 5:
      return '#dc143c' // Cancelled
    default:
      return '#ddd' // Default color
  }
}

// Hàm tính toán vị trí của thanh dọc dựa trên thời gian hiện tại
const calculateCurrentTimePosition = () => {
  const currentTime = new Date()
  const currentHours = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  const currentTotalMinutes = currentHours * 60 + currentMinutes

  // Lấy khung giờ bắt đầu và kết thúc
  const startTime = 7 * 60 // 07:00
  const endTime = 23 * 60 + 30 // 23:30

  // Nếu thời gian hiện tại nằm ngoài khung giờ của bảng thì trả về null
  if (currentTotalMinutes < startTime || currentTotalMinutes > endTime) {
    return null
  }

  // Tính phần trăm vị trí hiện tại so với toàn bộ khung thời gian
  const totalTableMinutes = endTime - startTime
  const timePassedMinutes = currentTotalMinutes - startTime
  const positionPercent = ((timePassedMinutes + 10) / totalTableMinutes) * 100

  return positionPercent
}

const TimeRangeComponent = ({ timeRange, setTimeRange }) => {
  // Hàm để chuyển đổi giá trị số thành khung giờ định dạng HH:MM
  const formatTime = (value) => {
    const hours = Math.floor(value)
    const minutes = (value % 1) * 60
    return `${hours.toString().padStart(2, '0')}:${
      minutes === 0 ? '00' : minutes
    }`
  }

  return (
    <TimeRangeWrapper>
      {/* Label hiển thị thời gian */}
      <TimeLabel>
        <span>{formatTime(timeRange[0])}</span>
        <span>{formatTime(timeRange[1])}</span>
      </TimeLabel>

      {/* Range slider */}
      <Range
        min={0} // Tối thiểu 00:00
        max={24} // Tối đa 24:00
        step={0.5} // Bước nhảy mỗi 30 phút (0.5 giờ)
        defaultValue={timeRange}
        allowCross={false}
        onChange={(value) => setTimeRange(value)}
        trackStyle={[{ backgroundColor: 'blue', height: 5 }]}
        handleStyle={[
          { borderColor: 'blue', height: 20, width: 20 },
          { borderColor: 'blue', height: 20, width: 20 }
        ]}
      />
    </TimeRangeWrapper>
  )
}

const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSessions, setTotalSessions] = useState(0)
  const [redLinePosition, setRedLinePosition] = useState(null)
  const [searchTermTeacher, setSearchTermTeacher] = useState('') // State cho tìm kiếm giáo viên
  const [searchTermStudent, setSearchTermStudent] = useState('') // State cho tìm kiếm học viên
  const [searchTermClass, setSearchTermClass] = useState('') // State cho tìm kiếm tên lớp
  const [timeRange, setTimeRange] = useState([4, 24]) // State cho khung giờ tìm kiếm
  const [suggestionsVisible, setSuggestionsVisible] = useState(false) // Hiển thị gợi ý
  const tableContainerRef = useRef(null)
  const navigate = useNavigate()

  // Hàm xử lý khi nhấn vào nút "View Classes Monthly"
  const handleViewClassesClick = () => {
    navigate('/class-schedule') // Điều hướng đến router /class-schedule
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
    setSuggestionsVisible(true) // Hiển thị gợi ý khi nhập
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
    setSearchTermTeacher(teacherName) // Cập nhật thanh tìm kiếm với tên giáo viên đã chọn
    setSuggestionsVisible(false) // Ẩn gợi ý sau khi chọn
  }

  const handleBlur = () => {
    // Ẩn gợi ý khi thanh tìm kiếm mất focus
    setTimeout(() => {
      setSuggestionsVisible(false)
    }, 200)
  }

  return (
    <>
      {/* Date Selector and Status Labels */}
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

          <ViewButton onClick={() => navigate('/class-schedule')}>
            View Classes Monthly
          </ViewButton>

          <StatusContainer>
            <StatusLabel color="#6b8e23">Trial</StatusLabel>
            <StatusLabel color="#1e90ff">Regular</StatusLabel>
            <StatusLabel color="#ffd700">Bonus</StatusLabel>
            <StatusLabel color="#ff4500">Pending</StatusLabel>
            <StatusLabel color="#dc143c">Cancelled</StatusLabel>
          </StatusContainer>
        </HeaderWrapper>

        {/* Search input cho tìm kiếm */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search teacher..."
              value={searchTermTeacher}
              onChange={handleSearchChangeTeacher}
              onBlur={handleBlur} // Ẩn gợi ý khi mất focus
              style={{
                padding: '10px',
                width: '200px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />

            {/* Danh sách gợi ý */}
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
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
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

          {/* Tìm kiếm theo tên học viên */}
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

          {/* Tìm kiếm theo tên lớp */}
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

          {/* Tìm kiếm theo khung giờ */}
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

        <TotalSessions>
          <FaCalendarAlt /> <TextRed>Total Sessions: {totalSessions}</TextRed>
        </TotalSessions>

        <TableContainer ref={tableContainerRef}>
          {redLinePosition !== null && (
            <RedLine style={{ left: redLinePosition + 'px' }} />
          )}
          <Table>
            <thead>
              <tr>
                <StickyTableHeader>Giáo viên</StickyTableHeader>
                {timeslots.map((time) => (
                  <TableHeader key={time}>{time}</TableHeader>
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
                            type={classInfo.type}
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
    </>
  )
}

export default ScheduleComponent
