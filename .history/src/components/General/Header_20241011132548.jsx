import React, { useState, useEffect, useRef } from 'react'
import avt from '../../assets/avt.jpg'
import styled from 'styled-components'
import { CiSettings } from 'react-icons/ci'
import { FaUserCircle } from 'react-icons/fa'
import { MdDarkMode } from 'react-icons/md'
import { IoLogOutOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom' // Import hook useNavigate

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const modalRef = useRef(null)
  const navigate = useNavigate()

  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let username = ''
  let role = ''
  // Get user role from localStorage
  if (!fullData) {
    console.log('Rỗng')
  } else {
    username = fullData.username
    role = fullData.role_group
    console.log(username)
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.clear()

    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  return (
    <HeaderWrapper>
      <header className="header">
        <div className="header-left">
          <h1>PEC</h1>
        </div>
        <div className="header-right">
          <span className="account-email">{username}</span>
          <div className="notification">
            <i className="bell-icon">🔔</i>
            <span className="notification-count">689</span>
          </div>
          <img
            src={avt}
            alt="avatar"
            className="avatar"
            onClick={toggleModal}
          />
          {isModalOpen && (
            <div className="modal" ref={modalRef}>
              <ul>
                <li>
                  <SettingWrapper>
                    <CiSettings fontSize={20} />
                    <TextCustom>Account Settings</TextCustom>
                  </SettingWrapper>
                </li>
                <li>
                  <SettingWrapper>
                    <FaUserCircle fontSize={20} />
                    <TextCustom>Role: {role}</TextCustom>
                  </SettingWrapper>
                </li>
                <li>
                  <SettingWrapper>
                    <MdDarkMode fontSize={20} />
                    <TextCustom>Mode</TextCustom>
                    <ToggleSwitch>
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                      />
                      <Slider />
                    </ToggleSwitch>
                  </SettingWrapper>
                </li>
                <li onClick={handleLogout}>
                  {' '}
                  {/* Gọi hàm handleLogout khi click vào Logout */}
                  <SettingWrapper>
                    <IoLogOutOutline fontSize={20} />
                    <TextCustom>Logout</TextCustom>
                  </SettingWrapper>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  .header {
    background-color: #041168;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
  }

  .header-left h1 {
    margin: 0;
    font-size: 2rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    position: relative;
  }

  .account-email {
    margin-right: 20px;
    font-size: 1.6rem;
  }

  .notification {
    position: relative;
    margin-right: 20px;
  }

  .bell-icon {
    font-size: 1.5em;
    cursor: pointer;
  }

  .notification-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.8em;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }

  .modal {
    position: absolute;
    top: 50px;
    right: 0;
    background-color: white;
    color: black;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 10px;
    z-index: 10;
    font-size: 16px;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
`

const SettingWrapper = styled.div`
  display: flex;
  align-items: center;
`

const TextCustom = styled.span`
  margin-left: 10px;
`

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin-left: 10px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + & {
    background-color: #2d2e83;
  }

  input:checked + &:before {
    transform: translateX(20px);
  }
`

export default Header
