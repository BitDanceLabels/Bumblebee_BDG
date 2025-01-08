import { useState } from 'react'
import styled from 'styled-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './MainApp'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  font-size: 20px;
`

const Nav = styled.ul`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  list-style: none;
  padding: 0;
`

const NavItem = styled.li`
  margin: 0 1rem;
`

const NavLink = styled.a`
  color: ${({ active }) => (active ? '#fff' : '#007bff')};
  background-color: ${({ active }) => (active ? '#007bff' : 'transparent')};
  border: 1px solid #007bff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: #fff;
  }
`

const TextCustom = styled.p`
  text-align: center;
`

const TabContent = styled.div`
  width: 100%;
  max-width: 400px;
`

const TabPane = styled.div`
  display: ${({ active }) => (active ? 'block' : 'none')};
`

const Form = styled.form`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  padding: 0.5rem;
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  height: 40px;
`

const Button = styled.button`
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

const SocialButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  margin: 0 0.5rem;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`

const Checkbox = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
`

function SignIn() {
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()

    // Mocking a successful login by storing a token
    // Normally you'd call an API to get this token
    const token = 'your-generated-token'
    localStorage.setItem('authToken', token)

    // Redirect to home after successful login
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <MainApp />
      </StrictMode>
    )
  }

  return (
    <Container>
      {/* Existing form code */}
      <Form onSubmit={handleSignIn}>
        <Input
          type="email"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign in</Button>
      </Form>
    </Container>
  )
}

export default SignIn
