import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link, useLocation } from 'react-router-dom'
import { PiStudentFill } from 'react-icons/pi'
import { hasAccess } from '../../shared/functions'
import { rolePermissions } from '../../shared/data'

const Navbar = ({ isHovered }) => {
  const [activeItem, setActiveItem] = useState('classes')
  const location = useLocation()

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1] || 'announcement'
    setActiveItem(currentPath)
  }, [location])

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let role = ''
  if (!fullData) {
    console.log('Rỗng')
  } else {
    role = fullData.role_group.toLowerCase()
    console.log(role)
  }

  const isParentActive = (parentItem) => {
    if (
      parentItem === 'classes' &&
      ['announcement', 'classes'].includes(activeItem)
    )
      return true
    if (
      parentItem === 'teacher' &&
      [
        'teacher',
        'teacher-demo',
        'teacher-register',
        'teacher-timetable',
        'teacher-profile'
      ].includes(activeItem)
    )
      return true
    if (
      parentItem === 'manager' &&
      ['booking', 'ticket', 'users', 'courses'].includes(activeItem)
    )
      return true
    if (
      parentItem === 'student' &&
      ['student', 'student-profile'].includes(activeItem)
    )
      return true
    return false
  }

  const renderParentItem = (parentItem, label, Icon) => {
    if (!hasAccess(role, parentItem)) return null

    const firstChildItem = rolePermissions[role]?.[parentItem]?.[0]

    if (!firstChildItem) return null

    return (
      <li
        className={
          !isHovered && isParentActive(parentItem) ? 'parent-active' : ''
        }
        onClick={() => handleItemClick(firstChildItem)}
      >
        <Link to={`/${firstChildItem}`}>
          <Icon className="icon" /> {label}
        </Link>
      </li>
    )
  }

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
            {renderChildItem('classes', 'announcement', 'Announcement')}
            {renderChildItem('classes', 'classes', 'Classes schedule')}
          </ul>

          {renderParentItem('teacher', 'Teacher', GiTeacher)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('teacher', 'teacher', 'List Of Teacher')}
            {renderChildItem('teacher', 'teacher-demo', 'Teacher Demo')}
            {renderChildItem(
              'teacher',
              'teacher-register',
              'Register Time Table'
            )}
            {renderChildItem('teacher', 'teacher-timetable', 'Time Table')}
            {renderChildItem('teacher', 'teacher-profile', 'Profile')}
          </ul>

          {renderParentItem('manager', 'Class Manager', FcReadingEbook)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('manager', 'booking', 'Booking')}
            {renderChildItem('manager', 'ticket', 'Teacher Ticket')}
            {renderChildItem('manager', 'users', 'Users')}
            {renderChildItem('manager', 'courses', 'Courses')}
          </ul>

          {renderParentItem('student', 'Student', PiStudentFill)}
          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            {renderChildItem('student', 'student', 'List Of Student')}
            {renderChildItem('student', 'student-profile', 'Profile')}
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
