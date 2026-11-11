# CMS Internship — Admin Panel & Dynamic Website

A full-stack **MERN** Content Management System built as an internship assignment. It features a secure admin panel for managing content and a dynamic public website that reflects changes in real time.

---

## 📋 Features

### Admin Panel
- 🔐 Secure JWT-based login (no public registration)
- 📊 Dashboard with total / published / draft counts
- 📄 View, create, edit and delete content records
- 🔄 Toggle Draft ↔ Published status with one click
- 🖼️ Image URL with live preview in the form
- 🚪 Logout with token invalidation

### Public Website
- 🌐 Home page with latest published articles
- 📰 Articles listing page with search + category filter
- 🔍 Individual article detail page
- 🚫 Draft content is never shown publicly
- 📱 Fully responsive (mobile + desktop)

---

## 🛠️ Technology Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React 18 + Vite          |
| Styling    | Tailwind CSS 3           |
| Routing    | React Router v6          |
| HTTP       | Axios                    |
| Backend    | Node.js + Express.js     |
| Database   | MongoDB + Mongoose       |
| Auth       | JWT + bcryptjs           |

---

## 📁 Folder Structure

```
cms-internship/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth guard + error handler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # Seed admin script
│   ├── server.js       # App entry point
│   └── .env.example    # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios instance + interceptors
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth context
│   │   └── pages/      # Admin + Public pages
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repo-url>
cd cms-internship
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env     # fill in your values
npm install
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
```

---

## 🔑 Environment Variables

### backend/.env
```
MONGODB_URI=mongodb://localhost:27017/cms_internship
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Used ONLY for the seed script — never commit real values
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=YourStrongPassword
SEED_ADMIN_NAME=Admin User
```

### frontend/.env
```
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 🚀 Running the Application

### Start the backend
```bash
cd backend
npm run dev        # development (nodemon auto-reload)
# or
npm start          # production
```
Backend runs on **http://localhost:5001**

### Start the frontend
```bash
cd frontend
npm run dev
```
Frontend runs on **http://localhost:5173** (or **http://localhost:5174**)

---

## 👤 Creating the First Admin & Sample Content

You **cannot** register through the UI. Use the secure seed scripts:

```bash
cd backend
# 1. Create the admin user
npm run seed

# 2. (Optional) Seed initial sample articles (3 Published, 1 Draft)
npm run seed:content
```

---

## 🧪 Automated Testing

We provide a comprehensive end-to-end integration test suite covering the complete workflow:
1. Server health check
2. Admin authentication & JWT issuing
3. Protected route enforcement (rejecting unauthorized requests)
4. Content CRUD operations
5. Draft vs Published visibility guarantees
6. Content deletion & database clean-up

Run tests anytime with:
```bash
cd backend
npm test
```

---

## 📡 API Endpoints

### Health
| Method | Endpoint     | Description      |
|--------|--------------|------------------|
| GET    | /api/health  | Server health    |

### Authentication
| Method | Endpoint        | Access  | Description        |
|--------|-----------------|---------|--------------------|
| POST   | /api/auth/login | Public  | Admin login        |
| GET    | /api/auth/me    | Private | Get current admin  |

### Admin Content (all require `Authorization: Bearer <token>`)
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | /api/admin/content              | List all content        |
| POST   | /api/admin/content              | Create content          |
| GET    | /api/admin/content/:id          | Get one content item    |
| PUT    | /api/admin/content/:id          | Update content          |
| DELETE | /api/admin/content/:id          | Delete content          |
| PATCH  | /api/admin/content/:id/status   | Toggle Draft/Published  |

### Public Content (no token required)
| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| GET    | /api/content           | Get all published content        |
| GET    | /api/content/:idOrSlug | Get one published item by ID/slug|

---

## 🧪 Testing the Full Workflow

1. Start backend (`npm run dev` in `/backend`)
2. Start frontend (`npm run dev` in `/frontend`)
3. Run seed script to create admin
4. Open `http://localhost:5173/admin/login`
5. Login with seed credentials
6. Create a content item — verify it's saved
7. Edit the content
8. Publish it — open public site and verify it appears
9. Change to Draft — verify it disappears publicly
10. Delete it — verify it's removed
11. Test a protected route without a token — should return 401

---

## 🔒 Security Notes

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT stored in localStorage (suitable for internship scope)
- CORS configured to only allow the frontend origin
- Password field never returned in any API response
- No public admin registration endpoint

---

*Built as a MERN Stack internship assignment.*

