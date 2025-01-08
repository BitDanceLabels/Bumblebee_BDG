import React from 'react'
import styled from 'styled-components'

const Background = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://your-image-url.com'); // Replace with the background image URL
  background-size: cover;
  background-position: center;
`

const LoginContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(10px);
`

const Title = styled.h1`
  color: white;
  font-size: 24px;
  margin-bottom: 1.5rem;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  outline: none;
`

const Button = styled.button`
  background-color: #ffa07a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background-color: #ff7f50;
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
  color: white;
`

const SocialButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const SocialButton = styled.button`
  background-color: white;
  color: black;
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 45%;
  cursor: pointer;

  &:hover {
    background-color: lightgray;
  }
`

const SignIn = () => {
  return (
    <Background>
      <LoginContainer>
        <Title>Login #10</Title>
        <Input type="text" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button>SIGN IN</Button>
        <CheckboxContainer>
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Forgot Password
          </a>
        </CheckboxContainer>
        <p style={{ color: 'white', marginBottom: '1rem' }}>Or Sign In With</p>
        <SocialButtons>
          <SocialButton>Facebook</SocialButton>
          <SocialButton>Twitter</SocialButton>
        </SocialButtons>
      </LoginContainer>
    </Background>
  )
}

export default SignIn
