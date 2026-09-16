# Servify 🛠️

![Servify Banner](https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop)

Servify is a modern, full-stack (MERN) home services marketplace. It connects customers with verified local professionals for services like plumbing, electrical work, cleaning, and more. 

### 🚀 Live Demo
* **Frontend Application:** [View Live Website](https://servify.vercel.app) *(Note: Replace with your actual Vercel URL)*
* **Backend API (Health Check):** [https://servify-449z.onrender.com/api/health](https://servify-449z.onrender.com/api/health)
> **Note:** The backend is hosted on Render's free tier. If the API takes 30-50 seconds to respond on the first load, the server is just waking up from sleep!

---

## 🌟 Key Features

* **Multi-Role Authentication:** Secure login for Customers, Workers, and Admins using HTTP-only JWT cookies.
* **Smart Booking System:** Multi-step booking flow with automated conflict detection to prevent double-booking a professional's time slot.
* **Role-Based Dashboards:** 
  * **Customers:** Manage saved addresses, view booking history, and leave reviews.
  * **Workers:** Accept/reject incoming requests, manage custom service pricing, update weekly availability, and edit their public profile.
  * **Admins:** Approve or reject pending worker registrations to maintain platform quality.
* **Dynamic Search & Filtering:** Filter services by category, or search for specific professionals based on location and rating.
* **Review & Rating System:** Customers can leave 1-5 star reviews on completed jobs, dynamically updating the professional's overall rating.
* **Real-time Notifications:** In-app notification bell alerts users immediately when a booking status changes.

---

## 💻 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Redux Toolkit, React Router v6
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashVardhanShukla460/Servify.git
   cd Servify
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the Application**
   Open two terminals:
   * Terminal 1 (Backend): `cd server && node server.js`
   * Terminal 2 (Frontend): `cd client && npm run dev`

---
*Designed and built by Yash Vardhan Shukla.*
