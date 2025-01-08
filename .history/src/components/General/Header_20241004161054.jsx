import React from 'react'
import avt_me from '../../assets/avt_me.jpg'
import styled from 'styled-components'

const Header = () => {
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
          <img src={avt} alt="avatar" className="avatar" />
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
`

export default Header
