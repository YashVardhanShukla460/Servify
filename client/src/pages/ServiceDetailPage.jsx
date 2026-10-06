/**
 * ServiceDetailPage — shows a single service + all workers who offer it
 *
 * Route: /services/:id
 *
 * Flow:
 *   Load service details + fetch workers who offer this service
 *   Each worker card has a "Book Now" button -> /book/:workerId/:serviceId
 */
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from '../layouts/MainLayout'
import Spinner from '../components/common/Spinner'
import { fetchServiceById } from '../services/serviceService'
import { fetchWorkers } from '../services/workerService'

const StarRating = ({ rating, total }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= Math.round(rating || 0) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
    {total !== undefined && (
      <span className="text-sm text-gray-500 font-medium">
        {rating ? rating.toFixed(1) : 'New'} ({total} reviews)
      </span>
    )}
  </div>
)

const ServiceDetailPage = () => {
  const { id } = useParams()
  const { user } = useSelector(state => state.auth)

  const [service, setService] = useState(null)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, wRes] = await Promise.all([
          fetchServiceById(id),
          fetchWorkers({ service: id, limit: 20 }),
        ])
        setService(sRes.service)
        setWorkers(wRes.workers || [])
      } catch {
        setError('Failed to load service details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>
    </MainLayout>
  )

  if (error || !service) return (
    <MainLayout>
      <div className="text-center py-24">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-red-500 font-medium">{error || 'Service not found'}</p>
        <Link to="/services" className="btn-secondary mt-6 inline-block">← Back to Services</Link>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">

        {/* Hero banner */}
        <div className="bg-slate-900 text-white">
          <div className="page-container py-12">
            <Link to="/services" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Back to Services
            </Link>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon */}
              <div className="w-24 h-24 bg-blue-600/20 rounded-2xl flex items-center justify-center text-5xl shrink-0 border border-blue-500/20">
                {service.category?.icon || '🛠️'}
              </div>
              <div className="flex-1">
                <div className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
                  {service.category?.name}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{service.name}</h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{service.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <div className="bg-white/10 rounded-xl px-5 py-3 border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Starting at</div>
                    <div className="text-2xl font-bold text-white">
                      ₹{service.basePrice?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  {service.durationMinutes && (
                    <div className="bg-white/10 rounded-xl px-5 py-3 border border-white/10">
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Duration</div>
                      <div className="text-xl font-bold text-white">{service.durationMinutes} min</div>
                    </div>
                  )}
                  <div className="bg-white/10 rounded-xl px-5 py-3 border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Professionals</div>
                    <div className="text-xl font-bold text-white">{workers.length} available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workers list */}
        <div className="page-container py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Professionals
          </h2>
          <p className="text-gray-500 mb-6">
            {workers.length > 0
              ? `${workers.length} verified professional${workers.length > 1 ? 's' : ''} offer this service`
              : 'No professionals are currently offering this service.'}
          </p>

          {workers.length === 0 ? (
            <div className="card text-center py-20">
              <div className="text-5xl mb-4">👷</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No professionals yet</h3>
              <p className="text-gray-400 mb-6">Check back soon — professionals are being onboarded.</p>
              <Link to="/services" className="btn-secondary inline-block">Browse Other Services</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {workers.map(w => {
                // Find the custom price this worker set for this service
                const pricing = w.pricing?.find(p =>
                  p.service === id || p.service?._id === id
                )
                const price = pricing?.price ?? service.basePrice
                const unit  = pricing?.unit  ?? 'per visit'

                return (
                  <div key={w._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

                    {/* Worker header */}
                    <div className="p-5 flex items-center gap-4 border-b border-gray-50">
                      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden">
                        {w.user?.profileImage
                          ? <img src={w.user.profileImage} alt={w.user?.name} className="w-full h-full object-cover" />
                          : w.user?.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-lg truncate">{w.user?.name}</div>
                        <div className="text-sm text-gray-500">{w.experience || 0} yrs experience</div>
                        <StarRating rating={w.rating} total={w.totalReviews} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      {w.bio && (
                        <p className="text-sm text-gray-500 line-clamp-2">{w.bio}</p>
                      )}

                      {w.serviceAreas?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {w.serviceAreas.slice(0, 3).map(area => (
                            <span key={area} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              📍 {area}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Price</div>
                          <div className="text-xl font-bold text-blue-600">
                            ₹{price?.toLocaleString('en-IN')}
                            <span className="text-xs text-gray-400 font-normal ml-1">{unit}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/workers/${w._id}`}
                            className="btn-secondary py-2 px-3 text-sm"
                          >
                            Profile
                          </Link>
                          {user?.role === 'customer' ? (
                            <Link
                              to={`/book/${w._id}/${id}`}
                              className="btn-primary py-2 px-4 text-sm"
                            >
                              Book Now
                            </Link>
                          ) : !user ? (
                            <Link
                              to={`/login`}
                              className="btn-primary py-2 px-4 text-sm"
                            >
                              Login to Book
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default ServiceDetailPage
