import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Wrap any route element in this to require a logged-in user.
 * Unauthenticated visitors are bounced to /login, and the page they
 * originally asked for is kept in location state so Login can send
 * them back after a successful sign-in.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
