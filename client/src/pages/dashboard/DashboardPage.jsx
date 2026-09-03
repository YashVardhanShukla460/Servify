import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 mt-1">Manage your bookings, profile, and saved addresses.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/services" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Browse Services</div>
            <p className="text-gray-500 text-sm mt-1">Find what you need</p>
          </Link>
          <Link to="/dashboard/profile" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Edit Profile</div>
            <p className="text-gray-500 text-sm mt-1">Update your details</p>
          </Link>
          <Link to="/dashboard/addresses" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">📍</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Addresses</div>
            <p className="text-gray-500 text-sm mt-1">Saved service locations</p>
          </Link>
        </div>

        {/* Bookings placeholder */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>Booking history will appear here in the next phase.</p>
            <Link to="/services" className="btn-primary mt-4 inline-block">Book a Service</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
