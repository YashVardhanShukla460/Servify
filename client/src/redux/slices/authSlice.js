/**
 * authSlice — Redux state for authentication
 *
 * State shape:
 *   user:          object | null  — the logged-in user's data
 *   isLoading:     boolean        — true during login/register API call
 *   isInitialized: boolean        — true after the initial session check on app load
 *
 * WHY isInitialized?
 *   On page refresh, Redux resets to { user: null }.
 *   But the HTTP-only cookie still exists in the browser.
 *   App.jsx calls GET /api/auth/me on startup to restore the session.
 *   Until that check is done, isInitialized = false.
 *   ProtectedRoute uses this to show a spinner instead of redirecting to login.
 */

import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:          null,
    isLoading:     false,
    isInitialized: false,   // becomes true after first /api/auth/me check
  },
  reducers: {
    // Called after successful login, register, or session restore
    setCredentials: (state, action) => {
      state.user          = action.payload.user
      state.isInitialized = true
      state.isLoading     = false
    },
    // Called after logout OR when /api/auth/me returns 401 (no session)
    logout: (state) => {
      state.user          = null
      state.isInitialized = true
      state.isLoading     = false
    },
    // Called while a login/register API call is in progress
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logout, setAuthLoading } = authSlice.actions
export default authSlice.reducer
