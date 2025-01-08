import { FaCalendarAlt } from 'react-icons/fa'
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

const WrapperAll = styled.div`
  width: 100%;
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
`;

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

const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSessions, setTotalSessions] = useState(0)
  const [redLinePosition, setRedLinePosition] = useState(null)
  const tableContainerRef = useRef(null)

  // Sử dụng useNavigate để điều hướng đến các router khác
  const navigate = useNavigate();

  // Hàm xử lý khi nhấn vào nút "View Classes Monthly"
  const handleViewClassesClick = () => {
    navigate('/class-schedule'); // Điều hướng đến router /class-schedule
  };

  useEffect(() => {
    // Hàm cập nhật vị trí của thanh đỏ theo thời gian hiện tại
    const updateRedLinePosition = () => {
      const positionPercent = calculateCurrentTimePosition()
      if (positionPercent !== null) {
        const tableWidth = tableContainerRef.current.scrollWidth
        const redLinePosition = (positionPercent / 100) * tableWidth
        setRedLinePosition(redLinePosition)

        // Cuộn bảng đến vị trí của thanh đỏ
        tableContainerRef.current.scrollLeft =
          redLinePosition - tableContainerRef.current.clientWidth / 2
      }
    }

    // Gọi hàm khi component mount
    updateRedLinePosition()

    // Cập nhật mỗi 1 phút
    const intervalId = setInterval(updateRedLinePosition, 60000)

    // Clear interval khi component unmount
    return () => clearInterval(intervalId)
  }, [selectedDate])

  useEffect(() => {
    // Hàm tính tổng số buổi học
    const calculateTotalSessions = () => {
      let count = 0
      teachers.forEach((teacher) => {
        count += Object.keys(teacher.schedule).length
      })
      setTotalSessions(count)
    }

    calculateTotalSessions()
  }, [selectedDate])

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

          {/* Nút điều hướng đến router /class-schedule */}
          <ViewButton onClick={handleViewClassesClick}>
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

        {/* Hiển thị tổng số buổi học */}
        <TotalSessions>
          <FaCalendarAlt /> {/* Icon lịch */}
          <TextRed>Total Sessions: {totalSessions}</TextRed>
        </TotalSessions>

        {/* Schedule Table */}
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
              {teachers.map((teacher) => (
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
