/**
 * LoginPage — calls the real backend API
 *
 * On success:
 *   1. dispatch setCredentials → Redux stores the user
 *   2. navigate to /dashboard (the user is now logged in)
 *
 * On error:
 *   Show the error message from the server (e.g. "Invalid email or password")
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthLayout from '../layouts/AuthLayout'
import Spinner from '../components/common/Spinner'
import api from '../services/api'
import { setCredentials } from '../redux/slices/authSlice'

const LoginPage = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const [form,      setForm]      = useState({ email: '', password: '' })
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)
      dispatch(setCredentials({ user: data.user }))

      // Redirect based on role
      if (data.user.role === 'worker') navigate('/dashboard/worker')
      else if (data.user.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your Servify account">
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

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
            name="password" type="password" required autoComplete="current-password"
            value={form.password} onChange={handleChange}
            className="input-field" placeholder="Your password"
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
          {isLoading ? <><Spinner size="sm" /> Logging in...</> : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
