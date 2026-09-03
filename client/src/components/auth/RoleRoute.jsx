/**
 * RoleRoute — wraps pages that require a specific role
 * MUST be nested inside ProtectedRoute (needs req.user to exist first)
 *
 * HOW to use:
 *   <ProtectedRoute>
 *     <RoleRoute role="worker">
 *       <WorkerDashboard />
 *     </RoleRoute>
 *   </ProtectedRoute>
 */
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RoleRoute = ({ role, children }) => {
  const { user } = useSelector(state => state.auth)

  if (user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleRoute
