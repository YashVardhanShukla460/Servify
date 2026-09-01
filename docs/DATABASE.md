# Servify — Database Design

## Database: MongoDB (via Mongoose ODM)

MongoDB stores data as documents (similar to JSON objects).
Instead of tables and rows (like SQL), MongoDB has collections and documents.

---

## Why MongoDB for Servify?

- Flexible schema: worker profiles, services, and booking data vary in structure
- Easy to work with in JavaScript/Node.js
- Scales well
- MongoDB Atlas provides easy cloud hosting
- Works naturally with Mongoose for schema validation

---

## Collections Overview

| Collection    | Purpose                                  |
|---------------|------------------------------------------|
| users         | All registered users (customer/worker/admin) |
| workers       | Worker profiles (linked to a user)       |
| categories    | Service categories (Cleaning, Electrical)|
| services      | Specific services (Deep Cleaning, Wiring)|
| bookings      | All booking records                      |
| reviews       | Customer reviews for completed bookings  |
| addresses     | Customer saved addresses                 |
| notifications | In-app notifications                     |

---

## Data Relationships

```
User (customer role)
  |--- has many ---> Bookings
  |--- has many ---> Addresses
  |--- has many ---> Notifications
  |--- has many ---> Reviews (as author)

User (worker role)
  |--- has one  ---> Worker (profile)

Worker
  |--- belongs to -> User
  |--- has many ---> Bookings (as service provider)
  |--- has many ---> Reviews (received)
  |--- has many ---> Notifications

Category
  |--- has many ---> Services

Service
  |--- belongs to -> Category
  |--- referenced in -> Worker (services they offer)
  |--- referenced in -> Bookings

Booking
  |--- belongs to -> User (customer)
  |--- belongs to -> Worker
  |--- belongs to -> Service
  |--- belongs to -> Address
  |--- has one (optional) -> Review

Review
  |--- belongs to -> Booking (one review per booking)
  |--- belongs to -> User (customer who wrote it)
  |--- belongs to -> Worker (who received it)
```

---

## Model Definitions

### User Model
```
{
  name:         String (required)
  email:        String (required, unique)
  password:     String (required, hashed)
  role:         Enum ['customer', 'worker', 'admin'] (default: 'customer')
  phone:        String
  profileImage: String (URL)
  isActive:     Boolean (default: true)   -- false = suspended by admin
  createdAt:    Date
  updatedAt:    Date
}
```

### Worker Model
```
{
  user:           ObjectId -> User (required)
  bio:            String
  experience:     Number (years)
  skills:         [String]
  services:       [ObjectId -> Service]
  pricing:        [{ service: ObjectId, price: Number, unit: String }]
  serviceAreas:   [String]  -- city/area names
  availability:   {
    monday:    { isAvailable: Boolean, slots: [{ start: String, end: String }] }
    tuesday:   { ... }
    wednesday: { ... }
    thursday:  { ... }
    friday:    { ... }
    saturday:  { ... }
    sunday:    { ... }
  }
  rating:         Number (0-5, auto-calculated from reviews)
  totalReviews:   Number
  status:         Enum ['pending', 'approved', 'rejected', 'suspended']
  profileImage:   String (URL)
  createdAt:      Date
  updatedAt:      Date
}
```

### Category Model
```
{
  name:        String (required, unique)
  description: String
  icon:        String (icon name or URL)
  isActive:    Boolean (default: true)
  createdAt:   Date
  updatedAt:   Date
}
```

### Service Model
```
{
  category:     ObjectId -> Category (required)
  name:         String (required)
  description:  String
  basePrice:    Number
  duration:     Number (minutes, estimated)
  image:        String (URL)
  isActive:     Boolean (default: true)
  isFeatured:   Boolean (default: false)
  createdAt:    Date
  updatedAt:    Date
}
```

### Booking Model
```
{
  customer:      ObjectId -> User (required)
  worker:        ObjectId -> Worker (required)
  service:       ObjectId -> Service (required)
  address:       ObjectId -> Address (required)
  date:          Date (required)
  startTime:     String (e.g. "14:00", required)
  endTime:       String (e.g. "16:00", required)
  totalPrice:    Number (required)
  status:        Enum ['pending','accepted','rejected','cancelled','in_progress','completed']
  paymentStatus: Enum ['pending','paid','failed','refunded']
  notes:         String (customer notes)
  cancelledBy:   Enum ['customer','worker','admin']
  cancelReason:  String
  review:        ObjectId -> Review
  createdAt:     Date
  updatedAt:     Date
}
```

### Review Model
```
{
  booking:   ObjectId -> Booking (required, unique -- one review per booking)
  customer:  ObjectId -> User (required)
  worker:    ObjectId -> Worker (required)
  service:   ObjectId -> Service (required)
  rating:    Number (1-5, required)
  comment:   String
  createdAt: Date
  updatedAt: Date
}
```

### Address Model
```
{
  user:         ObjectId -> User (required)
  label:        String (e.g. "Home", "Office")
  addressLine1: String (required)
  addressLine2: String
  city:         String (required)
  state:        String (required)
  pincode:      String (required)
  isDefault:    Boolean (default: false)
  createdAt:    Date
}
```

### Notification Model
```
{
  recipient:  ObjectId -> User (required)
  type:       String  (e.g. 'booking_accepted', 'booking_cancelled')
  title:      String
  message:    String
  isRead:     Boolean (default: false)
  relatedId:  ObjectId (optional, e.g. bookingId)
  createdAt:  Date
}
```

---

## Embedding vs Referencing

### When we REFERENCE (store ObjectId and look up separately):

Use when the related data is large, shared, or queried independently.

Example: Booking references Worker and Service
  -> Worker profiles are large documents
  -> We query Workers separately (browsing, search)
  -> So we store workerID in booking, not the whole worker object

### When we EMBED (store data directly inside the document):

Use when the data is small, always used together, and never queried independently.

Example: Worker availability is embedded in the Worker document
  -> Availability is always loaded with the worker
  -> It is never queried on its own
  -> So embedding makes sense

---

## Key Indexes (for query performance)

```
users:     email (unique index)
workers:   user (unique), status, rating, serviceAreas
services:  category, isActive, isFeatured
bookings:  customer, worker, date, status
reviews:   booking (unique), worker
addresses: user
notifications: recipient, isRead
```

Indexes are created in Mongoose schema definitions.
They make lookups faster by avoiding full collection scans.
