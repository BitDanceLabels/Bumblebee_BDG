import React, { useState } from 'react'
import Header from '../components/General/Header'
import Navbar from '../components/General/Navbar'
import ScheduleComponent from '../components/Dashboard/ScheduleComponent'
import ClassScheduleMonthly from '../components/Dashboard/ClassScheduleMonthly'
import Booking from '../components/Management/Booking'
import ListOfStudent from '../components/Student/ListOfStudent'
import ListOfTeacher from '../components/Teacher/ListOfTeacher'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import TeacherTabs from '../components/Teacher/TeacherTabs'
import StudentProfile from '../components/Student/StudentProfile'
import TeacherRegisterTimeTable from '../components/Teacher/TeacherRegisterTimeTable'
import TeacherTimeTable from '../components/Teacher/TeacherTimeTable'
import CourseInfo from '../components/Student/CourseInfo'
import TicketTabs from '../components/Management/TicketTabs'
import Users from '../components/Management/Users'

function MainApp() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Router>
      <MainAppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <div className="main-layout">
          {/* Truyền setIsHovered để cập nhật trạng thái */}
          <NavbarWrapper
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            isHovered={isHovered}
          >
            {/* Truyền trạng thái isHovered vào Navbar */}
            <Navbar isHovered={isHovered} />
          </NavbarWrapper>
          <ContentWrapper isHovered={isHovered}>
            <Routes>
              <Route path="/classes" element={<ScheduleComponent />} />
              <Route
                path="/class-schedule"
                element={<ClassScheduleMonthly />}
              />
              <Route path="/booking" element={<Booking />} />
              <Route path="/students" element={<ListOfStudent />} />
              <Route path="/teacher" element={<ListOfTeacher />} />
              <Route path="/teacher-profile" element={<TeacherTabs />} />
              <Route path="/student-profile" element={<StudentProfile />} />
              <Route path="/teacher-timetable" element={<TeacherTimeTable />} />
              <Route path="/course-info" element={<CourseInfo />} />
              <Route path="/ticket" element={<TicketTabs />} />
              <Route path="/users" element={<Users />} />
              <Route
                path="/teacher-register"
                element={<TeacherRegisterTimeTable />}
              />
              {/* Add more routes as needed */}
            </Routes>
          </ContentWrapper>
        </div>
      </MainAppWrapper>
    </Router>
  )
}

const MainAppWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;

  .main-layout {
    display: flex;
    flex-grow: 1;
  }
`

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  width: ${({ isHovered }) => (isHovered ? '250px' : '60px')};
  background-color: #ccc;
  color: white;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: translateX(0);
  }
`

const ContentWrapper = styled.div`
  margin-top: 60px;
  margin-left: ${({ isHovered }) =>
    isHovered ? '250px' : '60px'}; /* Thay đổi margin khi hover */
  padding: 20px;
  flex-grow: 1;
  background-color: #f4f4f4;
  min-height: 100%;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
`

export default MainApp
