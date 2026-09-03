/**
 * WorkersPage — browse all approved service professionals
 *
 * Filters:
 *   - Search by area
 *   - Filter by service
 *   - Filter by minimum rating
 *   - Sort by rating (default), newest, price
 */
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import WorkerCard from '../components/common/WorkerCard'
import Spinner from '../components/common/Spinner'
import { fetchWorkers } from '../services/workerService'
import { fetchCategories } from '../services/categoryService'
import { fetchServices } from '../services/serviceService'

const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'newest',      label: 'Newest First' },
]

const WorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [workers,    setWorkers]    = useState([])
  const [services,   setServices]   = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState('')

  const [filters, setFilters] = useState({
    area:      searchParams.get('area')      || '',
    service:   searchParams.get('service')   || '',
    minRating: searchParams.get('minRating') || '',
    sort:      searchParams.get('sort')      || 'rating_desc',
    page:      Number(searchParams.get('page')) || 1,
  })

  // Load all services for the filter dropdown
  useEffect(() => {
    fetchServices({ limit: 50 }).then(d => setServices(d.services || [])).catch(() => {})
  }, [])

  const loadWorkers = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const params = {}
      if (filters.area)      params.area      = filters.area
      if (filters.service)   params.service   = filters.service
      if (filters.minRating) params.minRating = filters.minRating
      params.sort  = filters.sort
      params.page  = filters.page
      params.limit = 12

      const data = await fetchWorkers(params)
      setWorkers(data.workers)
      setPagination(data.pagination)
      setSearchParams(params)
    } catch {
      setError('Failed to load professionals. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [filters, setSearchParams])

  useEffect(() => { loadWorkers() }, [loadWorkers])

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

  const clearFilters = () =>
    setFilters({ area: '', service: '', minRating: '', sort: 'rating_desc', page: 1 })

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Professionals</h1>
          <p className="text-gray-500 mt-1">
            {pagination ? `${pagination.total} verified professionals` : 'Browse all professionals'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
                  Clear all
                </button>
              </div>

              <div className="mb-5">
                <label className="form-label">Search by Area</label>
                <input
                  type="text" placeholder="e.g. Noida, Gurgaon..."
                  value={filters.area}
                  onChange={e => updateFilter('area', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="mb-5">
                <label className="form-label">Service</label>
                <select
                  value={filters.service}
                  onChange={e => updateFilter('service', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Services</option>
                  {services.map(svc => (
                    <option key={svc._id} value={svc._id}>{svc.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="form-label">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={e => updateFilter('minRating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
                  <option value="4">4.0+ ⭐⭐⭐⭐</option>
                  <option value="3">3.0+ ⭐⭐⭐</option>
                </select>
              </div>

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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <input
                type="text" placeholder="Search by area..."
                value={filters.area}
                onChange={e => updateFilter('area', e.target.value)}
                className="input-field"
              />
            </div>

            {isLoading && <div className="flex justify-center py-24"><Spinner size="lg" /></div>}

            {!isLoading && error && (
              <div className="text-center py-24">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={loadWorkers} className="btn-primary">Retry</button>
              </div>
            )}

            {!isLoading && !error && workers.length === 0 && (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">👷</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search a different area.</p>
                <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
              </div>
            )}

            {!isLoading && !error && workers.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {workers.map(worker => <WorkerCard key={worker._id} worker={worker} />)}
                </div>

                {pagination?.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                      disabled={!pagination.hasPrev}
                      className="btn-secondary px-4 py-2 disabled:opacity-40"
                    >← Prev</button>
                    <span className="text-sm text-gray-600 px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                      disabled={!pagination.hasNext}
                      className="btn-secondary px-4 py-2 disabled:opacity-40"
                    >Next →</button>
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

export default WorkersPage
