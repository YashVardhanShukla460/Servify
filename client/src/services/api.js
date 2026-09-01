/**
 * Axios API Instance — centralized HTTP client
 *
 * WHAT is Axios?
 *   A library that makes HTTP requests (GET, POST, PATCH, DELETE)
 *   from the browser to our Express backend.
 *
 * WHY create an "instance" instead of using axios directly?
 *   Because we want EVERY request to automatically:
 *   1. Use the correct base URL (from env variable, not hardcoded)
 *   2. Send cookies (withCredentials: true — required for JWT cookies)
 *   3. Set Content-Type to JSON
 *
 * HOW to use it in other files:
 *   import api from '../services/api'
 *   const response = await api.post('/auth/login', { email, password })
 *   const response = await api.get('/services')
 */

import axios from 'axios'

const api = axios.create({
  // Base URL comes from the .env file: VITE_API_URL=http://localhost:5000
  // Never hardcode "http://localhost:5000" throughout the app
  baseURL: `${import.meta.env.VITE_API_URL}/api`,

  // CRITICAL: withCredentials = true means the browser will
  // send and receive HTTP-only cookies with every request.
  // Without this, authentication won't work.
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Response Interceptor
 * This runs AFTER every response comes back from the server.
 * Use case: if we get a 401 (Unauthorized), redirect to login.
 */
api.interceptors.response.use(
  // Success: just return the response
  (response) => response,

  // Error: check if it's a 401 (token expired / not logged in)
  (error) => {
    if (error.response?.status === 401) {
      // We'll handle this more robustly in Phase 5 (Authentication)
      // For now, just let the error propagate
    }
    return Promise.reject(error)
  }
)

export default api
