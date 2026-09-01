/**
 * HomePage — the landing page of Servify
 *
 * This is the first thing every visitor sees.
 * It shows: Hero section, service categories, how it works, CTA
 *
 * For now this is a static design. In Phase 7, we will fetch
 * real categories from the backend and display them here.
 */

import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// Placeholder categories (will come from backend in Phase 7)
const CATEGORIES = [
  { name: 'Cleaning', icon: '🧹', description: 'Home & office cleaning' },
  { name: 'Electrical', icon: '⚡', description: 'Wiring & repairs' },
  { name: 'Plumbing', icon: '🔧', description: 'Pipes & fixtures' },
  { name: 'AC Repair', icon: '❄️', description: 'Service & installation' },
  { name: 'Carpentry', icon: '🪚', description: 'Furniture & woodwork' },
  { name: 'Painting', icon: '🖌️', description: 'Interior & exterior' },
  { name: 'Beauty', icon: '💅', description: 'Salon at home' },
  { name: 'Tutoring', icon: '📚', description: 'Academic support' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose a Service',
    description: 'Browse our wide range of home services and pick what you need.',
  },
  {
    step: '02',
    title: 'Select a Professional',
    description: 'View profiles, ratings, and reviews. Pick the right person for the job.',
  },
  {
    step: '03',
    title: 'Book & Relax',
    description: 'Pick a date and time. We handle the rest.',
  },
]

const HomePage = () => {
  return (
    <MainLayout>

      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="page-container py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Home Services,{' '}
              <span className="text-yellow-300">On Demand</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Book trusted, verified professionals for cleaning, repairs, beauty,
              tutoring, and more — right at your doorstep.
            </p>

            {/* Search Bar Placeholder */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 px-5 py-3.5 rounded-xl text-gray-800 placeholder:text-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
              <Link
                to="/services"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold 
                           px-6 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                Search Services
              </Link>
            </div>

            <p className="text-blue-200 text-sm mt-4">
              ✓ Verified professionals &nbsp;&nbsp; ✓ Transparent pricing &nbsp;&nbsp; ✓ Guaranteed quality
            </p>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Service Professionals' },
              { value: '10,000+', label: 'Bookings Completed' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '15+', label: 'Service Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Find the right professional for your need</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/services"
                className="card hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5
                           transition-all duration-200 text-center group cursor-pointer"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Servify Works</h2>
            <p className="text-gray-500 mt-2">Three simple steps to get your service done</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center 
                                mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 bg-blue-600">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Join thousands of happy customers. Book your first service today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-blue-600 font-semibold 
                                           px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Book a Service
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-semibold 
                                           px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Become a Professional
            </Link>
          </div>
        </div>
      </section>

    </MainLayout>
  )
}

export default HomePage
