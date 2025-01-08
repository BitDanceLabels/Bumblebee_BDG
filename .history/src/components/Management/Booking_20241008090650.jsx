import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ClassBookingModal from '../modal/ClassBookingModal'
import ClassUpdateBookingModal from '../modal/ClassUpdateBookingModal'

// Các styled components như đã khai báo trước
const WrapperAll = styled.div`
  width: 100%;
`

const TableContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 500px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ddd;
  position: relative;
  font-size: 14px;
`

const RedLine = styled.div`
  position: absolute;
  top: 0;
  height: 300%;
  width: 1.2px;
  background-color: red;
  z-index: 1000;
  transition: left 1s linear;
`

const Table = styled.table`
  width: 5000px;
  border-collapse: collapse;
  table-layout: fixed;
`

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

const StickyTableHeader = styled(TableHeader)`
  left: 0;
  z-index: 3;
  background: white;
`

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

const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
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

const calculateColSpan = (duration) => {
  const timeslotDuration = 30
  return duration / timeslotDuration
}

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
  const [selectedClassInfo, setSelectedClassInfo] = useState(null) // Thêm state này
  const [isBookingPossible, setIsBookingPossible] = useState(false)
  const tableContainerRef = useRef(null)
  const [classes, setClasses] = useState([])
  const [teachers] = useState([
    {
      name: 'Giáo viên A',
      availableTimes: ['7-9', '13-16', '20-21'],
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
      availableTimes: ['9-12', '14-17'],
      schedule: {
        '09:00': {
          code: 'C10245',
          teacher: 'Nguyễn Văn B',
          duration: 30,
          type: 2
        }
      }
    }
  ])

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
      setSelectedClassInfo(classInfo) // Lưu thông tin lớp học
      setModalContent('ClassUpdateBookingModal') // Hiển thị modal cập nhật
      setIsModalOpen(true) // Mở modal
    } else if (isAvailable) {
      setClasses([
        { code: 'L101', name: 'Toán nâng cao', student: 'Nguyễn Văn A' },
        { code: 'L102', name: 'Lý cơ bản', student: 'Trần Thị B' },
        { code: 'L103', name: 'Hóa học', student: 'Lê Văn C' }
      ])
      setModalContent('ClassBookingModal')
      setIsModalOpen(true)
    } else {
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

  return (
    <>
      <ClassBookingModal
        show={isModalOpen && modalContent === 'ClassBookingModal'}
        onClose={closeModal}
        onSubmit={submitBooking}
        classes={classes}
      />
      <ClassUpdateBookingModal
        show={isModalOpen && modalContent === 'ClassUpdateBookingModal'}
        onClose={closeModal}
        onSubmit={submitBooking}
        classInfo={selectedClassInfo} // Truyền thông tin lớp học vào modal
        teachers={teachers} // Truyền danh sách giáo viên vào modal
      />
      <WrapperAll>
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
                  {timeslots.map((time) => {
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
