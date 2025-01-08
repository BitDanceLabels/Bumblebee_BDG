const Navbar = ({ isHovered }) => {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  const isParentActive = (parentItem) => {
    // Kiểm tra nếu parentItem có mục con đang active
    if (parentItem === 'classes' && activeItem === 'classes') return true
    if (
      parentItem === 'teacher' &&
      ['teacher', 'teacher-register', 'teacher-timetable'].includes(activeItem)
    )
      return true
    if (
      parentItem === 'booking' &&
      ['booking', 'ticket', 'users'].includes(activeItem)
    )
      return true
    if (parentItem === 'listOfStudent' && activeItem === 'listOfStudent')
      return true
    return false
  }

  return (
    <NavbarWrapper isHovered={isHovered}>
      <nav className="navbar">
        <ul>
          <li
            className={
              !isHovered && isParentActive('classes') ? 'parent-active' : ''
            }
            onClick={() => handleItemClick('classes')}
          >
            <Link to="/classes">
              <FaHome className="icon" /> Dashboard
            </Link>
          </li>

          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
            <li
              className={activeItem === 'classes' ? 'active' : ''}
              onClick={() => handleItemClick('classes')}
            >
              <Link to="/classes">★ Classes schedule</Link>
            </li>
          </ul>

          <li
            className={
              !isHovered && isParentActive('teacher') ? 'parent-active' : ''
            }
            onClick={() => handleItemClick('teacher')}
          >
            <Link to="/teacher">
              <GiTeacher className="icon" /> Teacher
            </Link>
          </li>

          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
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

          <li
            className={
              !isHovered && isParentActive('booking') ? 'parent-active' : ''
            }
            onClick={() => handleItemClick('booking')}
          >
            <Link to="/booking">
              <FcReadingEbook className="icon" /> Class Manager
            </Link>
          </li>

          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
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

          <li
            className={
              !isHovered && isParentActive('listOfStudent')
                ? 'parent-active'
                : ''
            }
            onClick={() => handleItemClick('listOfStudent')}
          >
            <Link to="/students">
              <PiStudentFill className="icon" /> Student
            </Link>
          </li>

          <ul className={`sub-menu ${isHovered ? 'show' : 'hide'}`}>
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
    transition: background-color 0.4s ease;
  }

  /* Khi mục cha active và không hover */
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

  /* Icon size logic */
  .icon {
    margin-right: 8px;
    transition: font-size 0.4s ease;
    font-size: ${({ isHovered }) => (isHovered ? '20px' : '40px')};
  }

  /* Submenu styles */
  .sub-menu {
    list-style-type: none;
    padding-left: 20px;
    transition: max-height 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
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
