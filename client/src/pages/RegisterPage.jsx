/**
 * RegisterPage — calls the real backend API
 *
 * On success:
 *   1. dispatch setCredentials
 *   2. navigate to /dashboard or /dashboard/worker based on role
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthLayout from '../layouts/AuthLayout'
import Spinner from '../components/common/Spinner'
import api from '../services/api'
import { setCredentials } from '../redux/slices/authSlice'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form,      setForm]      = useState({ name: '', email: '', password: '', role: 'customer' })
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      dispatch(setCredentials({ user: data.user }))

      if (data.user.role === 'worker') navigate('/dashboard/worker')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of happy Servify customers">
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
          {['customer', 'worker'].map(r => (
            <button key={r} type="button"
              onClick={() => setForm(p => ({ ...p, role: r }))}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                form.role === r
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              {r === 'customer' ? '🏠 I need services' : '🛠️ I offer services'}
            </button>
          ))}
        </div>

        <div>
          <label className="form-label">Full name</label>
          <input
            name="name" type="text" required autoComplete="name"
            value={form.name} onChange={handleChange}
            className="input-field" placeholder="John Doe"
          />
        </div>

        <div>
          <label className="form-label">Email address</label>
          <input
            name="email" type="email" required autoComplete="email"
            value={form.email} onChange={handleChange}
            className="input-field" placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="form-label">Password</label>
          <input
            name="password" type="password" required autoComplete="new-password"
            value={form.password} onChange={handleChange}
            className="input-field" placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
          {isLoading ? <><Spinner size="sm" /> Creating account...</> : 'Create Account'}
        </button>

        {form.role === 'worker' && (
          <p className="text-xs text-gray-400 text-center">
            Worker accounts need admin approval before receiving bookings.
          </p>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
