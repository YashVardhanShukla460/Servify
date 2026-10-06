/**
 * clearDB.js — Wipe all collections for a fresh start
 * Run with: node scripts/clearDB.js
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('MONGO_URI not found in .env')
  process.exit(1)
}

const collections = [
  'users',
  'workers',
  'addresses',
  'bookings',
  'reviews',
  'categories',
  'services',
  'notifications',
]

async function clearAll() {
  console.log('\nConnecting to MongoDB Atlas...')
  await mongoose.connect(MONGO_URI)
  console.log('Connected!\n')

  const db = mongoose.connection.db

  for (const name of collections) {
    try {
      const result = await db.collection(name).deleteMany({})
      console.log(`Cleared ${name}: deleted ${result.deletedCount} document(s)`)
    } catch (err) {
      console.log(`Skipped ${name}: ${err.message}`)
    }
  }

  console.log('\nAll collections cleared! Fresh start ready.')
  await mongoose.disconnect()
  process.exit(0)
}

clearAll().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
