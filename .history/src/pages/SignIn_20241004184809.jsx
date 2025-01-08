import { useState } from 'react'
import styled from 'styled-components'
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

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    // Thực hiện xử lý logic đăng nhập, ví dụ như gọi API
    return <MainApp />

    // Ví dụ gọi API:
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // }).then(response => {
    //   // Xử lý kết quả từ API
    // }).catch(error => {
    //   // Xử lý lỗi
    // })
  }

  return (
    <Container>
      {/* Pills navs */}
      <Nav>
        <NavItem>
          <NavLink
            active={activeTab === 'login'}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === 'register'}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </NavLink>
        </NavItem>
      </Nav>

      {/* Pills content */}
      <TabContent>
        <TabPane active={activeTab === 'login'}>
          <Form onSubmit={handleSignIn}>
            <div className="text-center mb-3">
              <TextCustom>Sign in with:</TextCustom>
              <SocialButton>
                <i className="fab fa-facebook-f"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-google"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-twitter"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-github"></i>
              </SocialButton>
            </div>
            <TextCustom>or:</TextCustom>

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

            <Checkbox>
              <CheckboxLabel>
                <input type="checkbox" />
                Remember me
              </CheckboxLabel>
              <a href="#!">Forgot password?</a>
            </Checkbox>

            <Button type="submit">Sign in</Button>
          </Form>
        </TabPane>

        <TabPane active={activeTab === 'register'}>
          <Form>
            <div className="text-center mb-3">
              <TextCustom>Sign up with:</TextCustom>
              <SocialButton>
                <i className="fab fa-facebook-f"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-google"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-twitter"></i>
              </SocialButton>
              <SocialButton>
                <i className="fab fa-github"></i>
              </SocialButton>
            </div>
            <TextCustom>or:</TextCustom>

            <Input type="text" placeholder="Name" />
            <Input type="text" placeholder="Username" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input type="password" placeholder="Repeat password" />

            <Checkbox>
              <CheckboxLabel>
                <input type="checkbox" />I have read and agree to the terms
              </CheckboxLabel>
            </Checkbox>

            <Button type="submit">Sign up</Button>
          </Form>
        </TabPane>
      </TabContent>
    </Container>
  )
}

export default SignIn
