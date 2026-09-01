/**
 * RegisterPage — user registration form
 *
 * Users select a role: customer or worker.
 * Worker registration will trigger the approval workflow (Phase 8).
 *
 * Static form for now. Phase 5 will wire up the backend.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Spinner from '../components/common/Spinner'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // default role
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic client-side validation (backend ALWAYS validates too)
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    setError('')

    // TODO (Phase 5): Call POST /api/auth/register here
    console.log('Register data:', formData)

    setTimeout(() => {
      setIsLoading(false)
      setError('Backend not connected yet. Coming in Phase 5!')
    }, 1000)
  }

  return (
    <AuthLayout>
      <div className="card shadow-lg">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-2">Join thousands using Servify today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 
                          rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Role Selection */}
          <div>
            <label className="form-label">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'customer', label: '🏠 Book Services', sub: 'As a Customer' },
                { value: 'worker', label: '🛠️ Offer Services', sub: 'As a Professional' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: option.value }))}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${formData.role === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium text-sm text-gray-800">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.sub}</div>
                </button>
              ))}
            </div>
            {formData.role === 'worker' && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 
                            rounded-lg px-3 py-2 mt-2">
                ⚠️ Worker accounts require admin approval before you can receive bookings.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="form-label">Full name</label>
            <input
              id="name" name="name" type="text"
              required placeholder="John Doe"
              value={formData.name} onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email" name="email" type="email"
              autoComplete="email" required placeholder="you@example.com"
              value={formData.email} onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password" name="password" type="password"
              required placeholder="At least 6 characters"
              value={formData.password} onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password"
              required placeholder="Repeat your password"
              value={formData.confirmPassword} onChange={handleChange}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
        </div>

      </div>
    </AuthLayout>
  )
}

export default RegisterPage
