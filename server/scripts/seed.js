/**
 * Seed Script — populate the database with initial data
 *
 * WHAT: Creates all 13 service categories and sample services.
 *
 * HOW to run:
 *   node scripts/seed.js
 *
 * WHAT does it do?
 *   1. Connects to MongoDB Atlas
 *   2. Clears existing categories and services
 *   3. Inserts all category data
 *   4. Inserts sample services for each category
 *   5. Disconnects
 *
 * WHY seed?
 *   Without initial data, the app shows nothing.
 *   Seeding gives us realistic data to test the frontend with.
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Category from '../src/models/Category.js'
import Service  from '../src/models/Service.js'

dotenv.config()

// ─── Category data ───
const categories = [
  { name: 'Cleaning',      icon: '🧹', description: 'Home and office cleaning services', sortOrder: 1 },
  { name: 'Electrical',    icon: '⚡', description: 'Electrical repairs and installations', sortOrder: 2 },
  { name: 'Plumbing',      icon: '🔧', description: 'Plumbing repairs and pipe work', sortOrder: 3 },
  { name: 'AC & Appliances', icon: '❄️', description: 'AC service, repair and installation', sortOrder: 4 },
  { name: 'Carpentry',     icon: '🪚', description: 'Furniture assembly and wooden work', sortOrder: 5 },
  { name: 'Painting',      icon: '🎨', description: 'Interior and exterior painting', sortOrder: 6 },
  { name: 'Pest Control',  icon: '🪲', description: 'Pest and rodent control services', sortOrder: 7 },
  { name: 'Beauty',        icon: '💄', description: 'Salon and beauty services at home', sortOrder: 8 },
  { name: 'Babysitting',   icon: '👶', description: 'Trusted childcare at your home', sortOrder: 9 },
  { name: 'Tutoring',      icon: '📚', description: 'Home tuition and online coaching', sortOrder: 10 },
  { name: 'Chef & Cooking',icon: '👨‍🍳', description: 'Personal chefs for events and daily meals', sortOrder: 11 },
  { name: 'Security',      icon: '🔒', description: 'Security guards and CCTV installation', sortOrder: 12 },
  { name: 'Gardening',     icon: '🌱', description: 'Garden maintenance and landscaping', sortOrder: 13 },
]

// ─── Service builder helper ───
const makeServices = (categoryId, categoryName) => {
  const serviceMap = {
    'Cleaning': [
      { name: 'Deep Home Cleaning',    basePrice: 999,  duration: 240, isFeatured: true,  description: 'Full deep clean of your entire home by trained professionals.', includes: ['Kitchen cleaning', 'Bathroom scrubbing', 'Floor mopping', 'Dusting all surfaces', 'Window cleaning'] },
      { name: 'Bathroom Cleaning',     basePrice: 399,  duration: 60,  isFeatured: false, description: 'Thorough bathroom deep clean including tiles, toilet, and fixtures.', includes: ['Tile scrubbing', 'Toilet cleaning', 'Mirror cleaning', 'Floor mopping'] },
      { name: 'Kitchen Cleaning',      basePrice: 499,  duration: 90,  isFeatured: false, description: 'Professional kitchen cleaning including appliances and countertops.', includes: ['Countertop cleaning', 'Appliance cleaning', 'Cabinet wipe-down', 'Floor mopping'] },
      { name: 'Sofa & Carpet Cleaning',basePrice: 799,  duration: 120, isFeatured: true,  description: 'Steam-clean sofas, carpets, and upholstery.', includes: ['Sofa steam cleaning', 'Stain removal', 'Deodorizing'] },
    ],
    'Electrical': [
      { name: 'Fan Installation',        basePrice: 299, duration: 60,  isFeatured: false, description: 'Ceiling fan installation with wiring and testing.', includes: ['Fan mounting', 'Wiring', 'Safety testing'] },
      { name: 'Switchboard Repair',      basePrice: 199, duration: 45,  isFeatured: false, description: 'Repair of faulty switchboards, sockets, and MCBs.', includes: ['Fault diagnosis', 'Part replacement', 'Testing'] },
      { name: 'Full Home Wiring',        basePrice: 4999,duration: 480, isFeatured: true,  description: 'Complete electrical wiring for new homes or renovation.', includes: ['Wire routing', 'MCB panel setup', 'All sockets & switches', 'Safety inspection'] },
      { name: 'Inverter & UPS Setup',    basePrice: 599, duration: 90,  isFeatured: false, description: 'Inverter installation, battery connection and testing.', includes: ['Mounting', 'Battery connection', 'Load testing'] },
    ],
    'Plumbing': [
      { name: 'Tap & Faucet Repair',     basePrice: 199, duration: 45,  isFeatured: false, description: 'Fix leaking or broken taps and faucets.', includes: ['Leak diagnosis', 'Part replacement', 'Testing'] },
      { name: 'Pipe Leakage Fix',        basePrice: 399, duration: 90,  isFeatured: true,  description: 'Detect and fix pipe leaks behind walls or under floors.', includes: ['Leak detection', 'Pipe repair', 'Wall patching'] },
      { name: 'Bathroom Fitting',        basePrice: 1499,duration: 180, isFeatured: false, description: 'Full bathroom fitting including shower, taps, and drainage.', includes: ['Shower installation', 'Tap fitting', 'Drain setup'] },
      { name: 'Water Tank Cleaning',     basePrice: 699, duration: 120, isFeatured: false, description: 'Overhead or underground water tank cleaning and disinfection.', includes: ['Draining', 'Scrubbing', 'Disinfection', 'Refill'] },
    ],
    'AC & Appliances': [
      { name: 'AC Service',              basePrice: 599, duration: 60,  isFeatured: true,  description: 'Complete AC service including filter cleaning and gas check.', includes: ['Filter cleaning', 'Coil cleaning', 'Gas check', 'Performance test'] },
      { name: 'AC Installation',         basePrice: 1299,duration: 180, isFeatured: false, description: 'Split or window AC installation with copper pipe and wiring.', includes: ['Mounting', 'Copper piping', 'Electrical connection', 'Testing'] },
      { name: 'AC Gas Refilling',        basePrice: 1999,duration: 90,  isFeatured: false, description: 'Refrigerant gas refill and leak detection.', includes: ['Gas level check', 'Leak detection', 'Gas refill'] },
      { name: 'Washing Machine Repair',  basePrice: 499, duration: 60,  isFeatured: false, description: 'Diagnosis and repair of washing machine issues.', includes: ['Fault diagnosis', 'Part repair/replacement', 'Test run'] },
    ],
    'Carpentry': [
      { name: 'Furniture Assembly',      basePrice: 399, duration: 120, isFeatured: false, description: 'Assemble flat-pack furniture from IKEA and other brands.', includes: ['Assembly', 'Leveling', 'Tightening all joints'] },
      { name: 'Door & Window Repair',    basePrice: 499, duration: 90,  isFeatured: false, description: 'Fix squeaky, broken, or misaligned doors and windows.', includes: ['Hinge adjustment', 'Lock repair', 'Frame fixing'] },
      { name: 'Custom Shelving',         basePrice: 799, duration: 120, isFeatured: true,  description: 'Install wall shelves and storage units.', includes: ['Wall mounting', 'Leveling', 'Load testing'] },
    ],
    'Painting': [
      { name: 'Room Painting',           basePrice: 2499,duration: 480, isFeatured: true,  description: 'Full interior painting for one room with premium paint.', includes: ['Wall prep', 'Primer coat', '2 finish coats', 'Clean-up'] },
      { name: 'Full Home Painting',      basePrice: 15999,duration:2880,isFeatured: false, description: 'Complete interior painting for 2/3 BHK homes.', includes: ['All rooms', 'Ceiling', 'Doors and windows', 'Clean-up'] },
      { name: 'Texture Painting',        basePrice: 3999,duration: 480, isFeatured: false, description: 'Decorative texture paint for accent walls.', includes: ['Wall prep', 'Texture design', 'Finish coat'] },
    ],
    'Pest Control': [
      { name: 'Cockroach Treatment',     basePrice: 599, duration: 60,  isFeatured: true,  description: 'Gel-based cockroach control for kitchen and bathroom.', includes: ['Gel application', 'Crack sealing', 'Follow-up advice'] },
      { name: 'Termite Treatment',       basePrice: 2499,duration: 180, isFeatured: false, description: 'Chemical soil treatment and wood treatment for termites.', includes: ['Soil treatment', 'Wood treatment', '1-year warranty'] },
      { name: 'Mosquito Control',        basePrice: 799, duration: 90,  isFeatured: false, description: 'Fogging and spray treatment for mosquito control.', includes: ['Outdoor fogging', 'Indoor spraying', 'Breeding area treatment'] },
    ],
    'Beauty': [
      { name: 'Bridal Makeup',           basePrice: 4999,duration: 180, isFeatured: true,  description: 'Professional bridal makeup at your home.', includes: ['Skin prep', 'Full makeup', 'Hairstyling', 'Touch-up kit'] },
      { name: 'Facial & Cleanup',        basePrice: 699, duration: 60,  isFeatured: false, description: 'Deep cleansing facial with steam and mask.', includes: ['Cleansing', 'Steam', 'Scrub', 'Mask', 'Moisturizer'] },
      { name: 'Manicure & Pedicure',     basePrice: 599, duration: 90,  isFeatured: false, description: 'Complete nail care, cleaning, and polish.', includes: ['Soaking', 'Shaping', 'Cuticle care', 'Polish'] },
      { name: 'Hair Spa',                basePrice: 799, duration: 90,  isFeatured: false, description: 'Deep conditioning hair spa at home.', includes: ['Shampoo', 'Conditioning', 'Hair mask', 'Blow dry'] },
    ],
    'Babysitting': [
      { name: 'Full Day Babysitting',    basePrice: 999, duration: 480, isFeatured: true,  description: 'Certified babysitter for a full day (8 hours).', includes: ['Meals', 'Play', 'Nap management', 'Basic first aid'] },
      { name: 'Evening Babysitting',     basePrice: 499, duration: 180, isFeatured: false, description: 'Babysitter for 3 hours in the evening.', includes: ['Dinner', 'Bedtime routine'] },
    ],
    'Tutoring': [
      { name: 'Math Tutoring (K-12)',    basePrice: 499, duration: 60,  isFeatured: true,  description: 'One-on-one math tutoring for school students.', includes: ['Concept teaching', 'Practice problems', 'Doubt clearing'] },
      { name: 'English Speaking',        basePrice: 399, duration: 60,  isFeatured: false, description: 'Spoken English coaching for fluency and confidence.', includes: ['Speaking practice', 'Grammar', 'Pronunciation'] },
      { name: 'Coding for Kids',         basePrice: 699, duration: 60,  isFeatured: false, description: 'Introduction to programming using Scratch and Python.', includes: ['Scratch basics', 'Python intro', 'Mini project'] },
    ],
    'Chef & Cooking': [
      { name: 'Party Catering (20 pax)', basePrice: 4999,duration: 240, isFeatured: true,  description: 'Professional chef for party cooking for up to 20 people.', includes: ['Menu planning', 'Grocery list', 'Cooking', 'Serving'] },
      { name: 'Daily Tiffin Cook',       basePrice: 2999,duration: 60,  isFeatured: false, description: 'Home cook for daily breakfast and lunch preparation.', includes: ['Grocery coordination', 'Cooking', 'Clean-up'] },
    ],
    'Security': [
      { name: 'Security Guard (12h)',    basePrice: 1499,duration: 720, isFeatured: false, description: 'Trained security guard for 12-hour day duty.', includes: ['Entry/exit control', 'Patrolling', 'Incident reporting'] },
      { name: 'CCTV Installation',       basePrice: 2999,duration: 240, isFeatured: true,  description: 'CCTV camera installation with DVR and mobile viewing setup.', includes: ['Camera mounting', 'DVR setup', 'Mobile app configuration', 'Demo'] },
    ],
    'Gardening': [
      { name: 'Garden Maintenance',      basePrice: 699, duration: 120, isFeatured: true,  description: 'Monthly garden maintenance including pruning and watering setup.', includes: ['Pruning', 'Weeding', 'Fertilizing', 'Watering setup'] },
      { name: 'Plant Repotting',         basePrice: 299, duration: 60,  isFeatured: false, description: 'Repot your indoor plants with fresh soil and fertilizer.', includes: ['Repotting', 'Fresh soil', 'Fertilizer', 'Care tips'] },
      { name: 'Lawn Setup',              basePrice: 3999,duration: 480, isFeatured: false, description: 'Full lawn setup with grass laying and irrigation.', includes: ['Land prep', 'Grass laying', 'Irrigation', 'Initial care'] },
    ],
  }

  return (serviceMap[categoryName] || []).map(s => ({
    ...s,
    category: categoryId,
    isActive: true,
  }))
}

// ─── Run the seed ───
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB\n')

    // Clear existing data
    await Category.deleteMany({})
    await Service.deleteMany({})
    console.log('Cleared existing categories and services')

    // Insert categories
    const insertedCategories = await Category.insertMany(categories)
    console.log(`Inserted ${insertedCategories.length} categories`)

    // Build and insert services for each category
    let totalServices = 0
    for (const cat of insertedCategories) {
      const services = makeServices(cat._id, cat.name)
      if (services.length > 0) {
        await Service.insertMany(services)
        console.log(`  ${cat.name}: ${services.length} services`)
        totalServices += services.length
      }
    }

    console.log(`\nInserted ${totalServices} services`)
    console.log('\n✅ Database seeded successfully!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seed()
