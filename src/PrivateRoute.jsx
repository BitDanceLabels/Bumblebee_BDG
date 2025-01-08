import { Navigate, useLocation } from 'react-router-dom'
import { rolePermissions } from './shared/data' // Import rolePermissions

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const location = useLocation()
  const fullData = localStorage.getItem('fullData')

  if (!fullData) {
    return <Navigate to="/login" />
  }

  const parsedData = JSON.parse(fullData)
  const role = parsedData.role_group.toLowerCase()

  const allowedRoutes = rolePermissions[role]

  const currentPath = location.pathname.split('/').slice(1).join('/')

  const hasAccess = checkRoutePermission(allowedRoutes, currentPath)

  if (!hasAccess) {
    return <Navigate to="/not-authorized" />
  }
  else if(currentPath === '') {
    return <Navigate to="/announcement" />
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
