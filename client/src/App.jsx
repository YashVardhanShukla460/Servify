/**
 * App.jsx — root component
 *
 * KEY RESPONSIBILITY: restore the user session on page load.
 *
 * PROBLEM: Redux state is in memory — it resets every time the page refreshes.
 * SOLUTION: On mount, call GET /api/auth/me.
 *   - If the HTTP-only cookie is still valid → server returns user → dispatch setCredentials
 *   - If no cookie or expired → server returns 401 → dispatch logout (isInitialized = true)
 *
 * This pattern is called "session hydration" or "auth bootstrapping".
 * Every serious React app with cookie auth does this.
 */

import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import api from './services/api'
import { setCredentials, logout } from './redux/slices/authSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Run once on app startup — restore session from cookie
    const restoreSession = async () => {
      try {
        const { data } = await api.get('/auth/me')
        dispatch(setCredentials({ user: data.user }))
      } catch {
        // 401 = not logged in. That is fine — just mark as initialized.
        dispatch(logout())
      }
    }

    restoreSession()
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
