/**
 * ServicesPage — browse, search, filter, and sort all services
 *
 * WHAT: The main services listing page with full filter sidebar.
 *
 * Features:
 *   - Search by keyword
 *   - Filter by category
 *   - Filter by price range
 *   - Sort (price low-high, price high-low, newest, name A-Z)
 *   - Pagination
 *
 * Data flow:
 *   1. Page loads → fetch categories + services from backend
 *   2. User changes filters → update URL params → re-fetch
 *
 * WHY URL params for filters?
 *   The user can bookmark a filtered view (e.g. /services?category=x&sort=price_asc)
 *   and share it. Without URL params, filters are lost on refresh.
 */

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ServiceCard from '../components/common/ServiceCard'
import Spinner from '../components/common/Spinner'
import { fetchServices } from '../services/serviceService'
import { fetchCategories } from '../services/categoryService'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc',   label: 'Name: A to Z' },
]

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── State ──
  const [services,   setServices]   = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState('')

  // Read filters from URL — so the page restores its state on refresh/share
  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort:     searchParams.get('sort')     || 'newest',
    page:     Number(searchParams.get('page')) || 1,
  })

  // ── Fetch categories once on mount ──
  useEffect(() => {
    fetchCategories()
      .then(d => setCategories(d.categories))
      .catch(() => {})
  }, [])

  // ── Fetch services whenever filters change ──
  const loadServices = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      // Build params, stripping empty values
      const params = {}
      if (filters.search)   params.search   = filters.search
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      params.sort  = filters.sort
      params.page  = filters.page
      params.limit = 12

      const data = await fetchServices(params)
      setServices(data.services)
      setPagination(data.pagination)

      // Sync filters to URL
      setSearchParams(params)
    } catch {
      setError('Failed to load services. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [filters, setSearchParams])

  useEffect(() => { loadServices() }, [loadServices])

  // ── Filter handlers ──
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })) // Reset to page 1 on filter change
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })
  }

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice

  return (
    <MainLayout>
      <div className="page-container py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Services</h1>
          <p className="text-gray-500 mt-1">
            {pagination ? `${pagination.total} services available` : 'Browse all services'}
          </p>
        </div>

        <div className="flex gap-6">

          {/* ── Sidebar: Filters ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  placeholder="e.g. cleaning, electrical..."
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="form-label">Category</label>
                <select
                  value={filters.category}
                  onChange={e => updateFilter('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <label className="form-label">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number" placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                    className="input-field w-1/2"
                    min="0"
                  />
                  <input
                    type="number" placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="input-field w-1/2"
                    min="0"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="form-label">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="input-field"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile: search bar */}
            <div className="lg:hidden mb-4">
              <input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-24">
                <Spinner size="lg" />
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="text-center py-24">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={loadServices} className="btn-primary">Try Again</button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && services.length === 0 && (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
              </div>
            )}

            {/* Services Grid */}
            {!isLoading && !error && services.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {services.map(service => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                      disabled={!pagination.hasPrev}
                      className="btn-secondary px-4 py-2 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-gray-600 px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                      disabled={!pagination.hasNext}
                      className="btn-secondary px-4 py-2 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ServicesPage
