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
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`

const SaveButton = styled.button`
  margin-top: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`

const DetailClassInfo = ({ isOpen, onClose, classInfo }) => {
  const [editedTeacher, setEditedTeacher] = useState(classInfo.teacher)
  const [editedStudent, setEditedStudent] = useState(classInfo.studentName)
  const [editedStartTime, setEditedStartTime] = useState(
    new Date(`1970-01-01T${classInfo.time}:00`)
  )
  const [editedDuration, setEditedDuration] = useState(classInfo.duration)
  const [hasChanges, setHasChanges] = useState(false)

  // Check if any changes have been made
  useEffect(() => {
    const isChanged =
      editedTeacher !== classInfo.teacher ||
      editedStudent !== classInfo.studentName ||
      editedStartTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }) !== classInfo.time ||
      editedDuration !== classInfo.duration

    setHasChanges(isChanged)
  }, [editedTeacher, editedStudent, editedStartTime, editedDuration, classInfo])

  if (!isOpen) return null

  const handleSave = () => {
    const updatedClassInfo = {
      ...classInfo,
      teacher: editedTeacher,
      studentName: editedStudent,
      time: editedStartTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      duration: editedDuration
    }
    console.log('Updated Class Info:', updatedClassInfo)
    setHasChanges(false) // Reset after save
  }

  const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)
    return endTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Class Info</h2>
        <>
          <p>
            <strong>Code:</strong> {classInfo.code}
          </p>
          <p>
            <strong>Teacher:</strong>
            <input
              type="text"
              value={editedTeacher}
              onChange={(e) => setEditedTeacher(e.target.value)}
            />
          </p>
          <p>
            <strong>Student:</strong>
            <input
              type="text"
              value={editedStudent}
              onChange={(e) => setEditedStudent(e.target.value)}
            />
          </p>
          <p>
            <strong>Start Time:</strong>
            <DatePicker
              selected={editedStartTime}
              onChange={(date) => setEditedStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
            />
          </p>
          <p>
            <strong>Duration (minutes):</strong>
            <input
              type="number"
              value={editedDuration}
              onChange={(e) => setEditedDuration(Number(e.target.value))}
            />
          </p>
          <p>
            <strong>End Time:</strong>{' '}
            {calculateEndTime(editedStartTime, editedDuration)}
          </p>
          {/* Save Button is only shown if there are changes */}
          {hasChanges && <SaveButton onClick={handleSave}>Save</SaveButton>}
        </>
      </ModalContainer>
    </ModalBackground>
  )
}

export default DetailClassInfo
