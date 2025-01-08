import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { rolePermissions } from './shared/data' // Import rolePermissions

function PrivateRoute({ children }) {
  const fullData = JSON.parse(localStorage.getItem('fullData'))
  const role = fullData.role_group.toLowerCase()
  const token = fullData.access_token
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" />
  }

  // Kiểm tra quyền truy cập dựa trên rolePermissions
  const allowedRoutes = rolePermissions[role]
  console.log('Allowed Routes:', allowedRoutes)

  const currentPath = location.pathname.split('/')[1]
  console.log('Current Path:', currentPath)

  let hasAccess = false

  for (let parentRoute in allowedRoutes) {
    if (allowedRoutes[parentRoute].includes(currentPath)) {
      hasAccess = true
      break
    }
  }

  if (!hasAccess) {
    return <Navigate to="/not-authorized" />
  }

  return children
}

export default PrivateRoute
