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
  font-size: 2rem;
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

const SelectField = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 2rem;
  flex: 8;
`

const Label = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 2rem;
  flex: 4;
`

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`

const TitleCustom = styled.h2`
  margin-bottom: 2rem;
`

const TextCustom = styled.span`
  color: green;
`

const DetailClassInfo = ({ isOpen, onClose, classInfo }) => {
  if (!isOpen || !classInfo) return null

  const teachers = ['Teacher A', 'Teacher B', 'Teacher C', 'Phạm Văn C']
  const students = ['Student A', 'Student B', 'Student C']
  const durations = [30, 45, 60, 90]

  const [editedTeacher, setEditedTeacher] = useState('')
  const [editedStudent, setEditedStudent] = useState('')
  const [editedStartTime, setEditedStartTime] = useState(new Date())
  const [editedDuration, setEditedDuration] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)

  // Sử dụng useEffect để cập nhật lại state mỗi khi classInfo thay đổi
  useEffect(() => {
    if (classInfo) {
      setEditedTeacher(classInfo.teacher)
      setEditedStudent(classInfo.studentName)
      setEditedStartTime(new Date(`1970-01-01T${classInfo.time}:00`))
      setEditedDuration(classInfo.duration)
    }
  }, [classInfo])

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    const isChanged =
      editedTeacher !== classInfo.teacher ||
      editedStudent !== classInfo.studentName ||
      editedStartTime.getTime() !==
        new Date(`1970-01-01T${classInfo.time}:00`).getTime() ||
      editedDuration !== classInfo.duration

    setHasChanges(isChanged)
  }, [editedTeacher, editedStudent, editedStartTime, editedDuration, classInfo])

  const handleSave = () => {
    const updatedClassInfo = {
      ...classInfo,
      teacher: editedTeacher,
      studentName: editedStudent,
      time: formatTime(editedStartTime),
      duration: editedDuration
    }
    console.log('Updated Class Info:', updatedClassInfo)
    setHasChanges(false)
    onClose()
  }

  const handleReset = () => {
    setEditedTeacher(classInfo.teacher)
    setEditedStudent(classInfo.studentName)
    setEditedStartTime(new Date(`1970-01-01T${classInfo.time}:00`))
    setEditedDuration(classInfo.duration)
    setHasChanges(false)
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
        <TitleCustom style={{ textAlign: 'center' }}>Class Info</TitleCustom>
        <Label>
          Code: <TextCustom>{classInfo.code}</TextCustom>
        </Label>
        <RowWrapper>
          <Label>Teacher:</Label>
          <SelectField
            value={editedTeacher}
            onChange={(e) => setEditedTeacher(e.target.value)}
          >
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </SelectField>
        </RowWrapper>
        <RowWrapper>
          <Label>Student:</Label>
          <SelectField
            value={editedStudent}
            onChange={(e) => setEditedStudent(e.target.value)}
          >
            {students.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </SelectField>
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
          <SelectField
            value={editedDuration}
            onChange={(e) => setEditedDuration(Number(e.target.value))}
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration} minutes
              </option>
            ))}
          </SelectField>
        </RowWrapper>
        <RowWrapper>
          <Label>
            End Time:{' '}
            <span>{calculateEndTime(editedStartTime, editedDuration)}</span>
          </Label>
        </RowWrapper>
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
