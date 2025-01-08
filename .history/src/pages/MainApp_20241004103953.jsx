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
      <Header />
      <MainAppWrapper>
        <div className="main-layout">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/classes" element={<ScheduleComponent />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/students" element={<ListOfStudent />} />
              <Route path="/teacher" element={<ListOfTeacher />} />
              <Route path="/teacher-profile" element={<TeacherTabs />} />
              <Route path="/student-profile" element={<StudentProfile />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
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

  .main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #f4f4f4;
    min-height: 100%;
  }
`

export default MainApp
