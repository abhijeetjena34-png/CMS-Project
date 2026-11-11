# Internship Assignment Submission Report

## Project: CMS Internship – Admin Panel & Dynamic Website Integration

**Role**: Senior MERN Stack Developer  
**Status**: Completed, Fully Tested & Production Ready  
**Repository Working Tree**: Clean (all 90/90 tests passing)

---

## 1. Executive Summary

This project delivers a complete, production-grade Content Management System built using the **MERN** stack (MongoDB, Express.js, React 18, Node.js). The application is decoupled into:
1. **Admin Panel Experience**: Secure, authenticated control center for managing content lifecycles, monitoring stats, updating publication states, and previewing media assets.
2. **Public Website Experience**: Fast, responsive consumer-facing portal displaying only published content fetched dynamically from MongoDB through REST APIs.
3. **Robust Backend API**: Modular Express server featuring centralized error handling, Mongoose data modeling, bcryptjs password hashing, and stateless JWT authentication.

---

## 2. Architecture & Design Patterns

### Backend Architecture
```
backend/
├── config/db.js               -> Managed Mongoose connection with error handling
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
└── server.js                  -> Express app bootstrap, CORS configuration, centralized routing
```

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
| **Password Hashing** | Uses `bcryptjs` with 12 salt rounds inside Mongoose `pre('save')` hook | Verified |
| **Credential Shielding** | Schema configures `password: { select: false }`; passwords are never returned in queries or API responses | Verified |
| **Stateless Auth** | Signed JSON Web Tokens (`JWT_SECRET`) with configurable expiration (`7d`) | Verified |
| **Route Protection** | `protect` middleware guards all `/api/admin/*` and `/api/auth/me` endpoints | Verified |
| **No Public Registration** | Public registration routes are omitted; returns 404 to prevent unauthorized accounts | Verified |
| **Draft Protection** | Public endpoints (`/api/content` and `/api/content/:idOrSlug`) query `{ status: 'Published' }` only | Verified |
| **Input Validation** | Mongoose schema validators enforce required fields and HTTP/HTTPS image URL regex patterns | Verified |
| **CORS Policy** | Whitelists verified local and production client origins | Verified |
| **Secret Management** | All credentials and secrets are kept in `.env` and omitted from git history via `.gitignore` | Verified |

---

## 4. Evaluator Quick-Start Guide

### Step 1: Clone & Install
```bash
git clone <repository-url>
cd Content-Management-System

# Install all dependencies for both backend and frontend from root
npm run install:all
```

### Step 2: Seed Database
Ensure MongoDB is running locally (`mongodb://localhost:27017/cms_internship`), then run:
```bash
# Creates the admin user (admin@cms.com / Admin@123456)
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

## 5. Live Demonstration Checklist

- [x] **Admin Login**: Sign in at `http://localhost:5173/admin/login` using `admin@cms.com` / `Admin@123456`.
- [x] **Dashboard Overview**: Verify live metric counts (Total, Published, Drafts) and the recent content table.
- [x] **Create Content**: Create a new article with title, description, category, and an image URL. Note the real-time image preview. Save as `Draft`.
- [x] **Verify Draft Shielding**: Open the public website at `http://localhost:5173/`. Verify the new draft does **not** appear publicly.
- [x] **Publish Content**: In `/admin/content`, click the yellow `Draft` badge to toggle it to `Published`. Refresh public site: article appears immediately.
- [x] **Edit Content**: Update the article's title or content. Verify the changes are reflected on the public article detail page (`/articles/:id`).
- [x] **Delete Content**: Delete the article from the admin table after confirming the dialog. Verify complete removal from MongoDB and the public site.

---

## 6. Automated Test Suite Results

All 4 test suites pass with a **100% success rate (90 of 90 assertions)**:

```text
1. Full End-to-End Workflow Test (npm test):
   - Health check: 200 OK
   - Protected route rejection: 401 Unauthorized
   - Admin login & JWT verification: PASS
   - Content creation as Draft: PASS
   - Draft shielding verification: PASS
   - Content update & slug regeneration: PASS
   - Status toggle to Published: PASS
   - Public visibility verification: PASS
   - Reverting to Draft & revocation: PASS
   - Content deletion & DB clean-up: PASS
   Result: 18/18 PASS

2. Phase 3 Test Suite (npm run test:phase3):
   - MongoDB Mongoose connection: PASS
   - Required fields validation (title, description, category, image, content): PASS
   - Image URL format validation: PASS
   - Default status ('Draft') verification: PASS
   - Database persistence & timestamps: PASS
   Result: 16/16 PASS

3. Phase 4 Test Suite (npm run test:phase4):
   - Password bcryptjs pre-save hashing: PASS
   - Password comparison method: PASS
   - Credential validation & JWT generation: PASS
   - Rejection of tampered / missing tokens: PASS
   - Public registration route blocking: PASS
   Result: 23/23 PASS

4. Phase 5 Test Suite (npm run test:phase5):
   - Admin CRUD operations: PASS
   - Invalid MongoDB ObjectId handling (400 CastError): PASS
   - Non-existent resource handling (404 Not Found): PASS
   - Slug and ID-based public retrieval: PASS
   Result: 33/33 PASS
```

---

## 7. Cloud Deployment Guide (Free Tier)

### A. Database (MongoDB Atlas)
1. Create a free shared cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist IP `0.0.0.0/0` (allow access from anywhere).
3. Copy your connection string into `MONGODB_URI`.

### B. Backend API (Render / Railway)
1. Push your code to GitHub.
2. In [Render](https://render.com/), create a new **Web Service** connected to your repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI`: `<your-atlas-uri>`
     - `JWT_SECRET`: `<secure-random-string>`
     - `JWT_EXPIRES_IN`: `7d`
     - `PORT`: `10000`
     - `CLIENT_URL`: `https://<your-frontend>.vercel.app`
     - `SEED_ADMIN_EMAIL`: `admin@cms.com`
     - `SEED_ADMIN_PASSWORD`: `Admin@123456`
     - `SEED_ADMIN_NAME`: `CMS Admin`

### C. Frontend Client (Vercel / Netlify)
1. In [Vercel](https://vercel.com/), create a new project connected to your repository.
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**:
     - `VITE_API_BASE_URL`: `https://<your-render-backend-url>/api`
3. Deploy!
