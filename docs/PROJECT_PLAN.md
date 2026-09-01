# Servify — Project Plan

## Overview

**Servify** is a full-stack, production-style home-services marketplace built with the MERN stack.
It connects customers who need home services (cleaning, electrical, plumbing, etc.) with
verified service professionals (workers), all managed through an admin panel.

---

## Core Concept

`
Customer  →  Browse services  →  Find a worker  →  Book  →  Confirm  →  Review
Worker    →  Register         →  Get approved    →  Accept bookings  →  Earn
Admin     →  Approve workers  →  Manage platform →  Monitor          →  Report
`

---

## User Roles

| Role     | Description                                                  |
|----------|--------------------------------------------------------------|
| Customer | End-user who books services                                  |
| Worker   | Service provider who receives and completes bookings         |
| Admin    | Platform manager who approves workers and manages everything |

---

## Feature Summary

### Customer Features
- Register, Login, Logout
- Browse categories and services
- Search, filter, sort, paginate services
- View worker profiles and ratings
- Select service, worker, date, and time slot
- Manage addresses
- Create, view, and cancel bookings
- Review and rate completed bookings
- View notifications
- Manage profile

### Worker Features
- Register, Login, Logout
- Create and manage worker profile
- Upload profile image
- Add bio, experience, skills
- Select services and set pricing
- Define service areas and availability
- Receive, accept, reject bookings
- Mark bookings as completed
- View earnings and reviews
- Receive notifications

### Admin Features
- Dashboard with statistics
- Manage users (view, suspend)
- Manage workers (approve, reject, suspend)
- Manage categories (create, edit, disable)
- Manage services (create, edit, disable)
- Manage bookings
- Manage reviews
- Manage payments
- Manage featured services
- View reports and analytics

---

## Development Phases

| Phase | Title                          | Complexity |
|-------|--------------------------------|------------|
| 0     | Architecture & Planning        | Low        |
| 1     | Git + Project Init             | Low        |
| 2     | React + Vite + Tailwind        | Low        |
| 3     | Express + Node Backend         | Low        |
| 4     | MongoDB + Mongoose             | Low-Medium |
| 5     | Authentication                 | Medium     |
| 6     | Authorization + RBAC           | Medium     |
| 7     | Categories & Services          | Medium     |
| 8     | Worker Onboarding              | Medium     |
| 9     | Worker Profiles & Availability | Medium     |
| 10    | Customer Discovery & Search    | Medium     |
| 11    | Booking System                 | High       |
| 12    | Booking Conflict Prevention    | High       |
| 13    | Customer Dashboard             | Medium     |
| 14    | Worker Dashboard               | Medium     |
| 15    | Admin Dashboard                | Medium     |
| 16    | Ratings & Reviews              | Medium     |
| 17    | Image Uploads (Cloudinary)     | Medium     |
| 18    | Notifications                  | Medium     |
| 19    | Payments (Razorpay)            | High       |
| 20    | Real-time Features (Socket.IO) | High       |
| 21    | Testing                        | Medium     |
| 22    | Security Audit                 | High       |
| 23    | Performance Optimization       | Medium     |
| 24    | Production Preparation         | Medium     |
| 25    | Deployment                     | Medium     |
| 26    | Documentation                  | Low        |
| 27    | Resume & Portfolio Prep        | Low        |

---

## MVP vs Advanced Features

### MVP (Must Have — Phases 1-16)
- Authentication (register/login/logout)
- Role-based access control
- Category and service management
- Worker onboarding with admin approval flow
- Worker availability system
- Booking system with conflict prevention
- Customer, Worker, and Admin dashboards
- Ratings and reviews

### Advanced (Phases 17-27)
- Image uploads via Cloudinary
- Database-based notifications
- Payment integration via Razorpay
- Real-time updates via Socket.IO
- Automated testing
- Full deployment
- Portfolio documentation

---

## What You Need to Install Before Starting

### Required Now
| Tool       | Purpose                           |
|------------|-----------------------------------|
| Git        | Already installed (v2.49.0)       |
| Node.js    | Run JavaScript on backend         |
| npm        | Included with Node.js             |
| VS Code    | Code editor                       |
| Postman    | API testing                       |

### Required When We Reach That Phase
| Tool/Service     | Phase | Purpose             |
|------------------|-------|---------------------|
| MongoDB Atlas    | 4     | Cloud database      |
| GitHub account   | 1     | Remote repository   |
| Cloudinary       | 17    | Image uploads       |
| Razorpay account | 19    | Payment processing  |

---

## What I Will Do Automatically
- Create all project files and folders
- Write all application code
- Configure dependencies
- Set up architecture
- Write documentation

## What You Must Do Manually
- Install Node.js (if not already installed)
- Create GitHub repository on github.com
- Create MongoDB Atlas account and cluster
- Create Cloudinary account (later)
- Create Razorpay account (later)
- Copy connection strings into your .env file (NEVER share these)
