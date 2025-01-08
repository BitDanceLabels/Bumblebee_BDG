import React from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import ScheduleComponent from '../components/ScheduleComponent'
import Booking from '../components/Booking'
import ListOfStudent from '../components/ListOfStudent'
import ListOfTeacher from '../components/ListOfTeacher'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import TeacherTabs from '../components/TeacherTabs'
import StudentProfile from '../components/StudentProfile'

function MainApp() {
  return (
    <Router>
      <MainAppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <div className="main-layout">
          <NavbarWrapper>
            <Navbar />
          </NavbarWrapper>
          <ContentWrapper>
            <Routes>
              <Route path="/classes" element={<ScheduleComponent />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/students" element={<ListOfStudent />} />
              <Route path="/teacher" element={<ListOfTeacher />} />
              <Route path="/teacher-profile" element={<TeacherTabs />} />
              <Route path="/student-profile" element={<StudentProfile />} />
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
  left: 0;
  background-color: #007bff;
  color: white;
  z-index: 1000;
`

const ContentWrapper = styled.div`
  padding: 20px;
  flex-grow: 1;
  background-color: #f4f4f4;
  min-height: 100%;
  overflow-y: auto;
`

export default MainApp
