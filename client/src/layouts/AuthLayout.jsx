/**
 * AuthLayout — wraps Login and Register pages
 *
 * Auth pages have a different look: centered card, no Footer.
 * We use a different layout to keep that separation clean.
 */

import { Link } from 'react-router-dom'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">

      {/* Simple header with just the logo */}
      <header className="py-6">
        <div className="page-container">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Servi<span className="text-blue-600">fy</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Centered auth form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

    </div>
  )
}

export default AuthLayout
