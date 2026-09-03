import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import { getCustomerBookings, updateBookingStatus } from '../../services/bookingService'

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { bookings } = await getCustomerBookings()
      setBookings(bookings)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await updateBookingStatus(id, 'cancelled')
      await load()
    } catch (e) {
      alert(e.response?.data?.message || 'Cancellation failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 mt-1">Manage your bookings, profile, and saved addresses.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/services" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Browse Services</div>
          </Link>
          <Link to="/dashboard/profile" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Edit Profile</div>
          </Link>
          <Link to="/dashboard/addresses" className="card hover:shadow-md transition-shadow text-center group">
            <div className="text-3xl mb-2">📍</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Addresses</div>
          </Link>
        </div>

        <h2 className="text-xl font-bold text-gray-900 pt-4">My Bookings</h2>
        
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
        
        {!loading && bookings.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📅</div>
            <p>You haven&apos;t made any bookings yet.</p>
            <Link to="/services" className="btn-primary mt-4 inline-block">Book a Service</Link>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card flex flex-col sm:flex-row gap-5 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{b.service?.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                    ${b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      b.status === 'accepted' || b.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700 block mb-1">Professional</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {b.worker?.user?.name?.[0]}
                      </div>
                      <Link to={`/workers/${b.worker?._id}`} className="hover:text-blue-600 hover:underline">
                        {b.worker?.user?.name}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block mb-1">Schedule</span>
                    <div>{new Date(b.date).toLocaleDateString()}</div>
                    <div>{b.startTime} - {b.endTime}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block mb-1">Amount</span>
                    <div className="font-bold text-gray-900">₹{b.totalAmount}</div>
                  </div>
                </div>
              </div>
              
              <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
                {(b.status === 'pending' || b.status === 'accepted') && (
                  <button onClick={() => handleCancel(b._id)} className="btn-secondary py-1.5 text-sm text-red-600 border-red-600 hover:bg-red-50">
                    Cancel Booking
                  </button>
                )}
                {b.status === 'completed' && (
                  <button className="btn-secondary py-1.5 text-sm" disabled>Review (Next Phase)</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
