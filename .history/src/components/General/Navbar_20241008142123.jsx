import React, { useState } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { PiStudentFill } from 'react-icons/pi'

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  return (
    <NavbarWrapper>
      <nav className="navbar">
        <ul>
          <li onClick={() => handleItemClick('classes')}>
            <Link to="/classes">
              <FaHome style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Dashboard
            </Link>
          </li>

          {/* Submenu for Classes per day */}
          <ul className="sub-menu">
            <li
              className={activeItem === 'classes' ? 'active' : ''}
              onClick={() => handleItemClick('classes')}
            >
              <Link to="/classes">★ Classes schedule</Link>
            </li>
          </ul>

          <li onClick={() => handleItemClick('teacher')}>
            <Link to="/teacher">
              <GiTeacher style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Teacher
            </Link>
          </li>

          {/* Submenu for List Of Teacher */}
          <ul className="sub-menu">
            <li
              className={activeItem === 'teacher' ? 'active' : ''}
              onClick={() => handleItemClick('teacher')}
            >
              <Link to="/teacher">★ List Of Teacher</Link>
            </li>

            <li
              className={activeItem === 'teacher-register' ? 'active' : ''}
              onClick={() => handleItemClick('teacher-register')}
            >
              <Link to="/teacher-register">★ Register Time Table</Link>
            </li>

            <li
              className={activeItem === 'teacher-timetable' ? 'active' : ''}
              onClick={() => handleItemClick('teacher-timetable')}
            >
              <Link to="/teacher-timetable">★ Time Table</Link>
            </li>
          </ul>

          <li onClick={() => handleItemClick('booking')}>
            <Link to="/booking">
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
              Class Manager
            </Link>
          </li>

          {/* Submenu for Booking */}
          <ul className="sub-menu">
            <li
              className={activeItem === 'booking' ? 'active' : ''}
              onClick={() => handleItemClick('booking')}
            >
              <Link to="/booking">★ Booking</Link>
            </li>

            <li
              className={activeItem === 'ticket' ? 'active' : ''}
              onClick={() => handleItemClick('ticket')}
            >
              <Link to="/ticket">★ Teacher Ticket</Link>
            </li>

            <li
              className={activeItem === 'users' ? 'active' : ''}
              onClick={() => handleItemClick('users')}
            >
              <Link to="/users">★ Users</Link>
            </li>
          </ul>

          <li onClick={() => handleItemClick('listOfStudent')}>
            <Link to="/students">
              <PiStudentFill style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Student
            </Link>
          </li>

          {/* Submenu for List Of Students */}
          <ul className="sub-menu">
            <li
              className={activeItem === 'listOfStudent' ? 'active' : ''}
              onClick={() => handleItemClick('listOfStudent')}
            >
              <Link to="/students">★ List Of Students</Link>
            </li>
          </ul>
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

  /* Submenu styles */
  .sub-menu {
    list-style-type: none;
    padding-left: 20px;
    max-height: 0; /* Ẩn sub-menu */
    overflow: hidden;
    transition: max-height 0.3s ease; /* Hiệu ứng trượt */
  }

  .sub-menu li {
  }

  .sub-menu li a {
    font-size: 14px;
    width: 100%;
    padding-left: 32px;
    padding: 20px 30px;
  }

  /* Hiển thị sub-menu khi hover vào li cha */
  .navbar li:hover .sub-menu {
    max-height: 500px; /* Tăng max-height để hiện sub-menu */
  }
`

export default Navbar
