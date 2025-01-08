import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate() // React Router hook to handle navigation

  const handleSignIn = (e) => {
    e.preventDefault()
    // Simulate sign-in logic, you can replace this with actual sign-in authentication logic.
    const isAuthenticated =
      email === 'admin@example.com' && password === 'password'

    if (isAuthenticated) {
      // Redirect to the main app (dashboard or home) after successful login
      navigate('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  )
}

export default SignIn
