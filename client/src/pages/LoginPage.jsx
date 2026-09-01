/**
 * LoginPage — user login form
 *
 * For now: static form with UI only.
 * In Phase 5 (Authentication), this will actually call POST /api/auth/login
 * and store the JWT cookie.
 *
 * Uses local React state (useState) for the form — NOT Redux.
 * Why? Form data is local to this page. Redux is for data that multiple
 * components need simultaneously.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Spinner from '../components/common/Spinner'

const LoginPage = () => {
  // Local state for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Local state for UI feedback
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Update form field when user types
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('') // Clear error when user starts typing
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload (default form behavior)
    setIsLoading(true)
    setError('')

    // TODO (Phase 5): Call POST /api/auth/login here
    // For now, just simulate a delay
    console.log('Login data:', formData)

    setTimeout(() => {
      setIsLoading(false)
      setError('Backend not connected yet. Coming in Phase 5!')
    }, 1000)
  }

  return (
    <AuthLayout>
      <div className="card shadow-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-2">Log in to your Servify account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 
                          rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </button>

        </form>

        {/* Footer links */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </AuthLayout>
  )
}

export default LoginPage
