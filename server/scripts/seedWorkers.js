/**
 * Seed Workers — create sample approved worker accounts for testing
 *
 * Run: node scripts/seedWorkers.js
 *
 * Creates 6 workers across different categories.
 * Each worker has a User account + Worker profile (status: approved).
 * Passwords are hashed by the User pre-save hook automatically.
 */

import dotenv   from 'dotenv'
import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'
import User     from '../src/models/User.js'
import Worker   from '../src/models/Worker.js'
import Service  from '../src/models/Service.js'

dotenv.config()

const workerData = [
  {
    user: { name: 'Rajesh Kumar',    email: 'rajesh@worker.com', phone: '9876543210', role: 'worker' },
    profile: {
      bio:          'I have 8 years of experience in electrical work. Certified electrician from ITI Delhi.',
      experience:   8,
      skills:       ['Wiring', 'Fan installation', 'Switchboard repair', 'Inverter setup'],
      serviceAreas: ['Noida', 'Greater Noida', 'Delhi NCR'],
      rating:       4.8,
      totalReviews: 124,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
        tuesday:   { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
        wednesday: { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
        thursday:  { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
        friday:    { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
        saturday:  { isAvailable: true,  slots: [{ start: '10:00', end: '15:00' }] },
        sunday:    { isAvailable: false, slots: [] },
      },
    },
    serviceKeywords: ['Fan Installation', 'Switchboard Repair', 'Inverter & UPS Setup'],
  },
  {
    user: { name: 'Priya Sharma',    email: 'priya@worker.com',  phone: '9812345678', role: 'worker' },
    profile: {
      bio:          'Professional beauty therapist with 5 years of salon experience. Trained from VLCC.',
      experience:   5,
      skills:       ['Makeup', 'Hair spa', 'Facial', 'Manicure', 'Pedicure'],
      serviceAreas: ['Gurgaon', 'South Delhi', 'Faridabad'],
      rating:       4.9,
      totalReviews: 89,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true,  slots: [{ start: '10:00', end: '19:00' }] },
        tuesday:   { isAvailable: true,  slots: [{ start: '10:00', end: '19:00' }] },
        wednesday: { isAvailable: false, slots: [] },
        thursday:  { isAvailable: true,  slots: [{ start: '10:00', end: '19:00' }] },
        friday:    { isAvailable: true,  slots: [{ start: '10:00', end: '19:00' }] },
        saturday:  { isAvailable: true,  slots: [{ start: '09:00', end: '20:00' }] },
        sunday:    { isAvailable: true,  slots: [{ start: '09:00', end: '18:00' }] },
      },
    },
    serviceKeywords: ['Bridal Makeup', 'Facial & Cleanup', 'Manicure & Pedicure', 'Hair Spa'],
  },
  {
    user: { name: 'Suresh Plumber',  email: 'suresh@worker.com', phone: '9871234560', role: 'worker' },
    profile: {
      bio:          'Expert plumber for all types of leakage, fitting, and bathroom work. 10+ years.',
      experience:   10,
      skills:       ['Pipe fitting', 'Leak detection', 'Bathroom installation', 'Tank cleaning'],
      serviceAreas: ['Noida', 'Noida Extension', 'Indirapuram'],
      rating:       4.6,
      totalReviews: 201,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true, slots: [{ start: '08:00', end: '17:00' }] },
        tuesday:   { isAvailable: true, slots: [{ start: '08:00', end: '17:00' }] },
        wednesday: { isAvailable: true, slots: [{ start: '08:00', end: '17:00' }] },
        thursday:  { isAvailable: true, slots: [{ start: '08:00', end: '17:00' }] },
        friday:    { isAvailable: true, slots: [{ start: '08:00', end: '17:00' }] },
        saturday:  { isAvailable: true, slots: [{ start: '08:00', end: '13:00' }] },
        sunday:    { isAvailable: false, slots: [] },
      },
    },
    serviceKeywords: ['Tap & Faucet Repair', 'Pipe Leakage Fix', 'Bathroom Fitting', 'Water Tank Cleaning'],
  },
  {
    user: { name: 'Anita Cleaning',  email: 'anita@worker.com',  phone: '9856781234', role: 'worker' },
    profile: {
      bio:          'Professional home cleaner. I use eco-friendly products and give your home a fresh feel.',
      experience:   4,
      skills:       ['Deep cleaning', 'Bathroom cleaning', 'Sofa cleaning', 'Kitchen cleaning'],
      serviceAreas: ['Dwarka', 'Rohini', 'Pitampura', 'West Delhi'],
      rating:       4.7,
      totalReviews: 156,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        tuesday:   { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        wednesday: { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        thursday:  { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        friday:    { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        saturday:  { isAvailable: true, slots: [{ start: '10:00', end: '16:00' }] },
        sunday:    { isAvailable: false, slots: [] },
      },
    },
    serviceKeywords: ['Deep Home Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning', 'Sofa & Carpet Cleaning'],
  },
  {
    user: { name: 'Amit Tutor',      email: 'amit@worker.com',   phone: '9823456789', role: 'worker' },
    profile: {
      bio:          'IIT graduate with 6 years of home tutoring experience. Specialise in Math and Science for Class 6-12.',
      experience:   6,
      skills:       ['Mathematics', 'Physics', 'Chemistry', 'Coding', 'Problem solving'],
      serviceAreas: ['Vasant Kunj', 'Saket', 'South Delhi', 'Gurgaon'],
      rating:       5.0,
      totalReviews: 43,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true, slots: [{ start: '16:00', end: '20:00' }] },
        tuesday:   { isAvailable: true, slots: [{ start: '16:00', end: '20:00' }] },
        wednesday: { isAvailable: true, slots: [{ start: '16:00', end: '20:00' }] },
        thursday:  { isAvailable: true, slots: [{ start: '16:00', end: '20:00' }] },
        friday:    { isAvailable: true, slots: [{ start: '16:00', end: '20:00' }] },
        saturday:  { isAvailable: true, slots: [{ start: '09:00', end: '18:00' }] },
        sunday:    { isAvailable: true, slots: [{ start: '10:00', end: '14:00' }] },
      },
    },
    serviceKeywords: ['Math Tutoring (K-12)', 'Coding for Kids'],
  },
  {
    user: { name: 'Chef Vikram',     email: 'vikram@worker.com', phone: '9834567890', role: 'worker' },
    profile: {
      bio:          'Trained chef from a 5-star hotel background. Specialise in Indian, Chinese, and Continental.',
      experience:   12,
      skills:       ['Indian cuisine', 'Continental', 'Chinese', 'Party catering', 'Meal prep'],
      serviceAreas: ['South Delhi', 'Central Delhi', 'Gurgaon', 'Noida'],
      rating:       4.9,
      totalReviews: 67,
      status:       'approved',
      availability: {
        monday:    { isAvailable: true, slots: [{ start: '07:00', end: '21:00' }] },
        tuesday:   { isAvailable: true, slots: [{ start: '07:00', end: '21:00' }] },
        wednesday: { isAvailable: true, slots: [{ start: '07:00', end: '21:00' }] },
        thursday:  { isAvailable: true, slots: [{ start: '07:00', end: '21:00' }] },
        friday:    { isAvailable: true, slots: [{ start: '07:00', end: '21:00' }] },
        saturday:  { isAvailable: true, slots: [{ start: '07:00', end: '22:00' }] },
        sunday:    { isAvailable: true, slots: [{ start: '07:00', end: '22:00' }] },
      },
    },
    serviceKeywords: ['Party Catering (20 pax)', 'Daily Tiffin Cook'],
  },
]

async function seedWorkers() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB\n')

  // Remove existing seeded workers
  const emails = workerData.map(w => w.user.email)
  const users  = await User.find({ email: { $in: emails } })
  const userIds = users.map(u => u._id)
  await Worker.deleteMany({ user: { $in: userIds } })
  await User.deleteMany({ email: { $in: emails } })
  console.log('Cleared old seeded workers')

  // Get all services for linking
  const allServices = await Service.find({}).lean()
  const serviceByName = {}
  for (const svc of allServices) { serviceByName[svc.name] = svc._id }

  let count = 0
  for (const data of workerData) {
    // Create user (password hashed by pre-save hook)
    const user = await User.create({ ...data.user, password: 'worker123' })

    // Match services by keyword
    const matchedServices = data.serviceKeywords
      .map(k => serviceByName[k])
      .filter(Boolean)

    // Build pricing (base price from service, add 20% for the worker)
    const pricing = matchedServices.map(svcId => {
      const svc = allServices.find(s => s._id.toString() === svcId.toString())
      return { service: svcId, price: Math.round(svc.basePrice * 1.2), unit: 'per visit' }
    })

    // Create worker profile
    await Worker.create({
      user:         user._id,
      services:     matchedServices,
      pricing,
      ...data.profile,
    })

    console.log(`  Created: ${data.user.name} (${matchedServices.length} services)`)
    count++
  }

  console.log(`\nCreated ${count} workers`)
  console.log('Login password for all workers: worker123')
  console.log('\n✅ Workers seeded!')
  await mongoose.disconnect()
  process.exit(0)
}

seedWorkers().catch(e => { console.error(e); process.exit(1) })
