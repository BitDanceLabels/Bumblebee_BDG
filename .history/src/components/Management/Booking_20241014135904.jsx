import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ClassBookingModal from '../modal/ClassBookingModal'
import ClassUpdateBookingModal from '../modal/ClassUpdateBookingModal'
import { cm_teachers } from '../../shared/data'

const WrapperAll = styled.div`
  width: 100%;
`

// Styled component cho Table container
const TableContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ddd;
  position: relative;
  font-size: 14px;
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
  cursor: pointer;
`

// Styled component cho modal
const Modal = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  padding: 36px;
  text-align: center;
`

// Styled component cho nội dung chữ trong modal
const ModalText = styled.p`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`

// Styled component cho button trong modal
const ModalButton = styled.button`
  background-color: ${(props) => (props.primary ? '#4CAF50' : '#f44336')};
  color: white;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${(props) => (props.primary ? '#45a049' : '#d32f2f')};
  }
`

// Styled component cho overlay modal
const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Căn phải các button
  gap: 10px; // Khoảng cách giữa các button
  margin-top: 20px;
`
// Styled components cho container và các ngày trong tuần
const WeekContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  margin-bottom: 20px;
  background: #f4f7fb;
  border-bottom: 2px solid #ddd;
`

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: ${(props) => (props.isSelected ? '#fff' : '#666')};
  background-color: ${(props) =>
    props.isSelected ? '#1e90ff' : 'transparent'};
  padding: ${(props) => (props.isSelected ? '10px' : '0')};
  border-radius: ${(props) => (props.isSelected ? '10px' : '0')};
  position: relative;
  font-weight: ${(props) => (props.isToday ? 'bold' : 'normal')};
  cursor: pointer;
`

const DateLabel = styled.div`
  margin-top: 5px;
  font-size: 12px;
`

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #1e90ff;
  position: absolute;
  bottom: -10px;
`

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

const isTimeInRange = (time, range) => {
  const [start, end] = range.split('-').map(Number)
  const [hour] = time.split(':').map(Number)
  return hour >= start && hour < end
}

// Hàm tính số cột dựa trên thời gian kéo dài lớp học
const calculateColSpan = (duration) => {
  const timeslotDuration = 30
  return duration / timeslotDuration
}

// Hàm tính toán vị trí của thanh dọc dựa trên thời gian hiện tại
const calculateCurrentTimePosition = () => {
  const currentTime = new Date()
  const currentHours = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  const currentTotalMinutes = currentHours * 60 + currentMinutes

  const startTime = 7 * 60 // 07:00
  const endTime = 23 * 60 + 30 // 23:30

  if (currentTotalMinutes < startTime || currentTotalMinutes > endTime) {
    return null
  }

  const totalTableMinutes = endTime - startTime
  const timePassedMinutes = currentTotalMinutes - startTime
  const positionPercent = ((timePassedMinutes + 10) / totalTableMinutes) * 100

  return positionPercent
}

const Booking = () => {
  const [redLinePosition, setRedLinePosition] = useState(null)
  const [modalContent, setModalContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBookingPossible, setIsBookingPossible] = useState(false)
  const tableContainerRef = useRef(null)
  const [classes, setClasses] = useState([])
  const [classInfo, setClassInfo] = useState(null) // Initialize classInfo state

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
  }, [])

  const handleCellClick = (classInfo, isAvailable) => {
    if (classInfo) {
      // Hiển thị modal cập nhật lớp học nếu ô là màu xanh (đã có lớp học)
      setModalContent('ClassUpdateBookingModal')
      setClassInfo(classInfo)
      setIsModalOpen(true)
    } else if (isAvailable) {
      // Hiển thị modal đăng ký lớp học nếu giáo viên rảnh (màu nâu)
      setClasses([
        { code: 'L101', name: 'Toán nâng cao', student: 'Nguyễn Văn A' },
        { code: 'L102', name: 'Lý cơ bản', student: 'Trần Thị B' },
        { code: 'L103', name: 'Hóa học', student: 'Lê Văn C' }
      ])
      setModalContent('ClassBookingModal')
      setIsModalOpen(true)
    } else {
      // Hiển thị modal thông báo không dạy được giờ này (màu trắng)
      setModalContent('Giờ này giáo viên không dạy được')
      setIsBookingPossible(false)
      setIsModalOpen(true)
    }
  }

  const submitBooking = () => {
    alert('Đã đăng ký lớp thành công')
    setIsModalOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const confirmBooking = () => {
    alert('Lớp học đã được book thành công!')
    setIsModalOpen(false)
  }

  const [selectedDay, setSelectedDay] = useState(getToday())
  const [days, setDays] = useState([])

  useEffect(() => {
    const daysList = generateDays()
    setDays(daysList)
  }, [])

  // Hàm lấy ngày hiện tại dưới dạng đối tượng { day, date }
  function getToday() {
    const today = new Date()
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const day = dayNames[today.getDay()]
    const date = today.toLocaleDateString('en-GB')
    return { day, date }
  }

  // Hàm tính toán lấy 3 ngày trước và 7 ngày sau hôm nay
  function generateDays() {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const result = []

    const today = new Date()

    // Lấy 3 ngày trước hôm nay
    for (let i = -3; i <= 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const day = dayNames[currentDate.getDay()]
      const date = currentDate.toLocaleDateString('en-GB') // Định dạng dd/MM

      result.push({
        day,
        date,
        isToday: i === 0 // Đánh dấu ngày hôm nay
      })
    }

    return result
  }

  const handleDayClick = (day) => {
    setSelectedDay(day)
  }

  return (
    <>
      {/* ClassBookingModal */}
      {modalContent === 'ClassBookingModal' && (
        <ClassBookingModal
          show={isModalOpen}
          onClose={closeModal}
          onSubmit={submitBooking}
          classes={classes}
        />
      )}

      {modalContent === 'ClassUpdateBookingModal' && (
        <ClassUpdateBookingModal
          show={isModalOpen}
          onClose={closeModal}
          onSubmit={confirmBooking} // Hàm này xử lý khi submit form trong modal
          classInfo={classInfo} // Truyền thông tin lớp học
          teachers={cm_teachers} // Truyền danh sách giáo viên
        />
      )}

      {/* Thông báo không thể dạy giờ này */}
      {modalContent === 'Giờ này giáo viên không dạy được' && (
        <Modal show={isModalOpen}>
          <ModalText>{modalContent}</ModalText>
          <ButtonContainer>
            <ModalButton onClick={closeModal}>Đóng</ModalButton>
          </ButtonContainer>
        </Modal>
      )}

      <WrapperAll>
        <TableContainer ref={tableContainerRef}>
          {redLinePosition !== null && (
            <RedLine
              style={{
                left: `${redLinePosition}px`,
                height: `${tableHeight}px`
              }}
            />
          )}
          <Table>
            <thead>
              <tr>
                <StickyTableHeader>Teacher</StickyTableHeader>
                {timeslots.map((time) => (
                  <TableHeader key={time}>{time}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {cm_teachers.map((teacher) => (
                <tr key={teacher.name}>
                  <StickyTableCell>{teacher.name}</StickyTableCell>
                  {timeslots.map((time, index) => {
                    const classInfo = teacher.schedule[time]
                    const isAvailable = teacher.availableTimes.some((range) =>
                      isTimeInRange(time, range)
                    )

                    if (classInfo) {
                      const colSpan = calculateColSpan(classInfo.duration)
                      return (
                        <TableCell
                          key={time}
                          colSpan={Math.ceil(colSpan)}
                          style={{ backgroundColor: 'green' }} // Màu xanh cho lớp học
                          onClick={() =>
                            handleCellClick(classInfo, isAvailable)
                          }
                        ></TableCell>
                      )
                    } else if (isAvailable) {
                      return (
                        <TableCell
                          key={time}
                          style={{ backgroundColor: '#8b4513' }} // Màu nâu cho giờ rảnh
                          onClick={() => handleCellClick(null, isAvailable)}
                        />
                      )
                    } else {
                      return (
                        <TableCell
                          key={time}
                          style={{ backgroundColor: 'white' }} // Màu trắng
                          onClick={() => handleCellClick(null, isAvailable)}
                        />
                      )
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
export default Booking
