# TaskFlow — Task Management System

A full-stack, production-quality **Task Management System (TaskFlow)** developed for the **MERN Stack Intern technical assessment at Xplore Intellects**. 

The system implements role-based access control (RBAC), real-time MongoDB task aggregation, responsive dashboard analytics, transactional email notifications via Nodemailer, server-side search, and pagination.

---

## 🚀 Key Features

* **Authentication & RBAC**:
  * Dual-role architecture: **Admin** and **Employee**.
  * Stateless **JWT (JSON Web Token)** authentication with automatic header injection.
  * Password hashing using **bcryptjs** (salting rounds = 10).
  * Protected frontend routing (`ProtectedRoute`) and backend middleware guards (`authMiddleware`, `roleMiddleware`).
* **Admin Capabilities**:
  * **Interactive Dashboard**: Real-time aggregated statistics from MongoDB for:
    * *Not Started*
    * *Pending / In Progress* (combined count)
    * *Completed*
  * **Employee Management**: Directory view displaying each employee's name, email, total assigned tasks, pending count, and completed count.
  * **Task Assignment**: Assign tasks to employees with required validation (Title, Description, Employee dropdown, Priority: High / Medium / Low).
  * **All Tasks Table**: Complete task records with priority and status visual badges.
  * **Search & Pagination**: Server-side multi-field regex search (by task title or employee name) coupled with MongoDB pagination (`page`, `limit`, `totalPages`, `total`).
* **Employee Capabilities**:
  * **Personal Workspace**: View strictly own assigned tasks (enforced on the backend; never exposed to other employees).
  * **Dynamic Task Status Update**: Seamless inline dropdown to switch task status between *Not Started*, *Pending*, *In Progress*, and *Completed*.
  * **Ownership Enforcement**: Backend strictly verifies `assignedTo === req.user._id` before permitting status changes.
* **Email Integration (Nodemailer)**:
  * **Task Assignment Email**: Automatically delivers a formatted email to the assigned employee upon task creation.
  * **Status Update Email**: Automatically delivers an alert email to the administrator when an employee updates task status (including previous status and new status).
  * **Graceful Fallback**: If SMTP credentials are omitted, the service gracefully simulates and logs email delivery to the console without interrupting API flows.
* **UI/UX & Design System**:
  * Modern, professional SaaS aesthetic built with CSS tokens (Inter font, slate backgrounds, crisp cards, subtle borders, and soft elevation shadows).
  * Toast notification system for instant feedback on actions and errors.
  * Fully responsive across desktop, tablet, and mobile screens with collapsible navigation drawer.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Lucide React, Custom Responsive CSS Design System |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT, bcryptjs, Nodemailer, CORS, dotenv |
| **Database** | MongoDB (v8.x / MongoDB Community Server or Atlas) |

---

## 📁 Project Structure

```
Task-Management/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Public static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskBadge.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── context/             # React Context Providers
│   │   │   ├── AuthContext.jsx  # Authentication state & token persistence
│   │   │   └── ToastContext.jsx # Alert toast notifications
│   │   ├── hooks/               # Custom React hooks (useAuth, useToast)
│   │   ├── layouts/             # DashboardLayout with responsive sidebar
│   │   ├── pages/               # Application views
│   │   │   ├── admin/           # AdminDashboard, AdminEmployees, AdminTasks
│   │   │   ├── employee/        # EmployeeDashboard, EmployeeTasks
│   │   │   ├── Forbidden.jsx    # 403 Forbidden page
│   │   │   ├── Login.jsx        # Split-screen SaaS Login page
│   │   │   └── NotFound.jsx     # 404 Not Found page
│   │   ├── routes/              # ProtectedRoute and AppRoutes
│   │   ├── services/            # Axios instance with interceptors (api.js)
│   │   ├── utils/               # Constants, date formatters, validators
│   │   ├── App.jsx              # Main App wrapper
│   │   ├── index.css            # Global SaaS design system & theme tokens
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend API (Node.js + Express)
│   ├── config/                  # Database (db.js) & Nodemailer (mailer.js)
│   ├── controllers/             # authController, employeeController, taskController
│   ├── middleware/              # authMiddleware, roleMiddleware, validate, errorHandler
│   ├── models/                  # User.js, Task.js
│   ├── routes/                  # authRoutes, employeeRoutes, taskRoutes
│   ├── services/                # emailService.js (transactional email templates)
│   ├── utils/                   # generateToken.js, seedData.js
│   ├── .env.example             # Template for environment configuration
│   ├── server.js                # Express app entry point & route registration
│   └── package.json
│
├── .gitignore                   # Ignores node_modules, .env, and build artifacts
├── README.md                    # Project documentation
└── package.json                 # Monorepo root scripts (dev, seed, install:all)
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or newer)
* **npm** (v9 or newer)
* **MongoDB** (running locally on port `27017` or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Task-Management
```

### 2. Install all dependencies
Run the root script to install dependencies for both `server` and `client`:
```bash
npm run install:all
```
*Or manually:*
```bash
cd server && npm install
cd ../client && npm install
cd ..
```

---

## 🔐 Environment Variables

A `.env.example` file is provided in the `server/` directory.

Create a `server/.env` file:
```bash
cp server/.env.example server/.env
```

Configure your environment values:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow_db
JWT_SECRET=super_secret_jwt_key_xplore_intellects_taskflow_2026
CLIENT_URL=http://localhost:5173

# Email configuration (Nodemailer)
# Leave empty to use safe console simulation mode, or provide valid SMTP details
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@taskflow.com
```

> **Note on Email:** If `EMAIL_USER` or `EMAIL_PASS` are left empty, the application automatically uses safe email simulation mode (details are logged in the terminal), ensuring that task assignments and updates continue without any SMTP connection errors.

---

## 🗄️ Database Seeding

Run the seed script to wipe test collections and generate demo users and sample tasks:
```bash
npm run seed
```
*Or from the server directory:*
```bash
cd server && node utils/seedData.js
```

### 👤 Seeded Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | System Admin | `admin@taskflow.com` | `Admin@123` |
| **Employee** | John Doe | `john.doe@taskflow.com` | `Employee@123` |
| **Employee** | Jane Smith | `jane.smith@taskflow.com` | `Employee@123` |
| **Employee** | Robert Brown | `robert.brown@taskflow.com` | `Employee@123` |

*(Quick-fill buttons for these credentials are also provided directly on the Login page for convenience).*

---

## 🏃 Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Option B: Run Separately
**Terminal 1 (Backend API Server):**
```bash
npm run server
# Runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 API Documentation

All protected endpoints require the following header:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user and returns JWT + user profile |
| `GET` | `/api/auth/me` | Private | Revalidates active session and retrieves user object |

### Employee Management Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees` | Admin | Returns all employees with aggregated task counts |

### Task Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/stats` | Admin | Returns MongoDB task counts by status for cards |
| `GET` | `/api/tasks` | Admin | Paginated task list supporting `?search=`, `?page=`, `?limit=` |
| `POST` | `/api/tasks` | Admin | Creates and assigns task; sends email to employee |
| `GET` | `/api/tasks/my` | Employee | Returns only tasks assigned to logged-in employee |
| `PATCH` | `/api/tasks/:id/status` | Employee | Updates task status; ownership verified; sends email to Admin |

---

## 🧪 Verification & Testing Checklist

- [x] **Authentication**: Admin and Employee can login with seeded credentials; invalid credentials display a clean error alert.
- [x] **Role Protection**: Unauthenticated requests redirect to `/login`. Employees accessing `/admin/*` are blocked.
- [x] **Admin Dashboard**: Live statistics cards accurately display counts for *Not Started*, *Pending / In Progress*, and *Completed*.
- [x] **Employee Management**: Admin can view all registered employees and their assigned task counts.
- [x] **Task Creation**: Admin can assign tasks via modal dialog with full input validation (title max 150 chars, required employee, priority).
- [x] **Search & Pagination**: Server-side search on title and employee name works seamlessly with page controls.
- [x] **Employee Workspace**: Employee only sees their assigned tasks; cannot view or edit tasks belonging to others.
- [x] **Status Updates**: Employee updates status via dropdown, triggering automatic email notification and live badge refresh.
- [x] **Email Notifications**: Formatted HTML emails generated for both assignment and status changes.
- [x] **Responsive SaaS UI**: Verified layout on desktop, laptop, tablet, and mobile viewports.
#   T a s k - M a n a g e m e n t  
 