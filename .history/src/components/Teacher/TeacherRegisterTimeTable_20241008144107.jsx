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
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'white' : '#8b4513')};
  width: 100px;
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
    const newSelectedCells = { ...selectedCells }

    if (isAlreadySelected) {
      delete newSelectedCells[`${day}-${time}`]
    } else {
      newSelectedCells[`${day}-${time}`] = true
    }

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
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader></TableHeader>
              {days.map((day) => (
                <TableHeader key={day}>{day}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeslots.map((time) => (
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
