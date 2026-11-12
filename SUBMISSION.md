# Internship Assignment Submission Report

## Project: CMS Project – Admin Panel & Dynamic Website Integration

**Role**: Senior MERN Stack Developer
**Status**: The application is separated into admin, public frontend, and backend applications; deployment is not yet confirmed.

**Verification**: The latest separation checks are recorded below. Admin login and CRUD workflows were not re-tested in this pass.

---

## 1. Executive Summary

This project implements a Content Management System built using the **MERN** stack (MongoDB, Express.js, React 19, Node.js). The application is decoupled into:
1. **Admin Panel Experience**: Secure, authenticated control center for managing content lifecycles, monitoring stats, updating publication states, and previewing media assets.
2. **Public Website Experience**: Fast, responsive consumer-facing portal displaying only published content fetched dynamically from MongoDB through REST APIs.
3. **Robust Backend API**: Modular Express server featuring centralized error handling, Mongoose data modeling, bcryptjs password hashing, and stateless JWT authentication.

---

## 2. Architecture & Design Patterns

### Backend Architecture
```
backend/
├── config/db.js               -> Reused Mongoose connection/promise with retryable failures
├── models/
│   ├── Admin.js               -> Admin schema, bcrypt 12-round salt pre-save hook, comparePassword method
│   └── Content.js             -> Content schema with auto-generated slug hook, timestamps, and URL regex validation
├── controllers/
│   ├── authController.js      -> Admin authentication, JWT signing, profile queries
│   └── contentController.js   -> Full CRUD, status toggle, public published query
├── middleware/
│   ├── authMiddleware.js      -> Bearer token validation and admin attachment
│   └── errorHandler.js        -> Centralized error handler (CastError, ValidationError, JWT errors)
├── routes/
│   ├── authRoutes.js          -> /api/auth endpoints
│   ├── adminContentRoutes.js  -> Protected /api/admin/content endpoints
│   └── publicContentRoutes.js -> Public /api/content endpoints
└── server.js                  -> Exported Express app, local listener, CORS and routing
```

For Vercel, `server.js` exports the Express application and starts a local HTTP listener only when run directly. API requests await the cached MongoDB connection promise. The existing `/api` routes and middleware are retained.

### Admin Application
```
admin/src/
|-- api/axios.js               -> Admin API client with JWT request and 401 handling
|-- context/AuthContext.jsx    -> Admin login, token verification, and logout state
|-- components/admin/          -> Admin layout and navigation
|-- components/shared/         -> ProtectedRoute guard and reusable Spinner
|-- pages/admin/               -> Login, dashboard, content list, and editor
|-- App.jsx                    -> Admin-only login and protected routes
```

### Public Frontend
```
frontend/src/
|-- api/axios.js               -> Public API client
|-- components/public/         -> Public navigation, footer, and article card
|-- components/shared/         -> Reusable Spinner
|-- pages/public/              -> Home, article list, and article detail pages
|-- App.jsx                    -> Public-only routes
```

The applications use separate `VITE_API_BASE_URL` values. Public navigation points to the admin origin using `VITE_ADMIN_URL`; admin navigation points to the public site using `VITE_PUBLIC_URL`.

---

## 3. Security Compliance Matrix

| Requirement | Implementation Details | Status |
|---|---|---|
| **Password Hashing** | Uses `bcryptjs` with 12 salt rounds inside Mongoose `pre('save')` hook | Implemented |
| **Credential Shielding** | Schema configures `password: { select: false }`; login explicitly selects it only for comparison | Implemented |
| **Stateless Auth** | Signed JSON Web Tokens (`JWT_SECRET`) with configurable expiration (defaults to `7d`) | Implemented |
| **Route Protection** | `protect` middleware guards admin content routes and `/api/auth/me` | Implemented |
| **No Public Registration** | No public registration route is defined | Implemented |
| **Draft Protection** | Public content queries filter for `{ status: 'Published' }` | Implemented |
| **Input Validation** | Controllers and Mongoose schema validate required fields, status, IDs, and image URL format | Implemented |
| **CORS Policy** | Allows the configured `CLIENT_URL` and `ADMIN_URL` browser origins only | Implemented |
| **Secret Management** | `.env` files are ignored; safe `.env.example` templates are tracked | Configured |

---

## 4. Evaluator Quick-Start Guide

### Step 1: Clone & Install
```bash
git clone https://github.com/abhijeetjena34-png/CMS-Project.git
cd CMS-Project

# Install dependencies for backend, admin, and public frontend
npm run install:all
```

### Step 2: Seed Database
Ensure MongoDB is running locally and configure `MONGODB_URI` in your private `backend/.env`, then run:
```bash
# Creates the initial admin user configured in backend/.env
npm run seed

# (Optional) Seeds realistic initial articles
npm run seed:content
```

### Step 3: Start All Applications
Open three terminals from the repository root:

**Terminal 1 (Backend API)**:
```bash
npm run dev:backend
# Running on http://localhost:5001
```

**Terminal 2 (Public Website)**:
```bash
npm run dev:frontend
# Running on http://localhost:5173
```

**Terminal 3 (Admin Portal)**:
```bash
npm run dev:admin
# Running on http://localhost:5174
```
---

## 5. Feature Demonstration Guide

The application includes the following workflows. This guide describes how to demonstrate them; it is not a claim that admin login or CRUD were re-tested during the latest deployment checks.

- **Admin Login**: Sign in at `http://localhost:5174/admin/login` using your configured administrator credentials.
- **Dashboard Overview**: View content totals by status and recent records.
- **Create Content**: Create an article with title, description, category, and image URL; save it as `Draft`.
- **Verify Draft Shielding**: Confirm the draft is not returned by the public content endpoints.
- **Publish Content**: Toggle the draft to `Published` and verify public visibility.
- **Edit Content**: Update an article and verify its detail view.
- **Delete Content**: Delete an article and verify it is removed.

## 6. Verification Status

The repository includes `npm test` and the `test:phase3`, `test:phase4`, and `test:phase5` scripts. The end-to-end workflow creates, updates, publishes, and deletes content; run it only against an isolated test database, not production Atlas.

The latest separation checks verified:
- The independent admin production build completed successfully.
- The independent public frontend production build completed successfully.
- Syntax checks passed for all 17 backend JavaScript files.
- The backend root and `/api/health` routes returned HTTP 200 in a local smoke check.
- CORS preflight allowed both configured test origins and rejected an unlisted origin.
- Both Vercel SPA configurations parsed and include the expected `/index.html` fallback.
- Production builds reject missing required API and cross-app URL variables.

Admin login and create/edit/delete workflows were **not** re-tested during the separation checks. Build and syntax checks do not establish that the project is deployed or live.

---

## 7. Vercel Deployment Guide

Deploy the backend, admin portal, and public frontend as **three separate Vercel projects** from this repository. The existing MongoDB Atlas database is `cms_project`. Do not put secret environment values in this document or in Git.

### A. Backend API (Vercel Serverless Function)
1. Import the repository into Vercel as a project and set **Root Directory** to `backend`.
2. `backend/server.js` exports the Express app for Vercel and starts the local listener only when run directly with `npm start`; no separate backend `vercel.json` is required.
3. Configure these environment variable names in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` - exact public frontend origin
   - `ADMIN_URL` - exact admin origin
4. Set Atlas Network Access to permit the deployed backend to connect. API routes remain under `/api`.

`backend/config/db.js` reuses open connections and caches the in-progress connection promise across concurrent and warm serverless invocations. Failed connections clear the promise and propagate errors. `/api/health` is registered before database middleware, so a successful health response alone does not confirm Atlas connectivity.

### B. Admin portal (Vercel)
1. Import the repository as a separate project and set **Root Directory** to `admin`.
2. Use **Build Command** `npm run build` and **Output Directory** `dist`.
3. Configure `VITE_API_BASE_URL` to the backend origin ending in `/api`, and `VITE_PUBLIC_URL` to the exact public frontend origin.
4. `admin/vercel.json` configures the SPA fallback so admin routes support direct visits and refreshes.

### C. Public frontend (Vercel)
1. Import the repository as another project and set **Root Directory** to `frontend`.
2. Use **Build Command** `npm run build` and **Output Directory** `dist`.
3. Configure `VITE_API_BASE_URL` to the backend origin ending in `/api`, and `VITE_ADMIN_URL` to the exact admin origin. Production builds require these values; do not use localhost.
4. `frontend/vercel.json` configures the SPA fallback for public routes and refreshes.

Backend CORS allows only the exact `CLIENT_URL` and `ADMIN_URL` browser origins. Set those variables to the local app origins in `backend/.env` for development. Other preview origins are not automatically allowed; update the matching backend variable and redeploy if either production origin changes. Requests without an `Origin` header do not receive browser CORS access.

### Deployment configuration files
- `backend/server.js` - Express app export, local listener, route registration, and CORS.
- `backend/config/db.js` - cached serverless database connection handling.
- `admin/vercel.json` - admin Vite build/output and SPA fallback.
- `frontend/vercel.json` - public Vite build/output and SPA fallback.

No deployment URLs are listed because deployment has not been performed or verified.