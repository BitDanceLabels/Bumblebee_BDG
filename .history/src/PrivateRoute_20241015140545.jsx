import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { rolePermissions } from './shared/data' // Import rolePermissions

function PrivateRoute({ children }) {
  const location = useLocation()
  const fullData = localStorage.getItem('fullData')

  if (!fullData) {
    return <Navigate to="/login" />
  }

  const parsedData = JSON.parse(fullData)
  const role = parsedData.role_group.toLowerCase()

  // Lấy danh sách các route được phép truy cập dựa trên vai trò
  const allowedRoutes = rolePermissions[role]

  // Lấy toàn bộ đường dẫn hiện tại (ví dụ: '/classes-of-course/1')
  const currentPath = location.pathname.split('/').slice(1).join('/')

  // Sử dụng hàm checkRoutePermission để kiểm tra quyền
  const hasAccess = checkRoutePermission(allowedRoutes, currentPath)
  console.log(hasAccess)
  if (!hasAccess) {
    return <Navigate to="/not-authorized" />
  }

  return children
}

const checkRoutePermission = (allowedRoutes, currentPath) => {
  for (let parentRoute in allowedRoutes) {
    for (let route of allowedRoutes[parentRoute]) {
      const dynamicRoutePattern = route.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${dynamicRoutePattern}$`)

      if (regex.test(currentPath)) {
        return true
      }
    }
  }
  return false
}

export default PrivateRoute
