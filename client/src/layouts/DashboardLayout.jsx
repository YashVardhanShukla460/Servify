/**
 * DashboardLayout — sidebar + content area for all dashboard pages
 *
 * The sidebar links change based on the user's role.
 *   customer: Profile, Addresses (Bookings added in Phase 9)
 *   worker:   Profile, Availability, Pricing (Bookings in Phase 9)
 */
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const customerLinks = [
  { to: '/dashboard',           label: '🏠 Overview',    end: true },
  { to: '/dashboard/profile',   label: '👤 My Profile'         },
  { to: '/dashboard/addresses', label: '📍 My Addresses'       },
]

const workerLinks = [
  { to: '/dashboard/worker',              label: '🏠 Overview',    end: true },
  { to: '/dashboard/worker/bookings',     label: '📅 Bookings'           },
  { to: '/dashboard/worker/profile',      label: '👤 My Profile'         },
  { to: '/dashboard/worker/availability', label: '⏰ Availability'       },
  { to: '/dashboard/worker/pricing',      label: '💰 Pricing'            },
]

const DashboardLayout = ({ children }) => {
  const { user } = useSelector(state => state.auth)
  const links = user?.role === 'worker' ? workerLinks : customerLinks

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 page-container py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="card p-3">
              {/* User info */}
              <div className="px-3 py-3 mb-2 border-b border-gray-100">
                <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                <div className="text-xs text-gray-400 capitalize">{user?.role} account</div>
              </div>

              {/* Nav links */}
              <nav className="space-y-1">
                {links.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DashboardLayout
