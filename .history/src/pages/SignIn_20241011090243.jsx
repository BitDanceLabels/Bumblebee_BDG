import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.section`
  height: 100vh;
  background-color: #9a616d;
`

const Card = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
  max-width: 1000px;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`

const ImageContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
    flex: 0 0 50%;
  }

  img {
    border-radius: 1rem 0 0 1rem;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

const Form = styled.form`
  padding: 4rem;
  width: 100%;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  i {
    font-size: 2rem;
    color: #ff6219;
    margin-right: 1rem;
  }

  span {
    font-size: 2rem;
    font-weight: bold;
  }
`

const Title = styled.h5`
  font-weight: normal;
  margin-bottom: 2rem;
  letter-spacing: 1px;
`

const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }

  label {
    display: block;
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #666;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`

const Link = styled.a`
  color: #393f81;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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
        <ImageContainer>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
            alt="login form"
          />
        </ImageContainer>
        <FormContainer>
          <Form onSubmit={handleSignIn}>
            <Logo>
              <i className="fas fa-cubes"></i>
              <span>Logo</span>
            </Logo>
            <Title>Sign into your account</Title>
            <InputGroup>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email address</label>
            </InputGroup>
            <InputGroup>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </InputGroup>
            <Button type="submit">Login</Button>
            <Link href="#!">Forgot password?</Link>
            <p>
              Don't have an account? <Link href="#!">Register here</Link>
            </p>
            <Link href="#!">Terms of use</Link> |{' '}
            <Link href="#!">Privacy policy</Link>
          </Form>
        </FormContainer>
      </Card>
    </Container>
  )
}

export default SignIn
