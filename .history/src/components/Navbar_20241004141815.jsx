import React, { useState } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link } from 'react-router-dom' // Import Link from react-router-dom

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
              <Link to="/classes">★ Classes per day</Link>
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

            <li>
              <Link to="/teacher-register">★ Register Time Table</Link>
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
          </ul>

          <li onClick={() => handleItemClick('listOfStudent')}>
            <Link to="/students">
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
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
    height: 100%;
  }

  .navbar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .navbar li {
    padding: 10px 0;
    cursor: pointer;
    color: white;
    width: 100%;
  }

  .navbar li a {
    width: 100%;
    padding: 10px;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    display: inline-block;
    transition: transform 0.3s ease;
    text-decoration: none;
  }

  .navbar li:hover a {
    transform: scale(1.2);
    transform-origin: left;
  }

  .navbar li.active {
    background-color: #e1f644;
  }

  /* Submenu styles */
  .sub-menu {
    list-style-type: none;
    padding-left: 20px;
  }

  .sub-menu li {
    padding: 5px 0;
  }

  .sub-menu li a {
    font-size: 14px;
    width: 100%;
    padding-left: 20px;
  }
`

export default Navbar
