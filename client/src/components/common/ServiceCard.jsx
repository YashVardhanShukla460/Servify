import { Link } from 'react-router-dom'

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services?category=${service.category?._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden 
                    hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        
        {/* Placeholder Image Box */}
        <div className="h-44 bg-gray-50 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent z-10"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
            <span className="text-5xl mb-2">
              {service.category?.icon || '🛠️'}
            </span>
            <span className="text-sm font-medium tracking-wide uppercase opacity-70">
              {service.category?.name || 'Service'}
            </span>
          </div>

          {service.isFeatured && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm">
              Popular
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4 leading-relaxed">
            {service.description}
          </p>
          
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
            <div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Starting at</div>
              <div className="font-bold text-gray-900 text-lg">
                ₹{service.basePrice.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ServiceCard
