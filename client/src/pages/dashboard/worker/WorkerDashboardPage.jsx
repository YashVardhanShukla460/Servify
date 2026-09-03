import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Spinner from '../../../components/common/Spinner'
import { fetchMyWorkerProfile } from '../../../services/workerService'

const WorkerDashboardPage = () => {
  const { user }    = useSelector(state => state.auth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyWorkerProfile()
      .then(d => setProfile(d.worker))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className={`card text-white ${profile?.status === 'approved' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-amber-500 to-amber-600'}`}>
          <h1 className="text-2xl font-bold">Hello, {user?.name?.split(' ')[0]}! 🛠️</h1>
          <p className="mt-1 opacity-90">
            {profile?.status === 'approved'
              ? 'Your profile is live. Customers can find and book you.'
              : profile?.status === 'pending'
              ? 'Your account is under review. We\'ll notify you once approved.'
              : `Account status: ${profile?.status}`}
          </p>
        </div>

        {loading && <div className="flex justify-center py-6"><Spinner /></div>}

        {profile && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Rating',       value: profile.rating ? `${profile.rating.toFixed(1)}⭐` : '—' },
                { label: 'Reviews',      value: profile.totalReviews ?? 0 },
                { label: 'Services',     value: profile.services?.length ?? 0 },
                { label: 'Status',       value: profile.status, capitalize: true },
              ].map(s => (
                <div key={s.label} className="card text-center">
                  <div className={`text-2xl font-bold ${s.capitalize ? 'capitalize' : ''} ${s.label === 'Status' && profile.status === 'approved' ? 'text-green-600' : 'text-gray-900'}`}>
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { to: '/dashboard/worker/profile',      icon: '👤', title: 'Edit Profile',    desc: 'Update bio, skills, service areas' },
                { to: '/dashboard/worker/availability', icon: '📅', title: 'Availability',    desc: 'Set your weekly schedule' },
                { to: '/dashboard/worker/pricing',      icon: '💰', title: 'Pricing',         desc: 'Set your rates per service' },
              ].map(card => (
                <Link key={card.to} to={card.to} className="card hover:shadow-md transition-shadow group text-center">
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600">{card.title}</div>
                  <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkerDashboardPage
