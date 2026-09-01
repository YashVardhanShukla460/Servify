/**
 * NotFoundPage — 404 page
 * Shown when a user navigates to a URL that doesn't exist.
 */

import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="page-container py-24 text-center">
        <div className="text-8xl font-bold text-blue-100 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage
