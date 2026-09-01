# Servify — API Design

## Conventions

- Base URL (development): http://localhost:5000/api
- All requests/responses use JSON
- Authentication uses HTTP-only cookies (JWT)
- Errors always return: { success: false, message: "..." }
- Success always returns: { success: true, data: {...} }

---

## Auth Routes

### Register
POST /api/auth/register
Auth: None
Body: { name, email, password, role }
Response: { success, user }
Errors: 400 (validation), 409 (email exists)

### Login
POST /api/auth/login
Auth: None
Body: { email, password }
Response: { success, user }
Errors: 400, 401 (invalid credentials)

### Logout
POST /api/auth/logout
Auth: requireAuth
Body: None
Response: { success, message }

### Get Current User
GET /api/auth/me
Auth: requireAuth
Response: { success, user }

---

## User Routes

### Get All Users (Admin)
GET /api/users
Auth: requireAuth, requireRole('admin')
Query: ?page=1&limit=20&search=name
Response: { success, users, total, page }

### Suspend/Activate User (Admin)
PATCH /api/users/:id/status
Auth: requireAuth, requireRole('admin')
Body: { isActive: true/false }
Response: { success, user }

---

## Worker Routes

### Get All Workers (Public)
GET /api/workers
Auth: None
Query: ?city=Delhi&service=cleaning&rating=4&page=1
Response: { success, workers, total, page }

### Get Single Worker (Public)
GET /api/workers/:id
Auth: None
Response: { success, worker }

### Get My Worker Profile (Worker)
GET /api/workers/me
Auth: requireAuth, requireRole('worker')
Response: { success, worker }

### Update My Worker Profile (Worker)
PATCH /api/workers/me
Auth: requireAuth, requireRole('worker')
Body: { bio, experience, skills, serviceAreas, pricing }
Response: { success, worker }

### Set Availability (Worker)
PATCH /api/workers/me/availability
Auth: requireAuth, requireRole('worker')
Body: { monday: {...}, tuesday: {...}, ... }
Response: { success, worker }

### Approve/Reject Worker (Admin)
PATCH /api/workers/:id/status
Auth: requireAuth, requireRole('admin')
Body: { status: 'approved'/'rejected'/'suspended', reason }
Response: { success, worker }

---

## Category Routes

### Get All Categories (Public)
GET /api/categories
Auth: None
Response: { success, categories }

### Create Category (Admin)
POST /api/categories
Auth: requireAuth, requireRole('admin')
Body: { name, description, icon }
Response: { success, category }

### Update Category (Admin)
PATCH /api/categories/:id
Auth: requireAuth, requireRole('admin')
Body: { name, description, icon, isActive }
Response: { success, category }

---

## Service Routes

### Get All Services (Public)
GET /api/services
Auth: None
Query: ?search=cleaning&category=id&minPrice=100&maxPrice=500&rating=4&sort=price_asc&page=1&limit=10
Response: { success, services, total, page, totalPages }

### Get Single Service (Public)
GET /api/services/:id
Auth: None
Response: { success, service }

### Create Service (Admin)
POST /api/services
Auth: requireAuth, requireRole('admin')
Body: { name, description, category, basePrice, duration, image }
Response: { success, service }

### Update Service (Admin)
PATCH /api/services/:id
Auth: requireAuth, requireRole('admin')
Body: { name, description, basePrice, isActive, isFeatured }
Response: { success, service }

---

## Booking Routes

### Create Booking (Customer)
POST /api/bookings
Auth: requireAuth, requireRole('customer')
Body: { workerId, serviceId, addressId, date, startTime, endTime, notes }
Response: { success, booking }
Errors: 400 (validation), 409 (conflict/unavailable)

### Get My Bookings (Customer)
GET /api/bookings/my
Auth: requireAuth, requireRole('customer')
Query: ?status=upcoming&page=1
Response: { success, bookings, total }

### Get Worker Bookings (Worker)
GET /api/bookings/worker
Auth: requireAuth, requireRole('worker')
Query: ?status=pending&page=1
Response: { success, bookings, total }

### Get Single Booking
GET /api/bookings/:id
Auth: requireAuth (customer owns it OR worker is assigned OR admin)
Response: { success, booking }

### Update Booking Status (Worker)
PATCH /api/bookings/:id/status
Auth: requireAuth, requireRole('worker')
Body: { status: 'accepted'/'rejected'/'in_progress'/'completed' }
Response: { success, booking }

### Cancel Booking
PATCH /api/bookings/:id/cancel
Auth: requireAuth (customer or worker)
Body: { reason }
Response: { success, booking }

### Get All Bookings (Admin)
GET /api/bookings
Auth: requireAuth, requireRole('admin')
Query: ?status=pending&page=1
Response: { success, bookings, total }

---

## Review Routes

### Create Review (Customer - only after completed booking)
POST /api/reviews
Auth: requireAuth, requireRole('customer')
Body: { bookingId, rating, comment }
Response: { success, review }
Errors: 400 (not completed), 409 (already reviewed)

### Get Reviews for Worker (Public)
GET /api/reviews/worker/:workerId
Auth: None
Query: ?page=1&limit=10
Response: { success, reviews, total, averageRating }

### Get All Reviews (Admin)
GET /api/reviews
Auth: requireAuth, requireRole('admin')
Response: { success, reviews, total }

---

## Address Routes

### Get My Addresses (Customer)
GET /api/addresses
Auth: requireAuth, requireRole('customer')
Response: { success, addresses }

### Add Address (Customer)
POST /api/addresses
Auth: requireAuth, requireRole('customer')
Body: { label, addressLine1, addressLine2, city, state, pincode, isDefault }
Response: { success, address }

### Update Address (Customer)
PATCH /api/addresses/:id
Auth: requireAuth, requireRole('customer')
Body: { label, addressLine1, ... }
Response: { success, address }

### Delete Address (Customer)
DELETE /api/addresses/:id
Auth: requireAuth, requireRole('customer')
Response: { success, message }

---

## Notification Routes

### Get My Notifications
GET /api/notifications
Auth: requireAuth
Response: { success, notifications, unreadCount }

### Mark Notification as Read
PATCH /api/notifications/:id/read
Auth: requireAuth
Response: { success }

### Mark All as Read
PATCH /api/notifications/read-all
Auth: requireAuth
Response: { success }

---

## Admin Routes

### Get Dashboard Stats
GET /api/admin/stats
Auth: requireAuth, requireRole('admin')
Response: { success, stats: { totalUsers, totalWorkers, totalBookings, totalRevenue, ... } }

---

## Health Check

### Health Check (Public)
GET /api/health
Auth: None
Response: { success: true, message: "Servify API is running", timestamp }
