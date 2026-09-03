/**
 * Navbar — auth-aware navigation bar
 *
 * Shows different UI based on auth state:
 *   - Not logged in: Login + Register buttons
 *   - Logged in:     User name, Dashboard link, Logout button
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout as logoutAction } from '../../redux/slices/authSlice'
import api from '../../services/api'

const Navbar = () => {
  const { user }    = useSelector(state => state.auth)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    dispatch(logoutAction())
    navigate('/')
  }

  const dashboardLink = user?.role === 'worker' ? '/dashboard/worker' : '/dashboard'

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="page-container flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="font-extrabold text-xl text-gray-900">Servify</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
            Services
          </Link>
          <Link to="/workers"  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
            Find Pros
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardLink}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                👋 {user.name.split(' ')[0]}
              </Link>
              <Link to={dashboardLink} className="btn-secondary text-sm py-1.5 px-4">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary text-sm py-1.5 px-4">Log In</Link>
              <Link to="/register" className="btn-primary  text-sm py-1.5 px-4">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Services</Link>
          <Link to="/workers"  onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Find Pros</Link>
          {user ? (
            <>
              <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="block py-2 text-red-500 text-left w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Log In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-blue-600 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
