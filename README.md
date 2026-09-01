# Servify

A full-stack home services marketplace built with the MERN stack.
Customers can discover and book verified service professionals for cleaning, electrical work, plumbing, AC repair, beauty services, tutoring, and more.

---

## Project Status

🚧 Currently in active development — following a phase-based approach.

---

## User Roles

| Role | Description |
|------|-------------|
| Customer | Browses and books services |
| Worker | Receives and completes service bookings |
| Admin | Manages the entire platform |

---

## Tech Stack

**Frontend**
- React 18 (Vite)
- Tailwind CSS
- React Router v6
- Redux Toolkit
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose

**Authentication**
- JWT (JSON Web Tokens)
- HTTP-only cookies
- bcrypt password hashing

---

## Features

### Customer
- Browse and search services by category, price, rating
- View worker profiles and ratings
- Book services with date and time slot selection
- Manage addresses
- View and cancel bookings
- Review and rate completed bookings

### Worker
- Register and get approved by admin
- Set availability and service areas
- Accept or reject booking requests
- View earnings and reviews

### Admin
- Approve or reject worker applications
- Manage categories, services, users, bookings, reviews

---

## Project Structure

```
Servify/
  client/       React frontend (Vite)
  server/       Node.js + Express backend
  docs/         Architecture and design documentation
  .gitignore
  .env.example
  README.md
```

---

## Getting Started

> Detailed setup instructions will be added as the project progresses through each phase.

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Environment Variables
Copy `.env.example` to create your own `.env`:
```bash
# In server/
cp .env.example .env

# In client/
cp .env.example .env
```

Fill in your real values. **Never commit `.env` to Git.**

---

## Documentation

| Document | Description |
|----------|-------------|
| [Project Plan](docs/PROJECT_PLAN.md) | Full feature list and roadmap |
| [Architecture](docs/ARCHITECTURE.md) | System design and component diagrams |
| [Database](docs/DATABASE.md) | MongoDB models and relationships |
| [API](docs/API.md) | REST API endpoint documentation |
| [Decisions](docs/DECISIONS.md) | Why we chose each technology |
| [Development Log](docs/DEVELOPMENT_LOG.md) | Phase-by-phase progress |

---

## Screenshots

> Coming soon as each phase is completed.

---

## License

This project is for educational and portfolio purposes.
