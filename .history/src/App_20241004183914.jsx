import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn' // The sign-in component
import MainApp from './components/MainApp' // Your MainApp component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} /> {/* Sign In route */}
        <Route path="/dashboard/*" element={<MainApp />} />{' '}
        {/* Main App route */}
      </Routes>
    </Router>
  )
}

export default App
