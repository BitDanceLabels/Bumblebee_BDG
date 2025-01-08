import React, { useState } from 'react'
import styled from 'styled-components'

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

  h3 {
    color: white;
  }
`

const SocialIcons = styled.div`
  position: absolute;
  right: 20px;
  top: -45px;

  span {
    font-size: 60px;
    margin-left: 10px;
    color: #ffc312;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
`

const CardBody = styled.div`
  padding: 20px;
`

const InputGroup = styled.div`
  display: flex;
  margin-bottom: 10px;

  .input-group-prepend {
    span {
      width: 50px;
      background-color: #ffc312;
      color: black;
      border: none;
    }
  }

  input {
    flex: 1;
    padding: 16px 20px;
    border: none;
    border-radius: 20px;
    margin-bottom: 1rem;
    &:focus {
      outline: none;
    }
  }
`

const RememberMe = styled.div`
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    font-size: 1rem;
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

  &:hover {
    background-color: white;
    color: black;
  }
`

const CardFooter = styled.div`
  color: white;
  text-align: center;
  margin-top: 20px;

  a {
    color: #ffc312;
    margin-left: 4px;
    text-decoration: none;
  }
`

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
          <SocialIcons>
            <span>
              <i className="fab fa-facebook-square"></i>
            </span>
            <span>
              <i className="fab fa-google-plus-square"></i>
            </span>
            <span>
              <i className="fab fa-twitter-square"></i>
            </span>
          </SocialIcons>
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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
