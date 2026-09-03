import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Spinner from '../components/common/Spinner'
import { fetchWorkerById } from '../services/workerService'
import { getWorkerReviews } from '../services/reviewService'

const StarRating = ({ rating, total }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-yellow-400 text-lg">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(rating || 0) ? '★' : <span className="text-gray-200">★</span>}
          </span>
        ))}
      </div>
      {total !== undefined && (
        <span className="text-sm font-medium text-gray-600">
          {rating ? rating.toFixed(1) : 'New'} ({total})
        </span>
      )}
    </div>
  )
}

const WorkerProfilePage = () => {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [wRes, rRes] = await Promise.all([
          fetchWorkerById(id),
          getWorkerReviews(id)
        ])
        setWorker(wRes.worker)
        setReviews(rRes.reviews)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    )
  }

  if (error || !worker) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-red-500 font-medium">
          {error || 'Worker not found'}
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="page-container max-w-5xl">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Basic Info & Profile Card */}
            <div className="space-y-6">
              <div className="card text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-blue-600 rounded-t-xl -z-0"></div>
                
                <div className="relative z-10 pt-10">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    {worker.user?.profileImage ? (
                      <img src={worker.user.profileImage} alt={worker.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-300">
                        {worker.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-xl font-bold text-gray-900 mt-4">{worker.user?.name}</h1>
                  <p className="text-gray-500 text-sm mt-1">{worker.experience} years experience</p>
                  
                  <div className="mt-3 flex justify-center">
                    <StarRating rating={worker.rating} total={worker.totalReviews} />
                  </div>
                </div>

                {/* Service Areas */}
                <div className="mt-6 border-t border-gray-100 pt-5 text-left">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.serviceAreas?.map(area => (
                      <span key={area} className="badge bg-gray-100 text-gray-700">📍 {area}</span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-6 border-t border-gray-100 pt-5 text-left">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills?.map(skill => (
                      <span key={skill} className="badge bg-blue-50 text-blue-700 border border-blue-100">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio, Services & Reviews */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Bio */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About Me</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {worker.bio || 'This professional has not added a bio yet.'}
                </p>
              </div>

              {/* Services Offered */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h2>
                {worker.services?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No services listed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {worker.services?.map(svc => {
                      const p = worker.pricing?.find(pr => pr.service === svc._id)
                      return (
                        <div key={svc._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                          <div>
                            <h3 className="font-semibold text-gray-900">{svc.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{svc.description}</p>
                          </div>
                          {p && (
                            <div className="text-right shrink-0 ml-4">
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
                )}
              </div>

              {/* Reviews Section */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No reviews yet.</p>
                    <p className="text-sm mt-1">Book this professional to be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map(r => (
                      <div key={r._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                              {r.customer?.name?.[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{r.customer?.name}</div>
                              <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <StarRating rating={r.rating} />
                        </div>
                        {r.comment && <p className="text-gray-700 text-sm mt-2">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default WorkerProfilePage
