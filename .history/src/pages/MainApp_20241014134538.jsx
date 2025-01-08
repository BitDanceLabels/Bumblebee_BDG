import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute'
import SignIn from './SignIn'
import ScheduleComponent from '../components/Dashboard/ScheduleComponent'
import ClassScheduleMonthly from '../components/Dashboard/ClassScheduleMonthly'
import AnnouncementComponent from '../components/Dashboard/AnnouncementComponent'
import Booking from '../components/Management/Booking'
import ListOfStudent from '../components/Student/ListOfStudent'
import ListOfTeacher from '../components/Teacher/ListOfTeacher'
import TeacherTabs from '../components/Teacher/TeacherTabs'
import StudentProfile from '../components/Student/StudentProfile'
import TeacherRegisterTimeTable from '../components/Teacher/TeacherRegisterTimeTable'
import TeacherTimeTable from '../components/Teacher/TeacherTimeTable'
import CourseInfo from '../components/Student/CourseInfo'
import TicketTabs from '../components/Management/TicketTabs'
import Users from '../components/Management/Users'
import Header from '../components/General/Header'
import Navbar from '../components/General/Navbar'
import styled from 'styled-components'

function MainApp() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />

        <Route
          path="*"
          element={
            <MainLayout isHovered={isHovered} setIsHovered={setIsHovered} />
          }
        />
      </Routes>
    </Router>
  )
}

function MainLayout({ isHovered, setIsHovered }) {
  return (
    <MainAppWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <div className="main-layout">
        <NavbarWrapper
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          isHovered={isHovered}
        >
          <Navbar isHovered={isHovered} />
        </NavbarWrapper>
        <ContentWrapper isHovered={isHovered}>
          <Routes>
            {/* Các route sẽ được bảo vệ dựa trên rolePermissions */}
            <Route path="/" element={<PrivateRoute></PrivateRoute>} />
            <Route
              path="/announcement"
              element={
                <PrivateRoute>
                  <AnnouncementComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <PrivateRoute>
                  <ScheduleComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/class-schedule"
              element={
                <PrivateRoute>
                  <ClassScheduleMonthly />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <PrivateRoute>
                  <ListOfTeacher />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-profile"
              element={
                <PrivateRoute>
                  <TeacherTabs />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-register"
              element={
                <PrivateRoute>
                  <TeacherRegisterTimeTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-timetable"
              element={
                <PrivateRoute>
                  <TeacherTimeTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/student"
              element={
                <PrivateRoute>
                  <ListOfStudent />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-profile"
              element={
                <PrivateRoute>
                  <StudentProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/course-info"
              element={
                <PrivateRoute>
                  <CourseInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket"
              element={
                <PrivateRoute>
                  <TicketTabs />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
          </Routes>
        </ContentWrapper>
      </div>
    </MainAppWrapper>
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
  transition: width 0.4s ease, transform 0.4s ease;

  &:hover {
    transform: translateX(0);
  }
`

const ContentWrapper = styled.div`
  margin-top: 60px;
  margin-left: ${({ isHovered }) =>
    isHovered ? '250px' : '60px'}; /* Adjust margin on hover */
  padding: 20px;
  flex-grow: 1;
  background-color: #f4f4f4;
  min-height: 100%;
  overflow-y: auto;
  transition: margin-left 0.4s ease;
`

export default MainApp
