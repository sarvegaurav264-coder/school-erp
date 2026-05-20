# 🏫 School ERP System

> Enterprise-grade School Management System built with the MERN Stack

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS 3 + Recharts |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (Access + Refresh tokens) + bcrypt |
| **Icons** | React Icons (Heroicons) |
| **Notifications** | React Hot Toast |

## ✨ Features

### 📊 Dashboard
- Real-time analytics with interactive charts
- Student enrollment trends (Area chart)
- Fee collection overview (Bar chart)
- Gender distribution (Pie chart)
- Recent notices and upcoming exams

### 👨‍🎓 Student Management
- Full CRUD with search and pagination
- Student profile with parent information
- Class-wise filtering
- Auto-generated student IDs

### 👨‍🏫 Teacher Management
- CRUD operations with qualification tracking
- Experience and salary management
- Class teacher assignment

### 🏛️ Class Management
- Class-section organization with card layout
- Capacity tracking and student count
- Class teacher assignment

### 📚 Subject Management
- Subject-class-teacher mapping
- Core/Elective/Lab type categorization
- Marks configuration

### ✅ Attendance
- Bulk marking with one-click status
- Real-time present/absent/late counters
- Date and class-wise filtering

### 📝 Exam Management
- Exam scheduling with status tracking
- Dynamic subject loading per class
- Multiple exam types support

### 💰 Fee Management
- Fee creation with discount and fine
- Payment recording with multiple methods
- Collection statistics dashboard
- Status filtering (Paid/Unpaid/Partial/Overdue)

### 📢 Notice Board
- Category-based notices with priority levels
- Audience targeting (All/Students/Teachers/Parents)
- Emoji-enhanced category display

### 📅 Timetable
- Day-wise period management
- Subject and teacher assignment per period
- Visual timetable editor

### ⚙️ Settings
- Profile management
- Password change with validation

### 🔒 Security
- JWT authentication with refresh tokens
- Role-based access control (Admin/Teacher/Student/Parent)
- Rate limiting and Helmet security headers
- Input validation with express-validator
- Protected frontend routes

## 📁 Project Structure

```
SCHOOL ERP/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (10 controllers)
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/          # Mongoose schemas (10 models)
│   ├── routes/          # API routes (11 route files)
│   ├── utils/           # Helpers and seed script
│   ├── server.js        # Express entry point
│   └── .env             # Environment variables
├── frontent/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React contexts (Auth)
│   │   ├── pages/       # Page components (11 pages)
│   │   ├── services/    # API service layer
│   │   ├── App.jsx      # Router
│   │   └── main.jsx     # Entry point
│   └── index.html
└── README.md
```

## 🛠️ Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontent
npm install
```

### 2. Environment Setup

```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontent/.env.example frontent/.env
```

Edit `backend/.env` with your MongoDB URI and JWT secrets.

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates sample data with admin login:
- **Email:** `admin@school.com`
- **Password:** `admin123`

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontent
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/dashboard/stats` | Dashboard analytics |
| GET/POST | `/api/students` | List/Create students |
| GET/PUT/DELETE | `/api/students/:id` | Read/Update/Delete student |
| GET/POST | `/api/teachers` | List/Create teachers |
| GET/POST | `/api/classes` | List/Create classes |
| GET/POST | `/api/subjects` | List/Create subjects |
| POST | `/api/attendance/mark` | Bulk mark attendance |
| GET/POST | `/api/exams` | List/Create exams |
| GET/POST | `/api/fees` | List/Create fees |
| POST | `/api/fees/:id/pay` | Record payment |
| GET/POST | `/api/notices` | List/Create notices |
| GET/POST | `/api/timetable` | Get/Save timetable |

## 🎨 Design System

- **Theme:** Dark mode with glassmorphism
- **Colors:** Indigo primary, custom dark palette
- **Typography:** Inter font family
- **Animations:** Fade-in, slide-up, count-up
- **Components:** Glass cards, gradient buttons, neon shadows

## 📄 License

MIT License — feel free to use for any project.
