import React, { useState } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  return (
    <NavbarWrapper>
      <nav className="navbar">
        <ul>
          <li onClick={() => handleItemClick('dashboard')}>
            <Link to="/dashboard">
              <FaHome style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Dashboard
            </Link>
          </li>

          {/* Submenu for Classes per day */}
          <li onClick={() => handleItemClick('classes')}>
            <Link to="/classes">
              <FaHome style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Classes
            </Link>
            <ul className="sub-menu">
              <li className={activeItem === 'classes' ? 'active' : ''}>
                <Link to="/classes">★ Classes per day</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => handleItemClick('teacher')}>
            <Link to="/teacher">
              <GiTeacher style={{ marginRight: '8px', fontSize: '20px' }} />{' '}
              Teacher
            </Link>
            <ul className="sub-menu">
              <li className={activeItem === 'teacher' ? 'active' : ''}>
                <Link to="/teacher">★ List Of Teacher</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => handleItemClick('booking')}>
            <Link to="/booking">
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
              Class Manager
            </Link>
            <ul className="sub-menu">
              <li className={activeItem === 'booking' ? 'active' : ''}>
                <Link to="/booking">★ Booking</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => handleItemClick('listOfStudent')}>
            <Link to="/students">
              <FcReadingEbook
                style={{ marginRight: '8px', fontSize: '20px' }}
              />{' '}
              Student
            </Link>
            <ul className="sub-menu">
              <li className={activeItem === 'listOfStudent' ? 'active' : ''}>
                <Link to="/students">★ List Of Students</Link>
              </li>
            </ul>
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
    margin-left: 20px;
  }
`

export default Navbar
