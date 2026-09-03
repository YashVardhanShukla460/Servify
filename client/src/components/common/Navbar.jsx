/**
 * Navbar — auth-aware navigation bar with notifications
 */
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout as logoutAction } from '../../redux/slices/authSlice'
import api from '../../services/api'
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService'

const Navbar = () => {
  const { user }    = useSelector(state => state.auth)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef()

  useEffect(() => {
    if (user) {
      getNotifications().then(d => {
        setNotifications(d.notifications)
        setUnreadCount(d.unreadCount)
      }).catch(() => {})
    }
  }, [user])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    dispatch(logoutAction())
    navigate('/')
  }

  const handleRead = async (id) => {
    await markAsRead(id)
    setNotifications(p => p.map(n => n._id === id ? { ...n, isRead: true } : n))
    setUnreadCount(c => Math.max(0, c - 1))
  }

  const handleReadAll = async () => {
    await markAllAsRead()
    setNotifications(p => p.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
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

        {/* Desktop Auth Buttons & Notifications */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleReadAll} className="text-xs text-blue-600 hover:underline">Mark all as read</button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} 
                            onClick={() => !n.isRead && handleRead(n._id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-sm font-medium ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</span>
                              <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className={`text-xs ${!n.isRead ? 'text-gray-700' : 'text-gray-500'}`}>{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to={dashboardLink}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors border-l pl-4 border-gray-200">
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
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile menu (simplified) */}
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
