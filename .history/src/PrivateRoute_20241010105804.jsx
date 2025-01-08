import React from 'react'
import { Navigate } from 'react-router-dom'
import { rolePermissions } from './shared/data' // Import rolePermissions

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole') // Lấy role từ localStorage

  // Kiểm tra token (người dùng đã đăng nhập chưa)
  if (!token) {
    return <Navigate to="/login" />
  }

  // Kiểm tra quyền truy cập dựa trên role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" /> // Điều hướng đến trang thông báo không có quyền truy cập
  }

  return children
}

export default PrivateRoute
