/**
 * HomePage — Servify landing page
 *
 * Data fetched from backend:
 *   - Categories (for the category grid)
 *   - Featured services (for the "Popular Services" section)
 *
 * Static sections:
 *   - Hero
 *   - Stats bar
 *   - How It Works
 *   - CTA
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ServiceCard from '../components/common/ServiceCard'
import Spinner from '../components/common/Spinner'
import { fetchCategories } from '../services/categoryService'
import { fetchFeaturedServices } from '../services/serviceService'

const HomePage = () => {
  const navigate = useNavigate()
  const [categories,        setCategories]        = useState([])
  const [featuredServices,  setFeaturedServices]  = useState([])
  const [loadingCats,       setLoadingCats]       = useState(true)
  const [loadingSvcs,       setLoadingSvcs]       = useState(true)

  // Fetch categories and featured services in parallel
  useEffect(() => {
    fetchCategories()
      .then(d => setCategories(d.categories || []))
      .catch(() => {})
      .finally(() => setLoadingCats(false))

    fetchFeaturedServices()
      .then(d => setFeaturedServices(d.services || []))
      .catch(() => {})
      .finally(() => setLoadingSvcs(false))
  }, [])

  return (
    <MainLayout>

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="page-container py-20 text-center">
          <div className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1.5
                          rounded-full border border-white/20 mb-6">
            🚀 Trusted by 50,000+ households across India
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Home Services,<br />
            <span className="text-blue-200">Done Right.</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Book verified professionals for cleaning, electrical, plumbing, beauty, tutoring and more.
          </p>
          
          {/* Global Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              const q = e.target.search.value.trim()
              if (q) navigate(`/services?search=${encodeURIComponent(q)}`)
            }} 
            className="max-w-2xl mx-auto mb-10 flex bg-white rounded-xl shadow-lg overflow-hidden p-1">
            <input 
              name="search"
              type="text" 
              placeholder="Search for 'AC Repair', 'Plumber', 'Sofa Cleaning'..." 
              className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn-primary bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-base">
              Browse Services
            </Link>
            <Link to="/register" className="btn-secondary border-white text-white hover:bg-white/10 px-8 py-3 text-base">
              Become a Professional
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50K+',  label: 'Happy Customers' },
              { value: '5K+',   label: 'Verified Professionals' },
              { value: '13',    label: 'Service Categories' },
              { value: '4.8★',  label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="bg-gray-50 py-16">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What do you need?</h2>
            <p className="text-gray-500 mt-2">Choose from {categories.length || 13} service categories</p>
          </div>

          {loadingCats ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/services?category=${cat._id}`}
                  className="card text-center hover:shadow-md hover:border-blue-200 border-2 border-transparent
                             transition-all duration-200 group cursor-pointer"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured / Popular Services ── */}
      <section className="bg-white py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
              <p className="text-gray-500 mt-1">Most booked by our customers</p>
            </div>
            <Link to="/services?isFeatured=true" className="btn-secondary text-sm hidden sm:inline-flex">
              View All →
            </Link>
          </div>

          {loadingSvcs ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredServices.slice(0, 8).map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-blue-50 py-16">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Servify Works</h2>
            <p className="text-gray-500 mt-2">Book a professional in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Browse & Select', desc: 'Choose from 13 categories and 40+ services. Filter by price, rating, and availability.' },
              { step: '2', icon: '📅', title: 'Book & Pay',       desc: 'Pick your time slot, add your address, and confirm your booking in seconds.' },
              { step: '3', icon: '⭐', title: 'Relax & Review',   desc: 'Our vetted professional arrives on time. Rate your experience after the job.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center
                                text-2xl mx-auto mb-4 shadow-lg">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: Become a Professional ── */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a Service Professional?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join Servify and get access to thousands of customers in your city.
            Set your own schedule, earn more.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Join as a Professional →
          </Link>
        </div>
      </section>

    </MainLayout>
  )
}

export default HomePage
