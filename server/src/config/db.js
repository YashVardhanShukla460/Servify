/**
 * Database Connection — connects to MongoDB via Mongoose
 *
 * WHAT is Mongoose?
 *   Mongoose is an ODM (Object-Document Mapper). It lets you define
 *   schemas and models for MongoDB documents, and validates data before saving.
 *
 * WHY put this in its own file?
 *   Separation of concerns. The server entry point (server.js) just calls
 *   connectDB() — it does not need to know HOW the connection works.
 *
 * NOTE: This file is created now but the actual MongoDB URI will be
 * configured in Phase 4 when we set up MongoDB Atlas.
 * For now, starting the server will show "MongoDB not connected" which is fine.
 */

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('[DB] MONGO_URI is not set. MongoDB connection skipped.')
      console.warn('[DB] This is expected in Phase 3. Set MONGO_URI in .env during Phase 4.')
      return
    }

    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`)
    // Exit the process — app cannot run without a database
    process.exit(1)
  }
}

export default connectDB
