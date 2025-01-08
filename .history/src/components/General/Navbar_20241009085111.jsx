import React, { useState } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { PiStudentFill } from 'react-icons/pi'

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('')
  const [hoveredItem, setHoveredItem] = useState('')

  const handleItemClick = (item) => {
    setActiveItem(item === activeItem ? '' : item)
  }

  return (
    <NavbarWrapper>
      <nav className="navbar">
        <ul>
          {/* Dashboard */}
          <li
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem('')}
            onClick={() => handleItemClick('dashboard')}
          >
            <Link
              to="/dashboard"
              className={activeItem === 'dashboard' ? 'active' : ''}
            >
              <FaHome style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Dashboard
            </Link>
          </li>

          {/* Classes */}
          <li
            onMouseEnter={() => setHoveredItem('classes')}
            onMouseLeave={() => setHoveredItem('')}
            onClick={() => handleItemClick('classes')}
          >
            <Link
              to="/classes"
              className={activeItem === 'classes' ? 'active' : ''}
            >
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
              Classes
            </Link>
            {(hoveredItem === 'classes' || activeItem === 'classes') && (
              <ul className="sub-menu">
                <li onClick={() => handleItemClick('classes')}>
                  <Link to="/classes">★ Classes schedule</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Teachers */}
          <li
            onMouseEnter={() => setHoveredItem('teacher')}
            onMouseLeave={() => setHoveredItem('')}
            onClick={() => handleItemClick('teacher')}
          >
            <Link
              to="/teacher"
              className={activeItem === 'teacher' ? 'active' : ''}
            >
              <GiTeacher style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Teacher
            </Link>
            {(hoveredItem === 'teacher' || activeItem === 'teacher') && (
              <ul className="sub-menu">
                <li onClick={() => handleItemClick('listOfTeachers')}>
                  <Link to="/teacher">★ List Of Teacher</Link>
                </li>
                <li onClick={() => handleItemClick('teacher-register')}>
                  <Link to="/teacher-register">★ Register Time Table</Link>
                </li>
                <li onClick={() => handleItemClick('teacher-timetable')}>
                  <Link to="/teacher-timetable">★ Time Table</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Booking */}
          <li
            onMouseEnter={() => setHoveredItem('booking')}
            onMouseLeave={() => setHoveredItem('')}
            onClick={() => handleItemClick('booking')}
          >
            <Link
              to="/booking"
              className={activeItem === 'booking' ? 'active' : ''}
            >
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
              Booking
            </Link>
            {(hoveredItem === 'booking' || activeItem === 'booking') && (
              <ul className="sub-menu">
                <li onClick={() => handleItemClick('booking')}>
                  <Link to="/booking">★ Booking</Link>
                </li>
                <li onClick={() => handleItemClick('ticket')}>
                  <Link to="/ticket">★ Teacher Ticket</Link>
                </li>
                <li onClick={() => handleItemClick('users')}>
                  <Link to="/users">★ Users</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Students */}
          <li
            onMouseEnter={() => setHoveredItem('students')}
            onMouseLeave={() => setHoveredItem('')}
            onClick={() => handleItemClick('students')}
          >
            <Link
              to="/students"
              className={activeItem === 'students' ? 'active' : ''}
            >
              <PiStudentFill style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Students
            </Link>
            {(hoveredItem === 'students' || activeItem === 'students') && (
              <ul className="sub-menu">
                <li onClick={() => handleItemClick('listOfStudents')}>
                  <Link to="/students">★ List Of Students</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.nav`
  width: 14%;

  .navbar {
    width: 250px;
    background-color: #ccc;
    color: white;
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .navbar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .navbar li {
    cursor: pointer;
    color: white;
    width: 100%;
  }

  .navbar li a {
    width: 100%;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    display: inline-block;
    transition: transform 0.3s ease;
    text-decoration: none;
    padding: 20px 10px;
  }

  .navbar li:hover a {
    transform: scale(1.2);
    transform-origin: left;
  }

  .navbar li.active {
    background-color: #feed01;
  }

  .sub-menu {
    list-style-type: none;
    padding-left: 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .sub-menu li a {
    font-size: 14px;
    width: 100%;
    padding-left: 32px;
    padding: 10px 30px;
  }

  /* Show submenu when hovered or active */
  .navbar li:hover .sub-menu,
  .navbar li.active .sub-menu {
    max-height: 500px; /* Adjust to fit submenu content */
  }
`

export default Navbar
