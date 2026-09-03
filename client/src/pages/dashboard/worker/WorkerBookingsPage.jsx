/**
 * WorkerBookingsPage — Dashboard list for workers to manage requests
 */
import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Spinner from '../../../components/common/Spinner'
import { getWorkerBookings, updateBookingStatus } from '../../../services/bookingService'

const WorkerBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { bookings } = await getWorkerBookings()
      setBookings(bookings)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      await load()
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        
        {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
        
        {!loading && bookings.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📅</div>
            <p>You don&apos;t have any booking requests yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card flex flex-col md:flex-row gap-6">
              {/* Left: Customer info */}
              <div className="shrink-0 w-48 border-r border-gray-100 pr-4">
                <div className="font-semibold text-gray-900 mb-1">{b.customer?.name}</div>
                <div className="text-sm text-gray-500 mb-2">📞 {b.customer?.phone || 'No phone'}</div>
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                  {b.address?.addressLine1}, {b.address?.city}
                </div>
              </div>

              {/* Middle: Details */}
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
                <div className="text-sm text-gray-600 space-y-1">
                  <div><span className="font-medium">Date:</span> {new Date(b.date).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {b.startTime} - {b.endTime}</div>
                  <div><span className="font-medium">Price:</span> ₹{b.totalAmount}</div>
                  {b.notes && <div><span className="font-medium">Notes:</span> {b.notes}</div>}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="shrink-0 w-full md:w-32 flex flex-col gap-2 justify-center">
                {b.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatus(b._id, 'accepted')} className="btn-primary py-1.5 text-sm">Accept</button>
                    <button onClick={() => handleStatus(b._id, 'rejected')} className="btn-secondary py-1.5 text-sm text-red-600 border-red-600 hover:bg-red-50">Reject</button>
                  </>
                )}
                {b.status === 'accepted' && (
                  <button onClick={() => handleStatus(b._id, 'completed')} className="btn-primary py-1.5 text-sm bg-green-600 hover:bg-green-700">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default WorkerBookingsPage
