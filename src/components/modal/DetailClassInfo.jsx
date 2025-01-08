import { useState, useEffect } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Loading from '~/components/General/Loading.jsx'
import axios from 'axios'

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
    font-weight: bold;
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
    font-size: 1.5rem;
    font-weight: bold;

    &:hover {
        background-color: #218838;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
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
    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 10px;

    &:hover {
        background-color: #e0a800;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
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
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 2rem;
    flex: 8;
`

const Label = styled.p`
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
    color: red;
`

// eslint-disable-next-line react/prop-types
const DetailClassInfo = ({ isOpen, onClose, classInfo, teachers = [], students = [], goingDateTime }) => {

  if (!isOpen || !classInfo) return null

  const durations = [30, 45, 60, 90]

  const apiUrl = import.meta.env.VITE_URL_CLASS_SESSION
  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let token = ''
  if (!fullData) {
    console.log('Empty')
  } else {
    token = fullData.access_token
    console.log(token)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedTeacher, setEditedTeacher] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedStudent, setEditedStudent] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedStartTime, setEditedStartTime] = useState(new Date())
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedDuration, setEditedDuration] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasChanges, setHasChanges] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedDate, setSelectedDate] = useState(new Date(goingDateTime || '1970-01-01'))
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isEditable, setIsEditable] = useState(true)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (classInfo) {
      // eslint-disable-next-line react/prop-types
      setEditedTeacher(classInfo.teacher)
      // eslint-disable-next-line react/prop-types
      setEditedStudent(classInfo.studentId)
      // eslint-disable-next-line react/prop-types
      setEditedStartTime(new Date(`1970-01-01T${classInfo.time}:00`))
      // eslint-disable-next-line react/prop-types
      setEditedDuration(classInfo.duration)
      setSelectedDate(new Date(goingDateTime || '1970-01-01'))
    }
  }, [classInfo, goingDateTime])

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const isChanged =
      // eslint-disable-next-line react/prop-types
      editedTeacher !== classInfo.teacher ||
      // eslint-disable-next-line react/prop-types
      editedStudent !== classInfo.studentId ||
      // eslint-disable-next-line react/prop-types
      editedStartTime.getTime() !== new Date(`1970-01-01T${classInfo.time}:00`).getTime() ||
      // eslint-disable-next-line react/prop-types
      editedDuration !== classInfo.duration ||
      selectedDate.getTime() !== new Date(goingDateTime || '1970-01-01').getTime()

    setHasChanges(isChanged)
  }, [editedTeacher, editedStudent, editedStartTime, editedDuration, selectedDate, classInfo, goingDateTime])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const currentTime = new Date()
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(editedStartTime.getHours(), editedStartTime.getMinutes(), 0)

    setIsEditable(selectedDateTime > currentTime)
  }, [selectedDate, editedStartTime])

  const handleSave = async () => {
    if (!isEditable) return

    const formattedDate = selectedDate.toISOString().split('T')[0]
    const formattedTime = formatTime(editedStartTime)
    const goingDateTimeValue = `${formattedDate}T${formattedTime}:00`

    const data = {
      // eslint-disable-next-line react/prop-types
      student_id: Number(editedStudent) || Number(classInfo.studentId),
      going_date_time: goingDateTimeValue,
      duration: editedDuration,
      session_status: 'regular'
    }

    try {
      setIsLoading(true)

      // eslint-disable-next-line react/prop-types
      const response = await axios.put(`${apiUrl}${classInfo.code}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        setHasChanges(false)
        setIsLoading(false)
        onClose(true)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to save the class session:', error)
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    // eslint-disable-next-line react/prop-types
    setEditedTeacher(classInfo.teacher)
    // eslint-disable-next-line react/prop-types
    setEditedStudent(classInfo.studentId)
    // eslint-disable-next-line react/prop-types
    setEditedStartTime(new Date(`1970-01-01T${classInfo.time}:00`))
    // eslint-disable-next-line react/prop-types
    setEditedDuration(classInfo.duration)
    setSelectedDate(new Date(goingDateTime || '1970-01-01'))
    setHasChanges(false)
  }

  const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)
    return formatTime(endTime)
  }

  return (
    <>
      {isLoading && <Loading />}
      <ModalBackground onClick={() => onClose(false)}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => onClose(false)}>×</CloseButton>
          <TitleCustom style={{ textAlign: 'center' }}>Class Info</TitleCustom>
          <RowWrapper>
            <Label>Date:</Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              showMonthYearDropdown
              disabled={!isEditable}
            />
          </RowWrapper>
          <Label>
            {/* eslint-disable-next-line react/prop-types */}
            Code: <TextCustom>{classInfo.code}</TextCustom>
          </Label>
          <RowWrapper>
            <Label>Teacher:</Label>
            <SelectField
              value={editedTeacher}
              onChange={(e) => setEditedTeacher(e.target.value)}
              disabled={!isEditable}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name}
                </option>
              ))}
            </SelectField>
          </RowWrapper>
          <RowWrapper>
            <Label>Student:</Label>
            <SelectField
              value={editedStudent || ''}
              onChange={(e) => setEditedStudent(e.target.value)}
              disabled={!isEditable}
            >
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name_student}
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
              timeFormat="HH:mm"
              className="form-control"
              showMonthYearDropdown
              disabled={!isEditable}
            />
          </RowWrapper>
          <RowWrapper>
            <Label>Duration (minutes):</Label>
            <SelectField
              value={editedDuration}
              onChange={(e) => setEditedDuration(Number(e.target.value))}
              disabled={!isEditable}
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
              End Time: <TextCustom>{calculateEndTime(editedStartTime, editedDuration)}</TextCustom>
            </Label>
          </RowWrapper>
          <ButtonGroup>
            {hasChanges && (
              <>
                <SaveButton onClick={handleSave} disabled={!isEditable}>Save</SaveButton>
                <ResetButton onClick={handleReset} disabled={!isEditable}>Reset</ResetButton>
              </>
            )}
          </ButtonGroup>
        </ModalContainer>
      </ModalBackground>
    </>
  )
}

export default DetailClassInfo
