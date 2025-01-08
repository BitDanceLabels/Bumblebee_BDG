import React, { useState } from 'react'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()

    const token = 'fake-token-12345'
    const role = 'student'

    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', role)

    window.location.href = '/classes'
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <form
        onSubmit={handleSignIn}
        style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
      >
        <input
          type="email"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  )
}

export default SignIn
