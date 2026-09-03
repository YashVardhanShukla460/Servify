/**
 * AppRoutes — all application routes
 *
 * Route types:
 *   Public:    anyone can visit (home, services, workers, login, register)
 *   Protected: must be logged in (ProtectedRoute redirects to /login if not)
 *   Role-gated: must have correct role (RoleRoute redirects to / if wrong role)
 */

import { Routes, Route } from 'react-router-dom'

// Auth guards
import ProtectedRoute from '../components/auth/ProtectedRoute'
import RoleRoute      from '../components/auth/RoleRoute'

// Public pages
import HomePage          from '../pages/HomePage'
import LoginPage         from '../pages/LoginPage'
import RegisterPage      from '../pages/RegisterPage'
import ServicesPage      from '../pages/ServicesPage'
import WorkersPage       from '../pages/WorkersPage'
import WorkerProfilePage from '../pages/WorkerProfilePage'
import BookingPage       from '../pages/BookingPage'
import NotFoundPage      from '../pages/NotFoundPage'

// Customer dashboard
import DashboardPage  from '../pages/dashboard/DashboardPage'
import ProfilePage    from '../pages/dashboard/ProfilePage'
import AddressesPage  from '../pages/dashboard/AddressesPage'

// Worker dashboard
import WorkerDashboardPage    from '../pages/dashboard/worker/WorkerDashboardPage'
import WorkerBookingsPage     from '../pages/dashboard/worker/WorkerBookingsPage'
import WorkerProfileEditPage  from '../pages/dashboard/worker/WorkerProfileEditPage'
import WorkerAvailabilityPage from '../pages/dashboard/worker/WorkerAvailabilityPage'
import WorkerPricingPage      from '../pages/dashboard/worker/WorkerPricingPage'

const AppRoutes = () => {
  return (
    <Routes>

      {/* ── Public routes ── */}
      <Route path="/"            element={<HomePage />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<RegisterPage />} />
      <Route path="/services"    element={<ServicesPage />} />
      <Route path="/workers"     element={<WorkersPage />} />
      <Route path="/workers/:id" element={<WorkerProfilePage />} />

      <Route path="/book/:workerId/:serviceId" element={
        <ProtectedRoute>
          <RoleRoute role="customer">
            <BookingPage />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* ── Customer dashboard (requires login + customer role) ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleRoute role="customer">
            <DashboardPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/profile" element={
        <ProtectedRoute>
          <RoleRoute role="customer">
            <ProfilePage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/addresses" element={
        <ProtectedRoute>
          <RoleRoute role="customer">
            <AddressesPage />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* ── Worker dashboard (requires login + worker role) ── */}
      <Route path="/dashboard/worker" element={
        <ProtectedRoute>
          <RoleRoute role="worker">
            <WorkerDashboardPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/worker/bookings" element={
        <ProtectedRoute>
          <RoleRoute role="worker">
            <WorkerBookingsPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/worker/profile" element={
        <ProtectedRoute>
          <RoleRoute role="worker">
            <WorkerProfileEditPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/worker/availability" element={
        <ProtectedRoute>
          <RoleRoute role="worker">
            <WorkerAvailabilityPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/worker/pricing" element={
        <ProtectedRoute>
          <RoleRoute role="worker">
            <WorkerPricingPage />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default AppRoutes
