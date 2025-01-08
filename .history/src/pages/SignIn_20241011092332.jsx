import React, { useState } from 'react'
import styled from 'styled-components'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg');
  background-size: cover;
  background-repeat: no-repeat;
`

const Card = styled.div`
  height: 370px;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  margin: auto;
`

const CardHeader = styled.div`
  position: relative;
  padding: 20px;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 10px;

  h3 {
    color: white;
  }
`

const CardBody = styled.div`
  padding: 20px;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;

  .input-group-prepend {
    span {
      width: 50px;
      background-color: #ffc312;
      color: black;
      border: none;
    }
  }

  input {
    font-size: 1.7rem;
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 20px;
    margin-bottom: 1rem;
    &:focus {
      outline: none;
    }
  }

  .eye-icon {
    position: absolute;
    right: 10px;
    font-size: 1.5rem;
    color: #ffc312;
    cursor: pointer;
  }
`

const RememberMe = styled.div`
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.5rem;

  input {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`

const LoginButton = styled.button`
  width: 100px;
  background-color: #ffc312;
  color: black;
  border: none;
  padding: 10px;
  float: right;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.8rem;

  &:hover {
    background-color: white;
    color: black;
  }
`

const CardFooter = styled.div`
  color: white;
  text-align: center;
  margin-top: 4rem;
  font-size: 1.5rem;

  a {
    color: #ffc312;
    margin-left: 4px;
    text-decoration: none;
  }
`

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSignIn = (e) => {
    e.preventDefault()

    const token = 'fake-token-12345'
    const role = 'admin'

    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', role)

    window.location.href = '/'
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <h3>Sign In</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSignIn}>
            <InputGroup>
              <div className="input-group-prepend">
                <span>
                  <i className="fas fa-user"></i>
                </span>
              </div>
              <input
                type="email"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <div className="input-group-prepend">
                <span>
                  <i className="fas fa-key"></i>
                </span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </InputGroup>
            <RememberMe>
              <input type="checkbox" /> Remember Me
            </RememberMe>
            <LoginButton type="submit">Login</LoginButton>
          </form>
        </CardBody>
        <CardFooter>
          <div>
            <a href="#">Forgot your password?</a>
          </div>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default SignIn
