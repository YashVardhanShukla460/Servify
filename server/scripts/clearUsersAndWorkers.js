import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../src/models/User.js'

dotenv.config()

async function run() {
  console.log('\nConnecting to MongoDB Atlas...')
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected!\n')

  const db = mongoose.connection.db

  // Delete all users EXCEPT admin
  const userResult = await User.deleteMany({ role: { $ne: 'admin' } })
  console.log('Non-admin users deleted:', userResult.deletedCount)

  // Delete all worker profiles
  const workerResult = await db.collection('workers').deleteMany({})
  console.log('Worker profiles deleted:', workerResult.deletedCount)

  // Also clear addresses (belong to users)
  const addrResult = await db.collection('addresses').deleteMany({})
  console.log('Addresses deleted:', addrResult.deletedCount)

  console.log('\nDone! Admin user is preserved.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
