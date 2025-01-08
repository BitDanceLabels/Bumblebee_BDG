import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import SignIn from './pages/SignIn'
import MainApp from './pages/MainApp'

function App() {
  const token = localStorage.getItem('token') // Kiểm tra token trong localStorage

  return (
    <Router>
      <Routes>
        {/* Nếu chưa có token thì điều hướng đến trang đăng nhập */}
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/*"
          element={token ? <MainApp /> : <Navigate to="/login" />} // Điều hướng nếu không có token
        />
      </Routes>
    </Router>
  )
}

export default App
