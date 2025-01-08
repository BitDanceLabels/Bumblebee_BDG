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
  width: 100%;
  border-collapse: collapse;
`

const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'white' : '#8b4513')};
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
`

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

const ModalButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-top: 10px;
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

const TeacherRegisterTimeTable = () => {
  const [selectedCells, setSelectedCells] = useState({})
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState(null)
  const [endCell, setEndCell] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [pendingAction, setPendingAction] = useState(null) // New state to track action (register or cancel)
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
  }

  const handleMouseOver = (day, time) => {
    if (isSelecting && startCell.day === day) {
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

  return (
    <WrapperAll>
      <Modal show={isModalOpen}>
        <p>{modalMessage}</p>
        <ModalButton onClick={handleSubmit}>Submit</ModalButton>
      </Modal>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader></TableHeader>
              {timeslots.map((time) => (
                <TableHeader key={time}>{time}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <StickyTableCell>{day}</StickyTableCell>
                {timeslots.map((time) => {
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
