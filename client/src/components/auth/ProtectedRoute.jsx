/**
 * ProtectedRoute — wraps pages that require authentication
 *
 * WHAT it does:
 *   1. isInitialized = false  → show full-page spinner (session check in progress)
 *   2. user = null            → redirect to /login (not authenticated)
 *   3. user exists            → render the page normally
 *
 * HOW to use:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from '../common/Spinner'

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useSelector(state => state.auth)

  // Still checking if user is logged in (App.jsx GET /api/auth/me in progress)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in — render the protected page
  return children
}

export default ProtectedRoute
