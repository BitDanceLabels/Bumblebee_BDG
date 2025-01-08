import React, { useState } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { PiStudentFill } from 'react-icons/pi'
import { hasAccess } from '../../shared/functions'

const Navbar = ({ isHovered }) => {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  // Get user role from localStorage
  const role = localStorage.getItem('userRole')
  console.log('User Role:', role)

  // Check if parent menu item should be active
  const isParentActive = (parentItem) => {
    if (parentItem === 'classes' && activeItem === 'classes') return true
    if (
      parentItem === 'teacher' &&
      [
        'teacher',
        'teacher-register',
        'teacher-timetable',
        'teacher-profile'
      ].includes(activeItem)
    )
      return true
    if (
      parentItem === 'booking' &&
      ['booking', 'ticket', 'users'].includes(activeItem)
    )
      return true
    if (parentItem === 'student' && ['student'].includes(activeItem))
      return true
    return false
  }

  // Render parent menu item
  const renderParentItem = (parentItem, label, Icon) => {
    if (!hasAccess(role, parentItem)) return null

    return (
      <li
        className={
          !isHovered && isParentActive(parentItem) ? 'parent-active' : ''
        }
        onClick={() => handleItemClick(parentItem)}
      >
        <Link to={`/${parentItem}`}>
          <Icon className="icon" /> {label}
        </Link>
      </li>
    )
  }

  // Render child menu item
  const renderChildItem = (parentItem, childItem, label) => {
    if (!hasAccess(role, parentItem, childItem)) return null

    return (
      <li
        className={activeItem === childItem ? 'active' : ''}
        onClick={() => handleItemClick(childItem)}
      >
        <Link to={`/${childItem}`}>★ {label}</Link>
      </li>
    )
  }

  return (
    <NavbarWrapper isHovered={isHovered}>
      <nav className="navbar">
        <ul>
          {renderParentItem('classes', 'Dashboard', FaHome)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('classes', 'classes', 'Classes schedule')}
          </ul>

          {renderParentItem('teacher', 'Teacher', GiTeacher)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('teacher', 'teacher', 'List Of Teacher')}
            {renderChildItem(
              'teacher',
              'teacher-register',
              'Register Time Table'
            )}
            {renderChildItem('teacher', 'teacher-timetable', 'Time Table')}
            {renderChildItem('teacher', 'teacher-profile', 'Profile')}
          </ul>

          {renderParentItem('booking', 'Class Manager', FcReadingEbook)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('booking', 'booking', 'Booking')}
            {renderChildItem('booking', 'ticket', 'Teacher Ticket')}
            {renderChildItem('booking', 'users', 'Users')}
          </ul>

          {renderParentItem('student', 'Student', PiStudentFill)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {/* Biến đầu là tên của parent, biến 2 là đường link, biến 3 là tên hiển thị */}
            {renderChildItem('student', 'student', 'List Of Student')}
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
    transition: background-color 0.4s ease;
  }

  .navbar li.parent-active {
    background-color: #feed01;
  }

  .navbar li a {
    width: 100%;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    display: inline-block;
    transition: transform 0.4s ease;
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

  .icon {
    margin-right: 8px;
    transition: font-size 0.4s ease;
    font-size: ${({ isHovered }) => (isHovered ? '20px' : '40px')};
  }

  .sub-menu {
    list-style-type: none;
    padding-left: 20px;
    transition: max-height 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    overflow: hidden;
    max-height: 0;
    will-change: max-height;
  }

  .sub-menu li a {
    font-size: 14px;
    width: 100%;
    padding-left: 32px;
    padding: 20px 30px;
  }

  .sub-menu.hide {
    max-height: 0;
  }

  .sub-menu.show {
    max-height: 500px;
  }
`

export default Navbar
