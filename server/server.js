/**
 * server.js — Express application entry point
 *
 * WHAT:
 *   This file creates and configures the Express app,
 *   registers all middleware and routes, and starts the server.
 *
 * HOW the middleware stack works (order MATTERS):
 *
 *   Request
 *     |
 *     v
 *   cors()         ← Allow requests from the React frontend
 *     |
 *     v
 *   express.json() ← Parse JSON request bodies
 *     |
 *     v
 *   cookieParser() ← Read cookies (JWT lives here)
 *     |
 *     v
 *   Routes         ← Match the URL to the right handler
 *     |
 *     v
 *   notFound       ← If no route matched, create a 404 error
 *     |
 *     v
 *   errorHandler   ← Catch any error and send a safe JSON response
 */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'

// Routes
import healthRoutes   from './src/routes/healthRoutes.js'
import authRoutes     from './src/routes/authRoutes.js'
import userRoutes     from './src/routes/userRoutes.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import serviceRoutes  from './src/routes/serviceRoutes.js'
import workerRoutes   from './src/routes/workerRoutes.js'
import addressRoutes  from './src/routes/addressRoutes.js'

// Middleware
import notFound from './src/middleware/notFound.js'
import errorHandler from './src/middleware/errorHandler.js'

// ─── Load environment variables ───
// This MUST come before anything that uses process.env
dotenv.config()

// ─── Connect to MongoDB ───
// In Phase 3: skips gracefully because MONGO_URI is empty
// In Phase 4: actually connects to MongoDB Atlas
connectDB()

// ─── Create Express app ───
const app = express()

// ─── CORS Configuration ───
// WHAT is CORS?
//   Browsers block JavaScript from making requests to a DIFFERENT origin
//   (different domain or port) unless the server explicitly allows it.
//   Our React app (localhost:5173) wants to talk to Express (localhost:5000).
//   CORS middleware tells the browser: "yes, this is allowed."
//
// WHY 'credentials: true'?
//   Required for HTTP-only cookies to be sent cross-origin.
//   Without this, the browser strips cookies from cross-origin requests.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Parse JSON request bodies ───
// WHAT: Parses the body of incoming requests with Content-Type: application/json
// WHY:  Without this, req.body would be undefined
app.use(express.json({ limit: '10mb' }))

// ─── Parse URL-encoded bodies ───
// For form submissions (just in case — most of ours will be JSON)
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Parse Cookies ───
// WHAT: Reads cookies from incoming requests into req.cookies
// WHY:  Our JWT lives in an HTTP-only cookie. Without this, we can't read it.
app.use(cookieParser())

// ─── Routes ───
// Each route module handles a group of related endpoints.
// Pattern: /api/<resource>  ->  <resource>Routes

app.use('/api/health',     healthRoutes)
app.use('/api/auth',       authRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/services',   serviceRoutes)
app.use('/api/workers',    workerRoutes)
app.use('/api/addresses',  addressRoutes)

// Future routes (added as we build each phase):
// app.use('/api/users',         userRoutes)
// app.use('/api/workers',       workerRoutes)
// app.use('/api/categories',    categoryRoutes)
// app.use('/api/services',      serviceRoutes)
// app.use('/api/bookings',      bookingRoutes)
// app.use('/api/reviews',       reviewRoutes)
// app.use('/api/addresses',     addressRoutes)
// app.use('/api/notifications', notificationRoutes)
// app.use('/api/admin',         adminRoutes)

// ─── 404 Handler ───
// Catches requests to routes that don't exist
// MUST be registered AFTER all real routes
app.use(notFound)

// ─── Centralized Error Handler ───
// Catches errors passed via next(error) from any route or middleware
// MUST be the LAST middleware registered (4 parameters)
app.use(errorHandler)

// ─── Start Server ───
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('')
  console.log('╔════════════════════════════════════════╗')
  console.log('║         🚀 Servify API Server           ║')
  console.log('╠════════════════════════════════════════╣')
  console.log(`║  Port:    ${PORT}                          ║`)
  console.log(`║  Mode:    ${process.env.NODE_ENV || 'development'}               ║`)
  console.log(`║  Health:  http://localhost:${PORT}/api/health ║`)
  console.log('╚════════════════════════════════════════╝')
  console.log('')
})
