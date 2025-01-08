import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import MainApp from './MainApp'

function App() {
  const token = localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/*"
          element={token ? <MainApp /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  )
}

export default App
