import React, { useState } from 'react'
import styled from 'styled-components'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek
} from 'date-fns'

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

const WeekContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
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

const SessionRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`

const Session = styled.div`
  background-color: #4b92db;
  color: white;
  padding: 20px 10px;
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
  const [selectedMonth, setSelectedMonth] = useState('2024-10')
  const startDate = new Date(2024, 9, 1)
  const endDate = new Date(2024, 11, 31)

  // Tính toán các tuần trong tháng
  const weeks = eachWeekOfInterval({
    start: startOfMonth(new Date(selectedMonth)),
    end: endOfMonth(new Date(selectedMonth))
  })

  // Xử lý chọn tháng
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  const generateDaysForWeek = (weekStart) => {
    const days = eachDayOfInterval({
      start: startOfWeek(weekStart),
      end: endOfWeek(weekStart)
    })
    return days
  }

  return (
    <CourseInfoContainer>
      <Header>
        <CourseTitle>B24XXX - Trịnh Phạm Dũng</CourseTitle>
        <DateInput
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        />
      </Header>

      <ActionButtonGroup>
        <button className="create-session">Create session (3)</button>
        <button className="add-bonus">Add bonus</button>
        <button className="update-schedule">Update schedule</button>
        <button className="change-teacher">Change Teacher</button>
      </ActionButtonGroup>

      <ConsultantInfo>Consultant: Hưng | Q.C: Hưng | CM: Hưng</ConsultantInfo>

      <ScheduleContainer>
        {weeks.map((weekStart, index) => (
          <WeekContainer key={index}>
            <DayRow>
              {generateDaysForWeek(weekStart).map((day, dayIndex) => (
                <Day key={dayIndex} active={day >= startDate && day <= endDate}>
                  {format(day, 'E dd-MM-yyyy')}
                </Day>
              ))}
            </DayRow>
            <SessionRow>
              <Session>07:00-07:50 - Sierah Lee P. Saligan</Session>
            </SessionRow>
          </WeekContainer>
        ))}
      </ScheduleContainer>
    </CourseInfoContainer>
  )
}

export default CourseInfo
