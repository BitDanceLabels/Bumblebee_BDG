import React, { useState } from 'react'
import styled from 'styled-components'

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

const Table = styled.table`
  width: max-content;
  border-collapse: collapse;
`

const TableCell = styled.td`
  height: 70px;
  padding: 0; /* Loại bỏ padding để chia nhỏ */
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'white' : '#8b4513')};
  width: 100px;
  position: relative;
`

// Thêm thành phần để vẽ các đường chia
const QuarterDivider = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 25%;
  border-bottom: 1px solid white;
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
  min-width: 150px;
`

const TableHeader = styled.th`
  height: 50px;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
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

// Giờ chính hiển thị trên giao diện
const displayTimeslots = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

// Mỗi ô là 15 phút, nhưng không hiển thị trực tiếp
const timeslots = [
  '07:00',
  '07:15',
  '07:30',
  '07:45',
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  // Tiếp tục thêm khung giờ...
  '22:00',
  '22:15',
  '22:30',
  '22:45',
  '23:00'
]

const TeacherRegisterTimeTable = () => {
  const [selectedCells, setSelectedCells] = useState({})
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState(null)
  const [endCell, setEndCell] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [pendingSelection, setPendingSelection] = useState([])

  const handleCellClick = (day, time) => {
    const isAlreadySelected = !!selectedCells[`${day}-${time}`]

    if (isAlreadySelected) {
      setPendingAction('cancel')
      setModalMessage(`Bạn có muốn hủy lớp vào ${time} thứ ${day}?`)
    } else {
      setPendingAction('register')
      setModalMessage(`Bạn có muốn đăng ký lớp vào ${time} thứ ${day}?`)
    }

    setPendingSelection([{ day, time }])
    setIsModalOpen(true)
  }

  const handleMouseDown = (day, time) => {
    setIsSelecting(true)
    setStartCell({ day, time })
  }

  const handleMouseUp = () => {
    if (startCell && endCell) {
      const startIndex = timeslots.indexOf(startCell.time)
      const endIndex = timeslots.indexOf(endCell.time)
      const pendingCells = []

      // Tính khoảng thời gian đã chọn
      const selectedDuration = (endIndex - startIndex + 1) * 15 // Mỗi ô là 15 phút

      if (selectedDuration < 30) {
        setModalMessage('Thời gian đăng ký phải lớn hơn 30 phút.')
        setIsModalOpen(true)
        setIsSelecting(false)
        return
      }

      // Chọn tất cả các ô giữa startCell và endCell
      for (let i = startIndex; i <= endIndex; i++) {
        pendingCells.push({ day: startCell.day, time: timeslots[i] })
      }

      const anySelected = pendingCells.some(
        ({ day, time }) => selectedCells[`${day}-${time}`]
      )

      if (anySelected) {
        setPendingAction('cancel')
        setModalMessage(
          `Bạn có muốn hủy khung giờ từ ${startCell.time} đến ${endCell.time} thứ ${startCell.day}?`
        )
      } else {
        setPendingAction('register')
        setModalMessage(
          `Bạn có muốn đăng ký khung giờ từ ${startCell.time} đến ${endCell.time} thứ ${startCell.day}?`
        )
      }

      setPendingSelection(pendingCells)
      setIsModalOpen(true)
    }

    setIsSelecting(false)
    setStartCell(null)
    setEndCell(null)
  }

  const handleMouseOver = (day, time) => {
    if (isSelecting && startCell) {
      if (startCell.day !== day) {
        setIsSelecting(false)
        setModalMessage('Bạn không thể chọn các ô khác hàng.')
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
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPendingSelection([])
    setStartCell(null)
    setEndCell(null)
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
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader></TableHeader>
              {displayTimeslots.map((time) => (
                <TableHeader key={time}>{time}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <StickyTableCell>{day}</StickyTableCell>
                {displayTimeslots.map((time) => {
                  const isSelected = !!selectedCells[`${day}-${time}`]
                  return (
                    <TableCell
                      key={time}
                      selected={isSelected}
                      onClick={() => handleCellClick(day, time)}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseOver={() => handleMouseOver(day, time)}
                      onMouseUp={handleMouseUp}
                    >
                      {isSelected ? 'Đã đăng ký' : ''}
                      {/* Chia nhỏ mỗi ô thành 4 phần 15 phút */}
                      <QuarterDivider style={{ top: '25%' }} />
                      <QuarterDivider style={{ top: '50%' }} />
                      <QuarterDivider style={{ top: '75%' }} />
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
