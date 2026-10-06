import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Worker from '../src/models/Worker.js'

dotenv.config()

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  const defaultAvail = {
    isAvailable: true,
    slots: [{ start: '09:00', end: '17:00' }]
  }

  const result = await Worker.updateMany({}, {
    $set: {
      'availability.monday': defaultAvail,
      'availability.tuesday': defaultAvail,
      'availability.wednesday': defaultAvail,
      'availability.thursday': defaultAvail,
      'availability.friday': defaultAvail
    }
  })

  console.log('Workers updated:', result.modifiedCount)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch(console.error)
