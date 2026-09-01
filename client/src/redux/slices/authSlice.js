/**
 * Auth Slice — manages authentication state globally
 *
 * WHAT is a "slice"?
 *   A slice is one piece of the Redux store. It defines:
 *   1. Initial state (what the data looks like at the start)
 *   2. Reducers (functions that update the state)
 *
 * HOW to read auth state in any component:
 *   const { user, isAuthenticated } = useSelector(state => state.auth)
 *
 * HOW to update auth state:
 *   const dispatch = useDispatch()
 *   dispatch(setCredentials({ user }))
 *   dispatch(logout())
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,           // The logged-in user object (name, email, role, etc.)
  isAuthenticated: false, // true when user is logged in
  isLoading: true,      // true while we check if user is still logged in (on page refresh)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called after successful login or register
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
    },

    // Called after logout
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },

    // Called while checking auth status on page load
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logout, setAuthLoading } = authSlice.actions
export default authSlice.reducer
