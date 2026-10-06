/**
 * seedAdmin.js — Create the default admin account
 * Run with: node scripts/seedAdmin.js
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../src/models/User.js'

dotenv.config()

async function seedAdmin() {
  console.log('\nConnecting to MongoDB Atlas...')
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected!\n')

  const existing = await User.findOne({ email: 'admin@servify.com' })
  if (existing) {
    console.log('Admin already exists: admin@servify.com')
    await mongoose.disconnect()
    process.exit(0)
  }

  const admin = await User.create({
    name: 'Servify Admin',
    email: 'admin@servify.com',
    password: 'admin123456',
    role: 'admin',
    phone: '9999999999',
  })

  console.log('Admin created successfully!')
  console.log('  Email   : admin@servify.com')
  console.log('  Password: admin123456')
  console.log('  Role    : admin')
  console.log('  ID      :', admin._id.toString())

  await mongoose.disconnect()
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
