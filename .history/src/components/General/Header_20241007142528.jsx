import React, { useState } from 'react'
import avt from '../../assets/avt.jpg'
import styled from 'styled-components'
import { CiSettings } from 'react-icons/ci'
import { FaUserCircle } from 'react-icons/fa'
import { MdDarkMode } from 'react-icons/md'
import { IoLogOutOutline } from 'react-icons/io5'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <HeaderWrapper>
      <header className="header">
        <div className="header-left">
          <h1>PEC</h1>
        </div>
        <div className="header-right">
          <span className="account-email">hungpham@pec.edu.vn</span>
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
            <div className="modal">
              <ul>
                <li>
                  <SettingWrapper>
                    <CiSettings fontSize={20} />
                    Account Settings
                  </SettingWrapper>
                </li>
                <li>
                  <SettingWrapper>
                    <FaUserCircle fontSize={20} />
                    Role: Admin
                  </SettingWrapper>
                </li>
                <li>
                  <SettingWrapper>
                    <MdDarkMode fontSize={24} />
                    Mode
                  </SettingWrapper>
                </li>
                <li>
                  <SettingWrapper>
                    <IoLogOutOutline fontSize={24} />
                    Logout
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
    background-color: #2d2e83;
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

export default Header
