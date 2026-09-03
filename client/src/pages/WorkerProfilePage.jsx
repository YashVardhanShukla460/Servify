/**
 * WorkerProfilePage — public profile for a single worker
 *
 * Shows:
 *  - Name, avatar, rating, experience, bio
 *  - Services offered (with prices)
 *  - Weekly availability schedule
 *  - Service areas
 *  - Recent reviews
 *  - Book Now button (enabled in Phase 9 - Bookings)
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Spinner from '../components/common/Spinner'
import { fetchWorkerById } from '../services/workerService'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

const StarRating = ({ rating, total }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
    <span className="font-bold text-gray-900">{rating?.toFixed(1)}</span>
    <span className="text-gray-400 text-sm">({total} reviews)</span>
  </div>
)

const WorkerProfilePage = () => {
  const { id } = useParams()
  const [worker,  setWorker]  = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    setLoading(true)
    fetchWorkerById(id)
      .then(data => { setWorker(data.worker); setReviews(data.reviews || []) })
      .catch(() => setError('Could not load this worker profile.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center py-32"><Spinner size="lg" /></div>
    </MainLayout>
  )

  if (error || !worker) return (
    <MainLayout>
      <div className="page-container py-24 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile not found</h2>
        <Link to="/workers" className="btn-primary">Browse Professionals</Link>
      </div>
    </MainLayout>
  )

  const user = worker.user || {}
  const pricing = worker.pricing || []

  // Map service ID → price for quick lookup
  const priceMap = {}
  pricing.forEach(p => { priceMap[p.service?._id ?? p.service] = p })

  return (
    <MainLayout>
      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Sidebar ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Profile Card */}
            <div className="card text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                              flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 overflow-hidden">
                {user.profileImage
                  ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  : user.name?.[0]?.toUpperCase()
                }
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{worker.experience} years of experience</p>

              <div className="mt-3 flex justify-center">
                <StarRating rating={worker.rating} total={worker.totalReviews} />
              </div>
            </div>

            {/* Service Areas */}
            {worker.serviceAreas?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-3">📍 Service Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.serviceAreas.map(area => (
                    <span key={area} className="badge">{area}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {worker.skills?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-3">🛠️ Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map(skill => (
                    <span key={skill} className="badge bg-blue-50 text-blue-700">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">📅 Availability</h2>
              <div className="space-y-2">
                {DAYS.map(day => {
                  const avail = worker.availability?.[day]
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-gray-600 w-24">{day}</span>
                      {avail?.isAvailable
                        ? <span className="text-green-600 font-medium">
                            {avail.slots?.[0]
                              ? `${avail.slots[0].start} – ${avail.slots[0].end}`
                              : 'Available'}
                          </span>
                        : <span className="text-gray-300">Unavailable</span>
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {worker.bio && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
              </div>
            )}

            {/* Services & Pricing */}
            {worker.services?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services & Pricing</h2>
                <div className="space-y-3">
                  {worker.services.map(svc => {
                    const p = priceMap[svc._id]
                    return (
                      <div key={svc._id}
                        className="flex items-start justify-between p-3 rounded-xl bg-gray-50 gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{svc.name}</div>
                          {svc.category && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {svc.category.icon} {svc.category.name}
                            </div>
                          )}
                          {svc.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {svc.description}
                            </div>
                          )}
                        </div>
                        {p && (
                          <div className="text-right shrink-0">
                            <div className="text-blue-600 font-bold text-lg">
                              ₹{p.price.toLocaleString('en-IN')}
                            </div>
                            <div className="text-gray-400 text-xs mb-2">{p.unit}</div>
                            <Link to={`/book/${worker._id}/${svc._id}`} className="btn-primary py-1.5 px-3 text-xs inline-block">
                              Book Now
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reviews ({worker.totalReviews})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center
                                          justify-center text-blue-700 font-bold text-sm">
                            {review.customer?.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {review.customer?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                              fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default WorkerProfilePage
