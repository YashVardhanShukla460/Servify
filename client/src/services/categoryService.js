/**
 * categoryService.js — frontend API calls for categories
 *
 * WHAT: Functions that call the backend /api/categories endpoints.
 * HOW:  Uses the Axios instance from services/api.js (has baseURL + credentials).
 * WHERE: Used by HomePage and any page showing category lists.
 */

import api from './api'

// Get all active categories (for homepage grid, filter dropdowns, etc.)
export const fetchCategories = async () => {
  const { data } = await api.get('/categories')
  return data  // { success: true, categories: [...], count: 13 }
}

// Get a single category by ID
export const fetchCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`)
  return data
}
