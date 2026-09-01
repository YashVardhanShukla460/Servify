# Servify — Architecture Decision Records

## Purpose
This file documents WHY we made specific technical decisions.
In interviews, you will be asked "why did you choose X over Y?"
This file is your reference for those answers.

---

## ADR-001: Why MongoDB over a relational database (PostgreSQL, MySQL)?

Decision: Use MongoDB

Reason:
- Servify data (workers, services, bookings) has varying structure
- Worker profiles have flexible fields (skills, availability, pricing per service)
- MongoDB documents map naturally to JavaScript objects
- Easier to iterate during development without migration overhead
- MongoDB Atlas provides free cloud hosting for development
- Good fit for a MERN stack project

Trade-offs:
- No built-in joins (we use Mongoose populate for references)
- Less strict schema enforcement (we handle this with Mongoose validators)
- Not ideal for highly relational data with many-to-many relationships

---

## ADR-002: Why JWT over session-based authentication?

Decision: Use JWT (JSON Web Tokens)

Reason:
- Stateless: server does not need to store session state
- Works well for REST APIs
- Can contain user role in payload (avoids extra DB lookup per request)
- Works across different domains (useful for deployed frontend/backend)

Trade-offs:
- Cannot instantly invalidate tokens (logout just clears client cookie)
- Token size is larger than a session ID
- If secret is compromised, all tokens are compromised

Mitigation:
- Short expiration time (7 days)
- HTTP-only cookies prevent JavaScript access
- Secure flag in production

---

## ADR-003: Why HTTP-only cookies over localStorage for JWT?

Decision: Store JWT in HTTP-only cookie

Reason:
- localStorage is accessible via JavaScript → vulnerable to XSS attacks
- HTTP-only cookies cannot be read by JavaScript at all
- Browser automatically sends cookies with every request to the same origin
- More secure by default

Trade-offs:
- CSRF attacks become possible (mitigated with SameSite cookie flag)
- Slightly more complex to set up vs localStorage

Configuration:
- httpOnly: true (JavaScript cannot access)
- secure: true (HTTPS only, in production)
- sameSite: 'strict' (prevents CSRF in most cases)

---

## ADR-004: Why separate Worker model from User model?

Decision: User and Worker are separate MongoDB documents

Reason:
- Not all users are workers
- Worker profiles have many fields not relevant to customers (availability, pricing, etc.)
- Keeps the User model clean and simple
- Worker document references User via user field (ObjectId)
- Admin can query workers independently from users

Trade-off:
- Requires a populate() call or join-like query to get full worker+user data
- Two documents instead of one

---

## ADR-005: Why Vite over Create React App?

Decision: Use Vite for React setup

Reason:
- Much faster development server startup (native ES modules)
- Faster hot module replacement (HMR)
- Create React App is officially deprecated
- Smaller bundle size out of the box
- Industry standard as of 2024+

---

## ADR-006: Why Redux Toolkit over plain Redux or Zustand?

Decision: Use Redux Toolkit (RTK)

Reason:
- Redux Toolkit is the official, recommended way to use Redux
- Much less boilerplate than plain Redux
- Built-in Immer for immutable state updates
- Built-in createSlice and createAsyncThunk
- Good for global state: auth user, notifications, etc.
- Resume value: Redux is widely used in enterprise React apps

Important: We will NOT put everything in Redux.
- Auth state (current user, role) -> Redux (needed everywhere)
- Notifications count -> Redux (shown in navbar)
- Local form state -> useState (no need for Redux)
- Booking form data -> useState or local context

---

## ADR-007: Why reference instead of embed for Booking -> Worker/Service?

Decision: Reference (store ObjectId) rather than embed

Reason:
- Worker and Service documents are large and queried independently
- Worker profile can change (new reviews, updated availability)
- If we embedded, old bookings would show stale worker data
- References always point to the current document

Exception (embed):
- Booking stores the agreed price at booking time, even if worker later changes pricing
- This is intentional: preserve the original agreed price

---

## ADR-008: Why Tailwind CSS over styled-components or plain CSS?

Decision: Use Tailwind CSS

Reason:
- Utility-first: write styles directly in JSX, no context switching
- Consistent design system out of the box (spacing, colors, typography)
- Very popular in modern React projects
- Excellent for responsive design
- No CSS naming conflicts
- Resume value: Tailwind is widely used in the industry

Trade-off:
- Long className strings can look messy
- Requires learning Tailwind utility class names

---

## ADR-009: Why bcrypt for password hashing?

Decision: Use bcrypt

Reason:
- bcrypt is specifically designed for password hashing (slow by design)
- Includes a salt automatically (prevents rainbow table attacks)
- Industry standard for password hashing in Node.js
- 12 salt rounds: slow enough to be secure, fast enough for production

Never use: MD5, SHA1, SHA256 directly for passwords (too fast, not designed for passwords)

---

## ADR-010: Booking conflict prevention strategy

Decision: Database-level overlap check before creating booking

Reason:
- Frontend checks are easily bypassed
- Race conditions can cause double-bookings even with frontend checks
- We query existing bookings for the worker on the same date
- Check for time overlap before inserting new booking
- For production scale: MongoDB transactions or atomic operations

Logic:
  New booking: startTime=14:00, endTime=16:00
  Conflict exists if: existingStart < newEnd AND existingEnd > newStart
  This covers all overlap cases (full overlap, partial overlap, contained)
