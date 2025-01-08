import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { rolePermissions } from './shared/data' // Import rolePermissions

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole') // Lấy role từ localStorage
  const location = useLocation() // Lấy đường dẫn hiện tại (path)

  // Kiểm tra token (người dùng đã đăng nhập chưa)
  if (!token) {
    return <Navigate to="/login" />
  }

  // Kiểm tra quyền truy cập dựa trên rolePermissions
  const allowedRoutes = rolePermissions[role]
  const currentPath = location.pathname.split('/')[1] // Lấy phần đầu của path (ví dụ: "/teacher")

  if (!allowedRoutes || !allowedRoutes[currentPath]) {
    return <Navigate to="/not-authorized" /> // Điều hướng đến trang thông báo không có quyền truy cập
  }

  return children
}

export default PrivateRoute
