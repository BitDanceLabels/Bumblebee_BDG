import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`

const ModalContainer = styled.div`
  width: 500px;
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
`

const SaveButton = styled.button`
  margin-top: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #218838;
  }
`

const ResetButton = styled.button`
  margin-top: 10px;
  background-color: #ffc107;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 10px;
  &:hover {
    background-color: #e0a800;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`

const InputField = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
`

const Label = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
`

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

const DetailClassInfo = ({ isOpen, onClose, classInfo }) => {
  if (!isOpen || !classInfo) return null

  // State to hold the current and original values
  const [editedTeacher, setEditedTeacher] = useState(classInfo.teacher)
  const [editedStudent, setEditedStudent] = useState(classInfo.studentName)
  const [editedStartTime, setEditedStartTime] = useState(
    new Date(`1970-01-01T${classInfo.time}:00`)
  )
  const [editedDuration, setEditedDuration] = useState(classInfo.duration)
  const [hasChanges, setHasChanges] = useState(false)

  // Save the original data for reset functionality
  const originalData = {
    teacher: classInfo.teacher,
    studentName: classInfo.studentName,
    startTime: new Date(`1970-01-01T${classInfo.time}:00`),
    duration: classInfo.duration
  }

  // Helper function to format time
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Check if any changes have been made
  useEffect(() => {
    const isChanged =
      editedTeacher !== originalData.teacher ||
      editedStudent !== originalData.studentName ||
      editedStartTime.getTime() !== originalData.startTime.getTime() || // Compare time using getTime()
      editedDuration !== originalData.duration

    setHasChanges(isChanged)
  }, [
    editedTeacher,
    editedStudent,
    editedStartTime,
    editedDuration,
    originalData
  ])

  const handleSave = () => {
    const updatedClassInfo = {
      ...classInfo,
      teacher: editedTeacher,
      studentName: editedStudent,
      time: formatTime(editedStartTime),
      duration: editedDuration
    }
    console.log('Updated Class Info:', updatedClassInfo)
    setHasChanges(false) // Reset after save
    onClose() // Close the modal after saving
  }

  const handleReset = () => {
    // Reset values to original data
    setEditedTeacher(originalData.teacher)
    setEditedStudent(originalData.studentName)
    setEditedStartTime(originalData.startTime)
    setEditedDuration(originalData.duration)
    setHasChanges(false) // Reset change detection
  }

  const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)
    return formatTime(endTime)
  }

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2 style={{ textAlign: 'center' }}>Class Info</h2>
        <RowWrapper>
          <Label>Code:</Label>
          <Label>{classInfo.code}</Label>
        </RowWrapper>
        <RowWrapper>
          <Label>Teacher:</Label>
          <InputField
            type="text"
            value={editedTeacher}
            onChange={(e) => setEditedTeacher(e.target.value)}
          />
        </RowWrapper>
        <RowWrapper>
          <Label>Student:</Label>
          <InputField
            type="text"
            value={editedStudent}
            onChange={(e) => setEditedStudent(e.target.value)}
          />
        </RowWrapper>
        <RowWrapper>
          <Label>Start Time:</Label>
          <DatePicker
            selected={editedStartTime}
            onChange={(date) => setEditedStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            className="form-control"
          />
        </RowWrapper>
        <RowWrapper>
          <Label>Duration (minutes):</Label>
          <InputField
            type="number"
            value={editedDuration}
            onChange={(e) => setEditedDuration(Number(e.target.value))}
          />
        </RowWrapper>
        <Label>End Time:</Label>
        <p>{calculateEndTime(editedStartTime, editedDuration)}</p>

        {/* Button Group with Save and Reset */}
        <ButtonGroup>
          {hasChanges && (
            <>
              <SaveButton onClick={handleSave}>Save</SaveButton>
              <ResetButton onClick={handleReset}>Reset</ResetButton>
            </>
          )}
        </ButtonGroup>
      </ModalContainer>
    </ModalBackground>
  )
}

export default DetailClassInfo
