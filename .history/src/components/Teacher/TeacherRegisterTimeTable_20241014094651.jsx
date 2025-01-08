import React, { useState } from 'react'
import styled from 'styled-components'

const WrapperAll = styled.div`
  width: 100%;
`

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

const Table = styled.table`
  width: max-content;
  border-collapse: collapse;
`

const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'white' : '#8b4513')};
  width: 170px;
`

const StickyTableCell = styled.td`
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: center;
  height: 50px;
  min-width: 100px;
  line-height: 100px;
`

const VerticalText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: bold;
`

const TableHeader = styled.th`
  height: 50px;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: center;
  z-index: 1;
  width: 80px;
`

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`

const Modal = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  text-align: center;
  font-size: 16px;
  border-radius: 10px;
`

const ButtonWrapper = styled.div`
  text-align: right;
  margin-top: 20px;
`

const ModalButton = styled.button`
  background-color: ${(props) => (props.primary ? '#4caf50' : '#f44336')};
  color: white;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const timeslots = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00'
]

const teachers = [
  { id: 1, name: 'Teacher A' },
  { id: 2, name: 'Teacher B' },
  { id: 3, name: 'Teacher C' }
]

// Tao const evn
const apiCreateTime = import.meta.env.VITE_URL_REGISTER_TIME
const apiPutTime = import.meta.env.VITE_URL_PUT_TIME
// Giả sử bạn có một user_id nào đó

let teacher_id = ''
let user_id = ''
// let teacher_id = '';
let start_time = ''
let end_time = ''
let date = ''
let rush_hour = false
let teacher_substitute = null

//  =http://127.0.0.1:8000/api/tickets/{user_id}
// get fullData
const fullData = JSON.parse(localStorage.getItem('fullData'))
let username = ''
let role = ''
// Get user role from localStorage
if (!fullData) {
  console.log('Rỗng')
} else {
  username = fullData.username
  role = fullData.role_group
  user_id = fullData.user_id
  teacher_id = user_id // Gán `teacher_id` là `user_id`
  console.log(username)
  // In ra giá trị của `fullData` cùng `teacher_id`
  console.log('Full Data:', fullData)
  console.log('Teacher ID:', teacher_id)
}
console.log({ fullData })
// userId = user_id

// Tạo URL đầy đủ bằng cách nối chuỗi
const apiPutTimeID = `${apiPutTime}${user_id}`

const TeacherRegisterTimeTable = () => {
  const [selectedCells, setSelectedCells] = useState({})
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState(null)
  const [endCell, setEndCell] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [pendingSelection, setPendingSelection] = useState([])

  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let role = ''
  if (!fullData) {
    console.log('Rỗng')
  } else {
    role = fullData.role_group.toLowerCase()
    console.log(role)
  }

  const handleCellClick = (day, time) => {
    const isAlreadySelected = !!selectedCells[`${day}-${time}`]
    const newSelectedCells = { ...selectedCells }

    if (isAlreadySelected) {
      delete newSelectedCells[`${day}-${time}`]
    } else {
      newSelectedCells[`${day}-${time}`] = true
    }
    console.log(`Day: ${day}`) // Sử dụng template literals để in ra giá trị
    console.log(`Time: ${time}`)

    // Tạo đối tượng với key là `day` và `time`
    const dayObject = { day } // dayObject = { day: "Wednesday" }
    const timeObject = { time } // timeObject = { time: "07:30" }

    // 1. Xác định ngày tương ứng với `day` của tuần tiếp theo và định dạng lại
    function getNextWeekDate(day) {
      const today = new Date()
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      const currentDayIndex = today.getDay()
      const targetDayIndex = daysOfWeek.indexOf(day)

      // Tính số ngày chênh lệch để tới được `day` của tuần tiếp theo
      let daysUntilTarget = targetDayIndex - currentDayIndex
      if (daysUntilTarget <= 0) {
        daysUntilTarget += 7 // Đảm bảo là tuần tiếp theo
      }
      daysUntilTarget += 7 // Thêm 7 ngày để tính cho tuần sau

      // Tính ngày tương ứng tuần tiếp theo
      const nextWeekDate = new Date(today)
      nextWeekDate.setDate(today.getDate() + daysUntilTarget)

      // Trả về định dạng `YYYY-MM-DD`
      return nextWeekDate.toISOString().split('T')[0]
    }

    // 2. Tính toán `start_time` và `end_time` theo định dạng ISO 8601
    function calculateTimeRange(date, time, durationMinutes = 60) {
      let [hours, minutes] = time.split(':').map(Number) // Tách `time` thành giờ và phút

      // Tạo đối tượng Date cho `start_time`
      const startDateTime = new Date(
        `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}:00`
      )

      // Tạo đối tượng Date cho `end_time` bằng cách thêm `durationMinutes`
      const endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(startDateTime.getMinutes() + durationMinutes) // Thêm thời gian cho `end_time`

      // Chuyển đổi `start_time` và `end_time` thành định dạng `YYYY-MM-DDTHH:mm:ss`
      const start_time = startDateTime.toISOString() // `start_time` có dạng `YYYY-MM-DDTHH:mm:ss.sssZ`
      const end_time = endDateTime.toISOString() // `end_time` có dạng `YYYY-MM-DDTHH:mm:ss.sssZ`

      // Trả về dạng `YYYY-MM-DDTHH:mm:ss` bằng cách loại bỏ `sssZ` (mili giây và múi giờ)
      return {
        start_time: start_time.split('.')[0],
        end_time: end_time.split('.')[0]
      }
    }

    // 3. Gán các giá trị cho các biến mong muốn
    const date = getNextWeekDate(day) // Ngày của tuần tiếp theo (dạng "YYYY-MM-DD")
    const { start_time, end_time } = calculateTimeRange(date, time) // Tính `start_time` và `end_time`

    // 4. In kết quả ra console dưới dạng JSON
    const apiPayload = {
      start_time, // Đã có định dạng "YYYY-MM-DDTHH:mm:ss"
      end_time, // Đã có định dạng "YYYY-MM-DDTHH:mm:ss"
      date // Định dạng "YYYY-MM-DD"
    }

    console.log('API Payload:', JSON.stringify(apiCreateTime, null, 2))

    // 4. Tạo đối tượng dữ liệu JSON cần gửi
    const payload = {
      teacher_id, // ID của giáo viên
      start_time, // Thời gian bắt đầu
      end_time, // Thời gian kết thúc
      date, // Ngày tương ứng
      rush_hour, // Trạng thái giờ cao điểm
      teacher_substitute // Tên giáo viên (giả định, bạn có thể thay đổi)
    }
    console.log('Payload:', JSON.stringify(payload, null, 2))
    // 5. Hàm gửi dữ liệu lên API bằng phương thức PUT
    async function apiPutTime(payload) {
      try {
        const response = await fetch(apiCreateTime, {
          method: 'POST', // Sử dụng PUT thay vì POST
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Response from API:', result)
        return result
      } catch (error) {
        console.error('Failed to send data to API:', error)
      }
    }

    // 6. Gọi hàm `apiPutTimeID` với `payload` đã tạo
    apiPutTime(payload)

    setSelectedCells(newSelectedCells)
  }

  const handleMouseDown = (day, time) => {
    setIsSelecting(true)
    setStartCell({ day, time })
  }

  const handleMouseUp = () => {
    if (startCell && endCell) {
      const startIndex = days.indexOf(startCell.day)
      const endIndex = days.indexOf(endCell.day)
      const pendingCells = []

      for (let i = startIndex; i <= endIndex; i++) {
        pendingCells.push({ day: days[i], time: startCell.time })
      }

      const newSelectedCells = { ...selectedCells }

      pendingCells.forEach(({ day, time }) => {
        if (selectedCells[`${day}-${time}`]) {
          delete newSelectedCells[`${day}-${time}`]
        } else {
          newSelectedCells[`${day}-${time}`] = true
        }
      })
      console.log(pendingCells) // Sử dụng template literals với dấu backticks
      // console.log(`${time}`);
      // đặt thêm hàm để gửi thông tin lên đăng ký thời gian cho ID :
      // Mẫu {
      //   "teacher_id": 4,
      //   "start_time": "2024-10-15T08:00:00",
      //   "end_time": "2024-10-15T10:00:00",
      //   "date": "2024-10-15",
      //   "rush_hour": true,
      //   "teacher_substitute": 2
      // }
      // Wednesday
      // TeacherRegisterTimeTable.jsx:179 07:30

      // pendingCells
      // {day: 'Tuesday', time: '09:30'}
      // 1
      // :
      // {day: 'Wednesday', time: '09:30'}
      // length
      // :
      // 2
      // [[Prototype]]
      // :
      // Array(0)
      // In ra các phần tử trong mảng
      pendingCells.forEach((cell, index) => {
        console.log(`${index}: { day: '${cell.day}', time: '${cell.time}' }`)
      })
      console.log('Length:', pendingCells.length)

      // Lấy giá trị `day` và `time` tại index 1
      const dayIndex1 = pendingCells[1].day
      const timeIndex1 = pendingCells[1].time

      // Lấy giá trị `day` và `time` tại index cuối cùng
      const dayLastIndex = pendingCells[pendingCells.length - 1].day
      const timeLastIndex = pendingCells[pendingCells.length - 1].time

      // In ra kết quả
      console.log(`Index 1: { day: '${dayIndex1}', time: '${timeIndex1}' }`)
      console.log(
        `Last Index: { day: '${dayLastIndex}', time: '${timeLastIndex}' }`
      )

      // Gán các giá trị `day1`, `time1`, `daylast`, `timelast` vào các biến khác để xử lý logic tiếp theo
      let day1 = day1
      let time1 = time1
      let timelast = timelast
      let daylast = daylast

      // Đặt thêm cái hàm để gửi dữ liệu lên cho Url này :
      // Logic xử lý: ngày bắt đầu là `day1`, giờ bắt đầu là `time1` trừ đi 30 phút, giờ kết thúc là `timelast`
      const startDate = getNextWeekDate(day1) // Xác định ngày tương ứng của `day1` cho tuần tiếp theo

      // Hàm để tính toán `startTime` trừ đi 30 phút
      function subtractMinutes(time, minutes) {
        let [hours, mins] = time.split(':').map(Number) // Tách `time` thành giờ và phút
        mins -= minutes // Trừ đi số phút
        if (mins < 0) {
          mins += 60 // Nếu phút < 0, mượn 1 giờ
          hours -= 1
          if (hours < 0) hours = 23 // Nếu giờ < 0, quay về 23h
        }

        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(
          2,
          '0'
        )}` // Định dạng lại thành `HH:mm`
      }

      // Hàm chuyển đổi `day` và `time` thành định dạng `YYYY-MM-DDTHH:mm:ss`
      function formatToISOString(day, time) {
        const dateTime = new Date(`${day}T${time}:00`) // Tạo đối tượng Date với `time`
        return dateTime.toISOString().split('.')[0] // Chuyển đổi thành định dạng `YYYY-MM-DDTHH:mm:ss`
      }

      // Tính `start_time` và `end_time` cho `payload`
      const start_time = formatToISOString(
        startDate,
        subtractMinutes(time1, 30)
      ) // `time1` trừ 30 phút
      const end_time = formatToISOString(startDate, timelast) // `timelast` giữ nguyên

      // Tạo đối tượng dữ liệu `payload` để gửi vào API
      const payload = {
        teacher_id, // Giả định ID của giáo viên
        start_time, // Đã tính toán `start_time`
        end_time, // Đã tính toán `end_time`
        date: startDate, // Ngày tương ứng của `day1`
        rush_hour: false, // Ví dụ `rush_hour` là `true`
        teacher_substitute: null // Tên giáo viên thay thế (giả định)
      }

      // Hàm `apiPutTimeID` để gửi yêu cầu lên API
      async function apiPutTime(payload) {
        // const apiUrl = "http://127.0.0.1:8000/api/time-table/4";  // URL endpoint của API

        try {
          const response = await fetch(apiCreateTime, {
            method: 'POST', // Sử dụng PUT thay vì POST
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Chuyển đối tượng `payload` thành chuỗi JSON
          })

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            )
          }

          const result = await response.json() // Lấy kết quả phản hồi từ API
          console.log('Response from API:', result)
          return result
        } catch (error) {
          console.error('Failed to send data to API:', error)
        }
      }

      // Gọi hàm `apiPutTimeID` với `payload` đã tạo
      apiPutTime(payload)

      // Hàm xác định ngày tương ứng với `day` của tuần tiếp theo (được sử dụng ở trên)
      function getNextWeekDate(day) {
        const today = new Date()
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]
        const currentDayIndex = today.getDay()
        const targetDayIndex = daysOfWeek.indexOf(day)

        // Tính số ngày chênh lệch để tới được `day` của tuần tiếp theo
        let daysUntilTarget = targetDayIndex - currentDayIndex
        if (daysUntilTarget <= 0) {
          daysUntilTarget += 7 // Đảm bảo là tuần tiếp theo
        }
        daysUntilTarget += 7 // Thêm 7 ngày để tính cho tuần sau

        // Tính ngày tương ứng tuần tiếp theo
        const nextWeekDate = new Date(today)
        nextWeekDate.setDate(today.getDate() + daysUntilTarget)

        // Trả về định dạng `YYYY-MM-DD`
        return nextWeekDate.toISOString().split('T')[0]
      }

      // In ra `payload` để kiểm tra trước khi gửi API
      console.log('Payload to be sent to API:', payload)

      setSelectedCells(newSelectedCells)
    }

    setIsSelecting(false)
    setStartCell(null)
    setEndCell(null)
  }

  const handleMouseOver = (day, time) => {
    if (isSelecting) {
      if (startCell && startCell.time !== time) {
        setIsSelecting(false)
        setModalMessage('Bạn không thể chọn các ô khác cột.')
        setIsModalOpen(true)
        return
      }
      setEndCell({ day, time })
    }
  }

  const handleSubmit = () => {
    const newSelectedCells = { ...selectedCells }

    pendingSelection.forEach(({ day, time }) => {
      if (pendingAction === 'register') {
        newSelectedCells[`${day}-${time}`] = true
      } else {
        delete newSelectedCells[`${day}-${time}`]
      }
    })

    setSelectedCells(newSelectedCells)
    setPendingSelection([])
    setIsModalOpen(false)

    setStartCell(null)
    setEndCell(null)
    setIsSelecting(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPendingSelection([])

    setStartCell(null)
    setEndCell(null)
    setIsSelecting(false)
  }

  return (
    <WrapperAll>
      <ModalOverlay show={isModalOpen} onClick={handleCloseModal} />
      <Modal show={isModalOpen}>
        <p>{modalMessage}</p>
        <ButtonWrapper>
          <ModalButton onClick={handleCloseModal}>Cancel</ModalButton>
          <ModalButton primary onClick={handleSubmit}>
            Submit
          </ModalButton>
        </ButtonWrapper>
      </Modal>
      {/* Hiển thị TeacherSelect nếu role là admin */}
      {role === 'admin' && (
        <TeacherSelect value={selectedTeacher} onChange={handleTeacherChange}>
          <option value="" disabled>
            Select a Teacher
          </option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </TeacherSelect>
      )}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Shift</TableHeader>
              <TableHeader>Time Frame</TableHeader>
              {days.map((day) => (
                <TableHeader key={day}>{day}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <StickyTableCell rowSpan={10}>
                <VerticalText>Morning</VerticalText>
              </StickyTableCell>
              <StickyTableCell>{timeslots[0]}</StickyTableCell>
              {days.map((day) => {
                const isSelected = !!selectedCells[`${day}-${timeslots[0]}`]
                return (
                  <TableCell
                    key={day}
                    selected={isSelected}
                    onClick={() => handleCellClick(day, timeslots[0])}
                    onMouseDown={() => handleMouseDown(day, timeslots[0])}
                    onMouseOver={() => handleMouseOver(day, timeslots[0])}
                    onMouseUp={handleMouseUp}
                  >
                    {isSelected ? 'Đã đăng ký' : ''}
                  </TableCell>
                )
              })}
            </tr>
            {timeslots.slice(1, 10).map((time, index) => (
              <tr key={time}>
                <StickyTableCell>{time}</StickyTableCell>
                {days.map((day) => {
                  const isSelected = !!selectedCells[`${day}-${time}`]
                  return (
                    <TableCell
                      key={day}
                      selected={isSelected}
                      onClick={() => handleCellClick(day, time)}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseOver={() => handleMouseOver(day, time)}
                      onMouseUp={handleMouseUp}
                    >
                      {isSelected ? 'Đã đăng ký' : ''}
                    </TableCell>
                  )
                })}
              </tr>
            ))}

            <tr>
              <StickyTableCell rowSpan={10}>
                <VerticalText>Afternoon</VerticalText>
              </StickyTableCell>
              <StickyTableCell>{timeslots[10]}</StickyTableCell>
              {days.map((day) => {
                const isSelected = !!selectedCells[`${day}-${timeslots[10]}`]
                return (
                  <TableCell
                    key={day}
                    selected={isSelected}
                    onClick={() => handleCellClick(day, timeslots[10])}
                    onMouseDown={() => handleMouseDown(day, timeslots[10])}
                    onMouseOver={() => handleMouseOver(day, timeslots[10])}
                    onMouseUp={handleMouseUp}
                  >
                    {isSelected ? 'Đã đăng ký' : ''}
                  </TableCell>
                )
              })}
            </tr>
            {timeslots.slice(11, 20).map((time, index) => (
              <tr key={time}>
                <StickyTableCell>{time}</StickyTableCell>
                {days.map((day) => {
                  const isSelected = !!selectedCells[`${day}-${time}`]
                  return (
                    <TableCell
                      key={day}
                      selected={isSelected}
                      onClick={() => handleCellClick(day, time)}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseOver={() => handleMouseOver(day, time)}
                      onMouseUp={handleMouseUp}
                    >
                      {isSelected ? 'Đã đăng ký' : ''}
                    </TableCell>
                  )
                })}
              </tr>
            ))}

            <tr>
              <StickyTableCell rowSpan={13}>
                <VerticalText>Evening</VerticalText>
              </StickyTableCell>
              <StickyTableCell>{timeslots[20]}</StickyTableCell>
              {days.map((day) => {
                const isSelected = !!selectedCells[`${day}-${timeslots[20]}`]
                return (
                  <TableCell
                    key={day}
                    selected={isSelected}
                    onClick={() => handleCellClick(day, timeslots[20])}
                    onMouseDown={() => handleMouseDown(day, timeslots[20])}
                    onMouseOver={() => handleMouseOver(day, timeslots[20])}
                    onMouseUp={handleMouseUp}
                  >
                    {isSelected ? 'Đã đăng ký' : ''}
                  </TableCell>
                )
              })}
            </tr>
            {timeslots.slice(21).map((time, index) => (
              <tr key={time}>
                <StickyTableCell>{time}</StickyTableCell>
                {days.map((day) => {
                  const isSelected = !!selectedCells[`${day}-${time}`]
                  return (
                    <TableCell
                      key={day}
                      selected={isSelected}
                      onClick={() => handleCellClick(day, time)}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseOver={() => handleMouseOver(day, time)}
                      onMouseUp={handleMouseUp}
                    >
                      {isSelected ? 'Đã đăng ký' : ''}
                    </TableCell>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </WrapperAll>
  )
}

export default TeacherRegisterTimeTable
