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
| **Database** | MongoDB | ≥ 6.0 | Document store for Content and Admin accounts |
| **ODM** | Mongoose | ^8.4.1 | Schema modeling, pre-save hooks, validation |
| **Backend** | Node.js + Express.js | Node 22 / Express ^4.19.2 | RESTful API server, routing, middleware |
| **Security** | bcryptjs + jsonwebtoken | ^2.4.3 / ^9.0.2 | Password hashing & stateless JWT auth |
| **Frontend** | React 18 + Vite | React 18 / Vite ^8.3.8 | Fast, component-based user interface |
| **Styling** | Tailwind CSS | ^3.4.17 | Modern responsive utility-first styles |
| **Routing** | React Router DOM | ^6.23.1 | Declarative client-side routing & route guards |
| **HTTP Client** | Axios | ^1.7.2 | Interceptors for JWT attachment and 401 handling |

---

## 📁 Project Structure

```
cms-internship/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & error handling
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
│   │   └── testWorkflow.js       # Complete 11-step end-to-end integration test
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies & npm scripts
│   └── server.js                 # Express application entry point & CORS
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
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.js            # Vite configuration
├── .gitignore                    # Prevents committing node_modules, .env, and dist
└── README.md                     # Comprehensive project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017 or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Content-Management-System
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
```

Configure your `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/cms_internship
JWT_SECRET=cms_internship_jwt_secret_dev_only_change_in_prod
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Seed Admin Credentials
SEED_ADMIN_EMAIL=admin@cms.com
SEED_ADMIN_PASSWORD=Admin@123456
SEED_ADMIN_NAME=CMS Admin
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

Because public registration is disabled by design, use the provided seed scripts:

```bash
cd backend

# 1. Create the initial admin account
npm run seed

# 2. (Optional) Seed realistic sample articles (3 Published, 1 Draft)
npm run seed:content
```

Default Admin Credentials:
- **Email**: `admin@cms.com`
- **Password**: `Admin@123456`

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

## 🧪 Automated Testing Suite

Four comprehensive test suites are provided to verify all layers of the application:

```bash
cd backend

# Run complete end-to-end workflow (11-step lifecycle test)
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
2. Enter email: `admin@cms.com` and password: `Admin@123456`.
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
- **Strict CORS Policy**: Restricted to configured frontend origins.
- **Environment Isolation**: All credentials, database URLs, and JWT secrets are kept in `.env` files and omitted from version control via `.gitignore`.

---

## 📦 GitHub Submission Checklist

- [x] Backend and frontend code fully modularized and functional.
- [x] `.gitignore` verified to exclude `.env`, `node_modules/`, and build artifacts.
- [x] Environment example files (`backend/.env.example`, `frontend/.env.example`) provided with clear instructions.
- [x] All 18 automated integration tests passing.
- [x] No sensitive credentials or secrets committed to git history.

To push to your remote GitHub repository:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
