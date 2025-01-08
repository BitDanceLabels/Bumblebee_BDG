import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { rolePermissions } from './path-to-rolePermissions' // Import rolePermissions

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
  console.log('Allowed Routes:', allowedRoutes)

  const currentPath = location.pathname.split('/')[1] // Lấy phần đầu của path (ví dụ: "teacher-timetable")
  console.log('Current Path:', currentPath)

  // Biến kiểm tra quyền truy cập
  let hasAccess = false

  // Lặp qua các khóa trong allowedRoutes để kiểm tra currentPath
  for (let parentRoute in allowedRoutes) {
    if (allowedRoutes[parentRoute].includes(currentPath)) {
      hasAccess = true
      break
    }
  }

  // Nếu không có quyền truy cập, điều hướng về trang "not-authorized"
  if (!hasAccess) {
    return <Navigate to="/not-authorized" />
  }

  return children
}

export default PrivateRoute
