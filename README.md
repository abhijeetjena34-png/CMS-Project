# CMS Project — Admin Panel & Dynamic Website Integration

A professional, production-style full-stack **MERN** Content Management System. Built with clean modular architecture, JWT-based admin authentication, complete content CRUD, live image previews, responsive UI design, and dynamic public website integration backed by MongoDB.

---

## 📋 Features

### Admin Panel (Protected)
- 🔐 **Secure Authentication**: Admin login with bcryptjs password hashing (12 salt rounds) and signed JWT tokens. No public registration route.
- 📊 **Executive Dashboard**: Live metric counters displaying Total Content, Published, and Draft counts, with a recent content table.
- 📄 **Content Management Table**: Sortable table with responsive layout displaying titles, categories, dates, and dynamic action buttons.
- 🔄 **One-Click Status Toggle**: Toggle between `Draft` and `Published` instantly.
- ➕ **Content Creation & Editing**: Clean, validated forms for title, description, category, cover image URL, and full article body.
- 🖼️ **Live Image Preview**: Real-time thumbnail preview as the user types the image URL, with automatic fallback and error handling.
- 🗑️ **Safe Deletion**: Deletion with confirmation prompt.
- 🚪 **Session Management**: Logout functionality with local token invalidation and automatic redirect on 401 Unauthorized.

### Public Website (Visitor Facing)
- 🌐 **Home Page**: Modern hero section with call-to-action and latest featured published articles.
- 📰 **Articles Directory**: Real-time keyword search and dynamic category filter pills.
- 🔍 **Article Detail Page**: Full-length view with hero image, metadata, category labels, and formatted text body.
- 🛡️ **Draft Shielding**: Draft articles are strictly hidden from all public APIs and routes. Navigating directly to a draft URL returns a 404 state.
- 📱 **Responsive Design**: Designed with Tailwind CSS across mobile, tablet, and desktop viewports.
- 🚫 **No Hardcoded Content**: 100% of displayed content is retrieved dynamically from MongoDB through REST APIs.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Database** | MongoDB | Atlas or local instance (server version not pinned) | Document store for Content and Admin accounts |
| **ODM** | Mongoose | 8.24.8 (lockfile) | Schema modeling, pre-save hooks, validation |
| **Backend** | Node.js + Express.js | Express 4.22.3 (lockfile) | RESTful API server, routing, middleware |
| **Security** | bcryptjs + jsonwebtoken | 2.4.3 / 9.0.3 (lockfile) | Password hashing & stateless JWT auth |
| **Frontend** | React 19 + Vite | React 19.3.1 / Vite 8.3.8 (lockfile) | Fast, component-based user interface |
| **Styling** | Tailwind CSS | ^3.4.19 | Modern responsive utility-first styles |
| **Routing** | React Router DOM | ^7.18.5 | Declarative client-side routing & route guards |
| **HTTP Client** | Axios | ^1.21.1 | Interceptors for JWT attachment and 401 handling |

---

## 📁 Project Structure

```
CMS-Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # Cached Mongoose connection promise & error handling
│   ├── controllers/
│   │   ├── authController.js     # Admin login & profile handlers
│   │   └── contentController.js  # Content CRUD & public endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token protection guard
│   │   └── errorHandler.js       # Centralized error handler (CastError, ValidationError)
│   ├── models/
│   │   ├── Admin.js              # Admin schema with bcrypt hooks & comparePassword
│   │   └── Content.js            # Content schema with slug hook & URL validation
│   ├── routes/
│   │   ├── adminContentRoutes.js # Protected admin CRUD routes (/api/admin/content)
│   │   ├── authRoutes.js         # Auth routes (/api/auth/login, /api/auth/me)
│   │   └── publicContentRoutes.js# Public content routes (/api/content)
│   ├── utils/
│   │   ├── seedAdmin.js          # Admin account creation script
│   │   ├── seedContent.js        # Sample articles seed script
│   │   ├── testPhase3.js         # Phase 3 MongoDB & Model test suite
│   │   ├── testPhase4.js         # Phase 4 Auth & Middleware test suite
│   │   ├── testPhase5.js         # Phase 5 CRUD & Error Handling test suite
│   │   └── testWorkflow.js       # End-to-end integration workflow
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies & npm scripts
│   └── server.js                 # Express app export, local listener & CORS
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance with request/response interceptors
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx   # Admin page container with sidebar
│   │   │   │   └── AdminSidebar.jsx  # Sidebar navigation with active indicator & logout
│   │   │   ├── public/
│   │   │   │   ├── ContentCard.jsx   # Article card component
│   │   │   │   └── PublicNavbar.jsx  # Public site navigation header
│   │   │   └── shared/
│   │   │       ├── ProtectedRoute.jsx# Auth route guard (redirects to /admin/login)
│   │   │       └── Spinner.jsx       # Reusable loading spinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state provider
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── ContentFormPage.jsx # Add & Edit content form with live image preview
│   │   │   │   ├── ContentListPage.jsx # Content manager table with status toggle & delete
│   │   │   │   ├── DashboardPage.jsx   # Admin dashboard with live stats
│   │   │   │   └── LoginPage.jsx       # Clean admin sign-in form
│   │   │   └── public/
│   │   │       ├── ArticleDetailPage.jsx # Individual article view
│   │   │       ├── ArticlesPage.jsx     # Search & category filtered articles listing
│   │   │       └── HomePage.jsx         # Public landing page with hero & latest articles
│   │   ├── App.jsx               # Route definitions
│   │   ├── index.css             # Tailwind base & component utilities
│   │   └── main.jsx              # Application bootstrap
│   ├── .env.example              # Frontend environment template
│   ├── index.html                # HTML document entry
│   ├── package.json              # Frontend dependencies
│   ├── vercel.json               # Vite build settings & React Router SPA fallback
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.js            # Vite configuration
├── .gitignore                    # Prevents committing node_modules, .env, and dist
└── README.md                     # Comprehensive project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.19+ or 22.12+, as required by Vite 8)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017 or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Clone the repository
```bash
git clone https://github.com/abhijeetjena34-png/CMS-Project.git
cd CMS-Project
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
```

Copy the variable names from `backend/.env.example` into `backend/.env` and set their values locally. For local development, point `MONGODB_URI` at your local MongoDB database named `cms_project`; use private values for `JWT_SECRET` and the seed-admin variables. `PORT` should match the frontend API configuration, and `CLIENT_URL` should match the local frontend origin.

> 🔒 **Security Notice**: Admin credentials and secrets must be configured privately in `backend/.env`. Never commit `.env` files to version control.

To generate a cryptographically secure 256-bit JWT secret for your private environment:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
```

Configure your `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 👤 Creating the First Admin & Initial Content

Because public registration is disabled by design to protect the system, initialize your administrator account using the seed script:

```bash
cd backend

# 1. Create the initial admin account (reads credentials from backend/.env)
npm run seed

# 2. (Optional) Seed initial sample articles (3 Published, 1 Draft)
npm run seed:content
```

Admin Credentials:
- Sign in using the `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` values you configured in `backend/.env`.

---

## 🚀 Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev        # Development mode with auto-reload
# or
npm start          # Standard Node execution
```
The backend API starts on **http://localhost:5001**.

### Start the Frontend Client
```bash
cd frontend
npm run dev
```
The React application starts on **http://localhost:5173** (or **http://localhost:5174**).

---

## ☁️ Vercel Deployment

Deploy the frontend and backend as **two separate Vercel projects** from this repository. The backend runs the existing Express application as a Vercel Serverless Function; the frontend is a Vite static build.

### Backend API project
1. Import the repository into Vercel as a new project and set **Root Directory** to `backend`.
2. Use the `backend` package manifest and lockfile. No separate backend `vercel.json` is required: `backend/server.js` exports the Express app for Vercel and starts `app.listen()` only when run directly with `npm start`.
3. Configure these production environment variable names in the Vercel project (set their private values in Vercel, not in Git):
   - `MONGODB_URI` — Atlas connection URI for the existing `cms_project` database.
   - `JWT_SECRET` — private JWT signing secret.
   - `CLIENT_URL` — exact production origin of the frontend (scheme and host, without an API path).
4. Deploy the backend. Existing routes remain under `/api`, including `/api/health`, `/api/auth`, `/api/admin/content`, and `/api/content`.

The database connection is established before API route handling. A module-level promise reuses an in-progress connection across concurrent requests and warm function invocations; an already-open Mongoose connection is reused, and a failed connection attempt clears the promise for a later retry. The health endpoint is registered before the database middleware, so a successful health response alone does not confirm Atlas connectivity.

### Frontend project
1. Import the same repository as a second Vercel project and set **Root Directory** to `frontend`.
2. Use the Vite build command `npm run build` and output directory `dist` (also recorded in `frontend/vercel.json`).
3. Set the production environment variable `VITE_API_BASE_URL` to the deployed backend origin followed by `/api` (for example, `https://<backend-domain>/api`). Do not use localhost for the production value.
4. Deploy the frontend. The `frontend/vercel.json` rewrite sends client-side routes to `index.html`, supporting direct visits and browser refreshes.
5. Set the backend `CLIENT_URL` to the frontend's exact production origin. If it changes, update the backend environment variable and redeploy the backend.

Production CORS permits the configured `CLIENT_URL` and requests without an `Origin` header; localhost origins are also allowed for development. Preview deployments on other origins are not automatically allowed. Add a preview origin only if needed, using an intentional CORS configuration change.

Deployment is not complete until both projects are deployed and the production API, authentication, content behavior, CORS, and frontend routes have been tested.

---

## 🧪 Automated Testing Suite

Four comprehensive test suites are provided to verify all layers of the application:

```bash
cd backend

# Run the complete end-to-end integration workflow
npm test

# Run Phase 3: MongoDB connection and Content model validation tests
npm run test:phase3

# Run Phase 4: Admin authentication, JWT token, and middleware guard tests
npm run test:phase4

# Run Phase 5: Complete Content CRUD REST APIs & Error handling tests
npm run test:phase5
```

---

## 📡 API Endpoints Reference

### Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns server health and status |

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin credentials, returns JWT token |
| `GET` | `/api/auth/me` | Protected | Returns authenticated admin profile |

### Admin Content Management (Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/content` | Protected | Lists all content items (Draft & Published) |
| `POST` | `/api/admin/content` | Protected | Creates a new content item |
| `GET` | `/api/admin/content/:id` | Protected | Fetches an individual content item by ID |
| `PUT` | `/api/admin/content/:id` | Protected | Updates an existing content item |
| `DELETE` | `/api/admin/content/:id` | Protected | Deletes a content item from the database |
| `PATCH` | `/api/admin/content/:id/status` | Protected | Toggles item status between `'Draft'` and `'Published'` |

### Public Content (Visitor Accessible)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/content` | Public | Fetches all published articles (drafts excluded) |
| `GET` | `/api/content/:idOrSlug` | Public | Fetches one published article by MongoDB ID or slug |

---

## 🎬 Final Demonstration Guide (Step-by-Step)

Follow this 7-step walkthrough to evaluate the entire project:

### Step 1: Admin Login
1. Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login) in your browser.
2. Enter the administrator email and password configured in your `backend/.env`.
3. Click **Sign In**. The JWT token is saved, and you are redirected to the Admin Dashboard.

### Step 2: Dashboard Overview
1. View the metric cards at the top: **Total Content**, **Published**, and **Drafts**.
2. Notice the **Recent Content** table displaying live records fetched from MongoDB.

### Step 3: Add New Content
1. Navigate to **Add Content** (`/admin/content/new`) via the sidebar or top button.
2. Enter a title: `Demo Article: Building Production MERN Apps`.
3. Enter a description: `A comprehensive live demo of dynamic content creation.`.
4. Select a category (e.g., `Technology`).
5. Keep status as `Draft`.
6. Enter an image URL: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97`.
   - *Notice the live image preview renders below the input immediately.*
7. Enter content body text.
8. Click **Create Content**. You are redirected to the Content List.

### Step 4: Verify Draft Shielding
1. Open the public website at [http://localhost:5173/](http://localhost:5173/) in a new tab or incognito window.
2. Check the articles list: your new article **does not appear** because its status is `Draft`.

### Step 5: Publish the Content
1. Return to the Admin Content List (`/admin/content`).
2. Locate the demo article and click the yellow **Draft** status badge.
3. The badge turns green and displays **Published** instantly.
4. Switch back to the public website ([http://localhost:5173/](http://localhost:5173/)) and refresh.
5. The article now appears immediately in the Latest Articles grid!

### Step 6: Edit the Content
1. In the admin panel, click **Edit** next to your article.
2. Change the title to `Demo Article: Building Production MERN Apps [Updated]`.
3. Click **Update Content**.
4. View the public article detail page by clicking the article card on the public website. The updated title and content are displayed.

### Step 7: Delete Content
1. In the Admin Content List, click **Delete** next to the article.
2. Confirm the browser prompt.
3. The record is removed from the table and deleted from MongoDB.
4. Refresh the public website: the article is completely removed.

---

## 🔒 Security Practices

- **Password Hashing**: Passwords are never stored in plain text; hashed using `bcryptjs` with 12 salt rounds.
- **Sensitive Field Shielding**: Schema defines `select: false` on the password field, ensuring it is never leaked in queries or API responses.
- **No Public Registration**: Prevents unauthorized accounts from being created.
- **CORS Policy**: Allows the configured production frontend origin and development localhost origins.
- **Environment Isolation**: All credentials, database URLs, and JWT secrets are kept in `.env` files and omitted from version control via `.gitignore`.

---

## 📦 GitHub Submission Checklist

- [x] Backend and frontend code fully modularized and functional.
- [x] `.gitignore` verified to exclude `.env`, `node_modules/`, and build artifacts.
- [x] Environment example files (`backend/.env.example`, `frontend/.env.example`) provided with clear instructions.
- [ ] Run the provided automated test scripts against the intended database before release; test results are not asserted by this checklist.
- [ ] Keep real credentials and secrets out of all commits; `.env` files must remain ignored.

To push to your remote GitHub repository:
```bash
git remote add origin https://github.com/abhijeetjena34-png/CMS-Project.git
git branch -M main
git push -u origin main
```
