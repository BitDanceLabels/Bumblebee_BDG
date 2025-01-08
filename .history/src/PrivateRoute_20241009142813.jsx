import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken')

  if (!token) {
    // Redirect to the login page if no token is found
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
