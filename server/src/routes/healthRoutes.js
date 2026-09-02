/**
 * Health Route — GET /api/health
 *
 * WHAT:
 *   A simple endpoint that returns server status.
 *   It is the first route we test to confirm the backend is alive.
 *
 * WHY:
 *   - Verifies the server is running
 *   - Used by deployment platforms to check if the app is healthy
 *   - Great first endpoint to test before building anything else
 *
 * HOW to test it:
 *   Open Postman or your browser and visit:
 *   GET http://localhost:5000/api/health
 *
 *   Expected response:
 *   {
 *     "success": true,
 *     "message": "Servify API is running",
 *     "environment": "development",
 *     "timestamp": "2026-09-02T..."
 *   }
 */

import express from 'express'

const router = express.Router()

// GET /api/health
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servify API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

export default router
