/**
 * WorkerCard — displays a worker in a card layout
 * Used in the WorkersPage browse grid.
 */
import { Link } from 'react-router-dom'

const StarRating = ({ rating, total }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-amber-400 font-bold">{rating?.toFixed(1) ?? '—'}</span>
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
    <span className="text-gray-400 text-xs">({total ?? 0})</span>
  </div>
)

const WorkerCard = ({ worker }) => {
  const user = worker.user || {}

  return (
    <Link
      to={`/workers/${worker._id}`}
      className="card hover:shadow-lg transition-shadow duration-200 group flex flex-col"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                        flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
          {user.profileImage
            ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            : user.name?.[0]?.toUpperCase() ?? '?'
          }
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {user.name}
          </h3>
          <p className="text-gray-500 text-xs">{worker.experience ?? 0} yrs experience</p>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={worker.rating} total={worker.totalReviews} />

      {/* Services */}
      {worker.services?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.services.slice(0, 3).map(svc => (
            <span key={svc._id} className="badge">{svc.name}</span>
          ))}
          {worker.services.length > 3 && (
            <span className="badge bg-gray-100 text-gray-500">+{worker.services.length - 3} more</span>
          )}
        </div>
      )}

      {/* Service areas */}
      {worker.serviceAreas?.length > 0 && (
        <p className="text-gray-400 text-xs mt-3">
          📍 {worker.serviceAreas.slice(0, 2).join(', ')}
          {worker.serviceAreas.length > 2 && ` +${worker.serviceAreas.length - 2} more`}
        </p>
      )}

      {/* Bio preview */}
      {worker.bio && (
        <p className="text-gray-500 text-sm mt-3 line-clamp-2 flex-1">{worker.bio}</p>
      )}

      {/* CTA */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="text-blue-600 text-sm font-medium group-hover:underline">
          View Profile →
        </span>
      </div>
    </Link>
  )
}

export default WorkerCard
