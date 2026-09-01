/**
 * AppRoutes — defines all the routes (pages) of the application
 *
 * WHAT is React Router?
 *   React Router lets you show different components (pages) based on the URL,
 *   without reloading the browser. This is called "client-side routing."
 *
 * HOW it works:
 *   URL: /          → renders HomePage
 *   URL: /login     → renders LoginPage
 *   URL: /register  → renders RegisterPage
 *   URL: /anything-else → renders NotFoundPage (wildcard *)
 *
 * WHAT are "protected routes"?
 *   Some pages require the user to be logged in (e.g. /dashboard).
 *   We will add ProtectedRoute wrappers in Phase 6 (Authorization).
 *   For now, all routes are public.
 */

import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage       from '../pages/HomePage'
import LoginPage      from '../pages/LoginPage'
import RegisterPage   from '../pages/RegisterPage'
import ServicesPage   from '../pages/ServicesPage'
import WorkersPage    from '../pages/WorkersPage'
import NotFoundPage   from '../pages/NotFoundPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes — anyone can access */}
      <Route path="/"          element={<HomePage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/services"  element={<ServicesPage />} />
      <Route path="/workers"   element={<WorkersPage />} />

      {/*
        Protected routes will be added here in Phase 6:
        <Route path="/dashboard"         element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/worker/dashboard"  element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard"   element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      */}

      {/* 404 — catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
