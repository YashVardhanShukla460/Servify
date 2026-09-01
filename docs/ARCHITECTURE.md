# Servify — System Architecture

## High-Level Architecture

The application follows a classic 3-tier architecture:

```
TIER 1: Client (Browser)
  React + Vite + Tailwind CSS
  React Router, Redux Toolkit, Axios

TIER 2: Server (Node.js + Express)
  REST API, Auth Middleware, RBAC Middleware
  Controllers, Services, Validators

TIER 3: Database (MongoDB Atlas)
  Mongoose ODM
  Collections: users, workers, categories, services, bookings, reviews, addresses, notifications
```

---

## Request Lifecycle (How a request travels through the app)

```
HTTP Request from Browser
  |
  v
CORS Middleware        -- Is this request from an allowed origin?
  |
  v
Cookie Parser         -- Extract the JWT from the cookie
  |
  v
JSON Body Parser      -- Parse the request body
  |
  v
Route Matching        -- Which endpoint does this belong to?
  |
  v
Auth Middleware       -- Is the user logged in? Is the JWT valid?
  |
  v
Role Middleware       -- Is this user allowed to do this? (customer/worker/admin)
  |
  v
Validation            -- Is the data correct? (email format, required fields, etc.)
  |
  v
Controller            -- Handle the request (call the right service)
  |
  v
Service               -- Business logic (booking conflict checks, etc.)
  |
  v
Mongoose Model        -- Talk to MongoDB
  |
  v
JSON Response         -- Send data back to browser
  |
  (if anything fails)
  v
Error Handler         -- Catch error, send safe error response
```

---

## Frontend Architecture

```
client/src/
  assets/        Static files: images, icons, fonts
  components/    Reusable UI pieces (Button, Card, Modal, Spinner)
  pages/         Full page views (HomePage, LoginPage, BookingPage)
  layouts/       Shared page shells (CustomerLayout, WorkerLayout, AdminLayout)
  routes/        Route config + protected route guards
  hooks/         Custom React hooks (useAuth, useBookings)
  services/      Axios API functions (authService.js, bookingService.js)
  redux/         Redux store, slices, selectors
  utils/         Helper functions (formatDate, formatCurrency)
  features/      Feature-grouped code (auth/, booking/, services/)
```

---

## Backend Architecture

```
server/src/
  config/        DB connection, environment setup
  controllers/   Route handlers (authController, bookingController)
  middleware/    requireAuth, requireRole, errorHandler, validators
  models/        Mongoose schemas (User, Worker, Booking, etc.)
  routes/        Express route definitions
  services/      Business logic (bookingService, workerService)
  validators/    Input validation schemas
  utils/         JWT helpers, cookie helpers, response helpers
```

---

## Authentication Architecture

Registration:
```
  POST /api/auth/register
    -> Validate input
    -> Check email not taken
    -> Hash password (bcrypt, 12 rounds)
    -> Save User to MongoDB
    -> If worker: create Worker profile (status: pending)
    -> Generate JWT (payload: userId, role)
    -> Set JWT in HTTP-only cookie
    -> Return user data (no password)
```

Login:
```
  POST /api/auth/login
    -> Validate email + password
    -> Find user by email
    -> Compare password with bcrypt
    -> Generate JWT
    -> Set HTTP-only cookie
    -> Return user data
```

Protected routes:
```
  Any protected request
    -> Read cookie from headers
    -> Verify JWT with JWT_SECRET
    -> Decode userId and role
    -> Attach to req.user
    -> Pass to controller
```

---

## Authorization (RBAC)

```
  requireAuth          checks: JWT exists and is valid
  requireRole('admin') checks: user.role === 'admin'
  requireRole('worker') checks: user.role === 'worker'
  requireRole('customer') checks: user.role === 'customer'

  Example routes:
  POST /api/bookings       -> requireAuth, requireRole('customer'), createBooking
  PATCH /api/workers/approve -> requireAuth, requireRole('admin'), approveWorker
  GET  /api/worker/bookings -> requireAuth, requireRole('worker'), getWorkerBookings
```

---

## Booking Architecture

```
  Customer selects: service + worker + date + time + address
    |
    v
  POST /api/bookings
    |
    v
  Backend checks:
    1. Worker is approved?
    2. Worker is active?
    3. Service is active?
    4. Worker provides this service?
    5. Worker serves customer location?
    6. Date is in worker availability?
    7. Time slot is within worker hours?
    8. No conflicting booking at that time?
    |
    v (all pass)
  Create Booking (status: pending)
    |
    v
  Worker: Accept or Reject
    |
    v
  Booking status flow:
  pending -> accepted -> in_progress -> completed
          -> rejected
  pending/accepted -> cancelled
```

---

## Deployment Architecture

```
  Frontend: Vercel or Netlify (static React build)
  Backend:  Render or Railway (Node.js server)
  Database: MongoDB Atlas (cloud MongoDB)

  HTTPS everywhere.
  Environment variables stored in hosting platform dashboards.
  Never committed to Git.
```

---

## Environment Variables Strategy

```
  Development:
    client/.env  -> VITE_API_URL=http://localhost:5000
    server/.env  -> MONGO_URI, JWT_SECRET, CLIENT_URL, ...

  Production:
    Set directly in hosting platform (never in code)

  Always committed:
    .env.example -> variable names only, no real values

  Never committed:
    .env files with real credentials
```
