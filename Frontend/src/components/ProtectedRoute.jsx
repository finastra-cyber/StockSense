import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import BrandLoader from './BrandLoader.jsx'

/** Redirects unauthenticated users to /login, preserving intended destination */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <BrandLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
