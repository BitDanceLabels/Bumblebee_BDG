import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaHome } from 'react-icons/fa'
import { GiTeacher } from 'react-icons/gi'
import { FcReadingEbook } from 'react-icons/fc'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PiStudentFill } from 'react-icons/pi'
import { BsPersonVideo3 } from "react-icons/bs";
import { hasAccess } from '../../shared/functions'
import { rolePermissions } from '../../shared/data'
import axios from 'axios'
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const Navbar = ({ isHovered }) => {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState('classes')
    const location = useLocation()
    const apiUrl = import.meta.env.VITE_URL_GET_ALL_TEACHER_ROLE_TEACHER
    const { t } = useTranslation();

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let role = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        role = fullData.role_group.toLowerCase()
    }

    useEffect(() => {
        const currentPath = location.pathname.split('/')[1] || 'announcement'
        setActiveItem(currentPath)
    }, [location])

    const handleItemClick = async (item) => {
        if (item === 'teacher-profile') {
            if (role === 'teacher') {
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${fullData.access_token}`
                        }
                    })

                    const teachers = response.data
                    const teacher = teachers.find((teacher) => teacher.email === fullData.username)

                    if (teacher) {
                        navigate('/teacher-profile', { state: { teacher } })
                    } else {
                        console.error('Teacher with the specified email not found')
                    }
                } catch (error) {
                    console.error(
                        'An error occurred while fetching teacher data:',
                        error.response?.data?.message || error.message
                    )
                }
            }
        } else {
            setActiveItem(item)
        }
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
                'teacher-profile',
                'teacher-schedule'
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
        if (
            parentItem === 'qc' &&
            ['qc-overview', 'qc-syllabus', 'qc-student-group', 'qc-account-classin'].includes(activeItem)
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
                {childItem === 'teacher-profile' ? (
                    <span style={{
                        color: '#333',
                        fontWeight: '500',
                        fontSize: '16px',
                        display: 'inline-block',
                        textDecoration: 'none',
                        padding: '20px 30px',
                        width: '100%',
                        transition: 'transform 0.4s ease'
                    }}>★ {label}</span>
                ) : (
                    <Link to={`/${childItem}`}>★ {label}</Link>
                )}
            </li>
        )
    }

    return (
        <NavbarWrapper isHovered={isHovered}>
            <nav className="navbar">
                <ul>
                    {renderParentItem('classes', t('dashboard'), FaHome)}
                    <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
                        {renderChildItem('classes', 'announcement', t('announcement'))}
                        {renderChildItem('classes', 'classes', t('classes schedule'))}
                    </ul>

                    {renderParentItem('teacher', t('teacher'), GiTeacher)}
                    <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
                        {renderChildItem('teacher', 'teacher', t('list of teacher'))}
                        {renderChildItem('teacher', 'teacher-demo', t('teacher demo'))}
                        {renderChildItem(
                            'teacher',
                            'teacher-register',
                            t('register time table')
                        )}
                        {renderChildItem('teacher', 'teacher-timetable', t('time table'))}
                        {role === 'teacher' && renderChildItem('teacher', 'teacher-profile', t('profile'))}
                        {renderChildItem('teacher', 'teacher-schedule', t('teacher schedule'))}
                    </ul>

                    {renderParentItem('manager', t('class manager'), FcReadingEbook)}
                    <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
                        {renderChildItem('manager', 'booking', t('booking'))}
                        {renderChildItem('manager', 'ticket', t('teacher ticket'))}
                        {renderChildItem('manager', 'users', t('users'))}
                        {/*{renderChildItem('manager', 'courses', 'Courses')}*/}
                    </ul>

                    {renderParentItem('student', t('student'), PiStudentFill)}
                    <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
                        {renderChildItem('student', 'student', t('list of student'))}
                        {/*{role === 'teacher' && renderChildItem('student', 'student-profile', 'Profile')}*/}
                    </ul>

                    {renderParentItem('qc', t('qc'), BsPersonVideo3)}
                    <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
                        {renderChildItem('qc', 'qc-overview', t('overview'))}
                        {renderChildItem('qc', 'qc-syllabus', t('design syllabus'))}
                        {renderChildItem('qc', 'qc-student-group', t('student group'))}
                        {renderChildItem('qc', 'qc-account-classin', t('account classin'))}
                        {renderChildItem('qc', 'book-manager', t('book manager'))} {/* Thêm EBook Manager */}
                        {renderChildItem('qc', 'classin-manager', t('classin manager'))} {/* Thêm ClassIn Manager */}
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
        font-weight: bold;
        font-size: 18px;
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
