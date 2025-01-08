import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const WrapperAll = styled.div`
  width: 100%;
`

// Styled component cho Table container
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

// Styled component cho Table
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

// Styled component cho Table Cell
const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
`

// Styled component cho cột "Giáo viên" cố định với độ rộng tăng thêm
const StickyTableCell = styled.td`
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  height: 50px;
  width: 250px;
`

// Styled component cho Table Header
const TableHeader = styled.th`
  height: 50px;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  z-index: 1;
`

// Dữ liệu mẫu của giáo viên duy nhất, với thêm trường "day" để xác định thứ
const teacher = {
  name: 'Giáo viên A',
  schedule: [
    { day: 'Monday', time: '08:00', code: 'B96018', duration: 45, type: 1 },
    { day: 'Wednesday', time: '10:00', code: 'C10245', duration: 60, type: 2 }
  ]
}

// Danh sách các thứ trong tuần
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

// Khung giờ từ 7h đến 23h, cách nhau 1 tiếng
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
  const tableContainerRef = useRef(null)

  const handleCellClick = (classInfo) => {
    if (classInfo) {
      alert('Lớp học đã được đăng ký.')
    } else {
      alert('Giờ này chưa có lớp học.')
    }
  }

  const findClassInfo = (day, time) => {
    return teacher.schedule.find(
      (classInfo) => classInfo.day === day && classInfo.time === time
    )
  }

  return (
    <WrapperAll>
      <TableContainer ref={tableContainerRef}>
        <Table>
          <thead>
            <tr>
              <TableHeader></TableHeader>
              {/* Khung giờ từ 7h đến 23h */}
              {timeslots.map((time) => (
                <TableHeader key={time}>{time}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Các ngày từ Monday -> Sunday */}
            {days.map((day) => (
              <tr key={day}>
                <StickyTableCell>{day}</StickyTableCell>
                {/* Khung giờ từ 7h đến 23h */}
                {timeslots.map((time) => {
                  const classInfo = findClassInfo(day, time)
                  return (
                    <TableCell
                      key={time}
                      style={{
                        backgroundColor: classInfo ? 'white' : '#8b4513'
                      }}
                      onClick={() => handleCellClick(classInfo)}
                    >
                      {classInfo ? classInfo.code : ''}
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
