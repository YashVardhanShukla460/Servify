/**
 * Navbar — Top navigation bar
 *
 * WHAT: The navigation bar shown on all public pages.
 * WHY: Users need to navigate between pages and see login/register buttons.
 *
 * Uses useSelector to read auth state from Redux.
 * Uses Link from React Router for client-side navigation (no page refresh).
 */

import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Dashboard URL depends on user role
  const getDashboardPath = () => {
    if (!user) return '/'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'worker') return '/worker/dashboard'
    return '/dashboard'
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Servi<span className="text-blue-600">fy</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/workers"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Professionals
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Hi, {user?.name?.split(' ')[0]}
                </Link>
                <Link to={getDashboardPath()} className="btn-primary text-sm">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
