# Internship Assignment Submission Report

## Project: CMS Project – Admin Panel & Dynamic Website Integration

**Role**: Senior MERN Stack Developer
**Status**: Application implementation and Vercel deployment preparation complete; deployment is not yet confirmed.

**Verification**: Focused deployment checks are recorded below. The automated test suites and admin login/CRUD were not re-run during the latest deployment checks.

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

### Frontend Architecture
```
frontend/src/
├── api/axios.js               -> Axios instance with Bearer token request interceptor & 401 response interceptor
├── context/AuthContext.jsx    -> Centralized React auth state, login/logout actions, token verification
├── components/
│   ├── admin/                 -> AdminLayout and AdminSidebar with navigation and logout
│   ├── public/                -> PublicNavbar and responsive ContentCard components
│   └── shared/                -> ProtectedRoute guard and reusable Spinner
└── pages/
    ├── admin/                 -> LoginPage, DashboardPage, ContentListPage, ContentFormPage
    └── public/                -> HomePage, ArticlesPage, ArticleDetailPage
```

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
| **CORS Policy** | Allows configured `CLIENT_URL`, development localhost origins, and requests without an Origin header | Implemented |
| **Secret Management** | `.env` files are ignored; safe `.env.example` templates are tracked | Configured |

---

## 4. Evaluator Quick-Start Guide

### Step 1: Clone & Install
```bash
git clone https://github.com/abhijeetjena34-png/CMS-Project.git
cd CMS-Project

# Install all dependencies for both backend and frontend from root
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

### Step 3: Start Both Applications
Open two terminals:

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
# Running on http://localhost:5001
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 5. Feature Demonstration Guide

The application includes the following workflows. This guide describes how to demonstrate them; it is not a claim that admin login or CRUD were re-tested during the latest deployment checks.

- **Admin Login**: Sign in at `http://localhost:5173/admin/login` using your configured administrator credentials.
- **Dashboard Overview**: View content totals by status and recent records.
- **Create Content**: Create an article with title, description, category, and image URL; save it as `Draft`.
- **Verify Draft Shielding**: Confirm the draft is not returned by the public content endpoints.
- **Publish Content**: Toggle the draft to `Published` and verify public visibility.
- **Edit Content**: Update an article and verify its detail view.
- **Delete Content**: Delete an article and verify it is removed.

## 6. Verification Status

The repository includes `npm test` and the `test:phase3`, `test:phase4`, and `test:phase5` scripts. Their results are not reported here as current passing results because the automated suites were not run during the latest deployment-preparation checks.

The latest focused deployment-preparation checks verified:
- The frontend production build completed successfully.
- Syntax checks passed for all 17 backend JavaScript files.
- The backend started locally and connected to the configured Atlas database.
- Read-only API smoke checks passed for health (`200`), public content (`200`, published items only), unauthenticated admin content (`401`), unauthenticated profile (`401`), invalid login input (`400`), and an unknown route (`404`).

Admin login and create/edit/delete workflows were **not** re-tested during those deployment checks. These checks do not establish that the project is deployed or live.

---

## 7. Vercel Deployment Guide

Deploy the backend and frontend as **separate Vercel projects** from this repository. The configured MongoDB Atlas database is `cms_project`. Do not put secret environment values in this document or in Git.

### A. Backend API (Vercel Serverless Function)
1. In [Vercel](https://vercel.com/), import the repository as a new project and set **Root Directory** to `backend`.
2. Use the existing Node.js/Express app and `backend/package-lock.json`. `backend/server.js` exports the Express app for Vercel and starts the local listener only when run directly with `npm start`. No backend `vercel.json` is currently required.
3. Configure these production environment variable **names** in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
4. Set `CLIENT_URL` to the exact production frontend origin, and ensure Atlas Network Access permits connections from the deployed backend.
5. Deploy. Existing API routes retain their `/api` prefix.

`backend/config/db.js` reuses an open Mongoose connection and caches the in-progress connection promise across concurrent and warm invocations. Failed connection attempts clear the cached promise and propagate errors. `GET /api/health` is registered before the database middleware, so a successful health response alone does not confirm Atlas connectivity.

### B. Frontend (Vercel)
1. Import the repository as a second Vercel project and set **Root Directory** to `frontend`.
2. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
3. Set the production environment variable name `VITE_API_BASE_URL` to the deployed backend origin followed by `/api`. Do not use the local development fallback.
4. Deploy and verify direct visits and refreshes on React Router routes.

Production CORS allows the configured `CLIENT_URL` and requests without an Origin header; localhost origins are also allowed for development. Preview deployments on other origins are not automatically allowed. If the frontend production origin changes, update `CLIENT_URL` and redeploy the backend.

### Deployment configuration files
- `backend/server.js` — Express app export for Vercel and local `npm start` listener.
- `backend/config/db.js` — serverless connection reuse and retryable connection errors.
- `frontend/vercel.json` — Vite build/output settings and React Router SPA fallback.

No deployment URLs are listed because deployment has not yet been performed or verified.
