/**
 * serviceService.js — frontend API calls for services
 *
 * WHAT: Functions that call the backend /api/services endpoints.
 * WHERE: Used by ServicesPage (browse) and HomePage (featured).
 *
 * PARAMS for fetchServices:
 *   search, category, minPrice, maxPrice, isFeatured, sort, page, limit
 */

import api from './api'

// Browse services with all filters and pagination
export const fetchServices = async (params = {}) => {
  const { data } = await api.get('/services', { params })
  return data  // { success: true, services: [...], pagination: {...} }
}

// Get featured services (for homepage)
export const fetchFeaturedServices = async () => {
  const { data } = await api.get('/services/featured')
  return data
}

// Get a single service by ID
export const fetchServiceById = async (id) => {
  const { data } = await api.get(`/services/${id}`)
  return data
}
