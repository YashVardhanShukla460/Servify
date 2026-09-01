/**
 * Redux Store — the single source of truth for global state
 *
 * WHAT: Redux is a state management library. The "store" holds
 *       all global state (data that multiple components need).
 *
 * WHY Redux Toolkit (RTK)?
 *   - Official, recommended way to use Redux
 *   - Much less boilerplate than plain Redux
 *   - Built-in tools like createSlice and createAsyncThunk
 *
 * WHAT goes in Redux?
 *   - auth (current logged-in user, role) — needed by Navbar, routes, every page
 *   - Not local UI state (form inputs, toggles) — those stay in useState
 */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    // Each key here becomes a "slice" of global state
    auth: authReducer,
    // We will add more slices as we build more features:
    // notifications: notificationsReducer,
  },
})

export default store
