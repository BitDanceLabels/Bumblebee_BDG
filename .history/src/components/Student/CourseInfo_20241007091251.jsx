import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const CourseInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: Arial, sans-serif;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CourseTitle = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`

const CommunicationButton = styled.button`
  background-color: #00c4cc;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`

const DateInput = styled.input`
  border: 1px solid #ccc;
  padding: 5px;
  margin-left: 20px;
`

const ConsultantInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9em;
`

const ScheduleContainer = styled.div`
  margin-top: 20px;
`

const DayRow = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const Day = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: ${({ active }) => (active ? '#7d4ab0' : '#ccc')};
  color: white;
`

const Session = styled.div`
  background-color: #4b92db;
  color: white;
  padding: 5px;
  text-align: center;
  margin: 5px;
  border-radius: 5px;
`

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  button {
    margin-left: 10px;
    padding: 8px 12px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }

  .create-session {
    background-color: #0053f0;
    color: white;
  }

  .add-bonus {
    background-color: #f0a500;
    color: white;
  }

  .update-schedule {
    background-color: #00c4cc;
    color: white;
  }

  .change-teacher {
    background-color: #4caf50;
    color: white;
  }
`

const CourseInfo = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [daysInMonth, setDaysInMonth] = useState([])

  useEffect(() => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    )
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    )
    const daysArray = []

    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      )
    }

    setDaysInMonth(daysArray)
  }, [currentMonth])

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const renderDays = () => {
    const rows = []
    let cells = []

    daysInMonth.forEach((day, index) => {
      const dayName = day.toLocaleString('default', { weekday: 'short' })
      const dayNumber = day.getDate()
      cells.push(
        <Day
          key={index}
          active={dayNumber === 7 || dayNumber === 8 /* Example active days */}
        >
          {dayName} {dayNumber}
        </Day>
      )
      if (cells.length === 7) {
        rows.push(<DayRow key={index}>{cells}</DayRow>)
        cells = []
      }
    })

    if (cells.length > 0) {
      rows.push(<DayRow key={daysInMonth.length}>{cells}</DayRow>)
    }

    return rows
  }

  return (
    <CourseInfoContainer>
      <Header>
        <CourseTitle>B24XXX - Trịnh Phạm Dũng</CourseTitle>
        <DateInput
          type="text"
          value={currentMonth.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric'
          })}
          readOnly
        />
        <button onClick={handlePrevMonth}>Prev</button>
        <button onClick={handleNextMonth}>Next</button>
      </Header>

      <ActionButtonGroup>
        <button className="create-session">Create session (3)</button>
        <button className="add-bonus">Add bonus</button>
        <button className="update-schedule">Update schedule</button>
        <button className="change-teacher">Change Teacher</button>
      </ActionButtonGroup>

      <ConsultantInfo>
        Consultant: Trung Huỳnh | C.E: Nhật Trần | A.C: Duyên Phạm |
        Communication: Sierah Lee P. Saligan
      </ConsultantInfo>

      <ScheduleContainer>
        {renderDays()}
        <Session>07:00-07:50 - Sierah Lee P. Saligan</Session>
      </ScheduleContainer>
    </CourseInfoContainer>
  )
}

export default CourseInfo
