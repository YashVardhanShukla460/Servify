/**
 * ServiceCard — displays a single service in a card layout
 *
 * WHAT: Reusable card component for any list of services.
 * WHERE: Used in ServicesPage grid and HomePage featured section.
 *
 * Props:
 *   service — the full service object from the API
 */

import { Link } from 'react-router-dom'

const ServiceCard = ({ service }) => {
  return (
    <Link
      to={`/services/${service._id}`}
      className="card hover:shadow-lg transition-shadow duration-200 group flex flex-col"
    >
      {/* Service image or emoji placeholder */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-4
                      flex items-center justify-center text-5xl overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span>{service.category?.icon || '🛠️'}</span>
        )}
      </div>

      {/* Category badge */}
      {service.category && (
        <span className="badge mb-2 self-start">
          {service.category.icon} {service.category.name}
        </span>
      )}

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600
                     transition-colors line-clamp-2 mb-1">
        {service.name}
      </h3>

      {/* Description */}
      {service.description && (
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
          {service.description}
        </p>
      )}

      {/* Footer: price + duration */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400">Starting at</span>
          <div className="text-blue-600 font-bold text-lg">
            ₹{service.basePrice.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">Duration</span>
          <div className="text-gray-700 text-sm font-medium">
            {service.duration >= 60
              ? `${Math.floor(service.duration / 60)}h${service.duration % 60 ? ` ${service.duration % 60}m` : ''}`
              : `${service.duration}m`}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ServiceCard
