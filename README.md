# 🚀 Real-Time Analytics Dashboard

A modern, production-ready **Real-Time Analytics Dashboard** built with the **MERN Stack**, featuring live data updates, interactive analytics, secure authentication, and a scalable architecture inspired by modern SaaS admin dashboards.

![CI/CD Pipeline](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)

## ✨ Features

### 🔐 Authentication
* JWT Authentication
* Secure Login & Registration with BCrypt hashing
* Protected Routes
* Role-Based Access Control (Admin, Manager, Viewer)
* No privilege escalation path during registration.

### 📊 Dashboard
* KPI Cards
* Revenue Analytics
* User Analytics
* Traffic Monitoring
* CPU & Memory Usage
* Server Status
* Recent Activity Feed
* Live Notifications

### 📈 Analytics
* Interactive Line Charts
* Area Charts
* Bar Charts
* Pie Charts
* Real-Time Updates using Socket.IO

### 📋 Data Management
* Reusable Data Tables
* Search
* Sorting
* Pagination
* Filtering
* Loading (Skeleton UI) & Empty States

### 🎨 UI/UX
* Responsive Design
* Dark & Light Mode via Context
* Modern Dashboard Layout
* Smooth Animations (Tailwind + Framer Motion)
* Mobile Friendly
* Accessible Components
* Toast Notifications (React-Toastify)

---

# 🏗 Architecture & Design

## Component Diagram
```text
React Frontend
        │
        ▼
   API Layer
        │
────────┼────────
▼       ▼       ▼
Auth  Dashboard  Socket
        │
        ▼
 Express Backend
        │
────────┼────────
▼       ▼       ▼
Routes  Service Repo
        │
        ▼
     MongoDB
```

## Tech Stack
### Frontend
* React 19 (Vite)
* Tailwind CSS v4
* React Router
* TanStack Query
* Axios
* Socket.IO Client
* Recharts
* React Hook Form
* Framer Motion

### Backend
* Node.js
* Express.js
* MongoDB / Mongoose
* Socket.IO
* JWT Authentication
* Bcrypt
* Winston (Structured Logging)
* Swagger UI (API Docs)

---

# 📁 Project Structure

```text
project/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/ (cards, charts, common, layout, tables, ui)
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/ (auth, Dashboard)
│   │   ├── providers/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── tests/
│   ├── utils/
│   └── server.js
│
├── docker-compose.yml
├── postman_collection.json
└── README.md
```

---

# 🧪 Getting Started

## Using Docker (Recommended)
You can run the entire application using Docker Compose with zero manual setup.
```
docker compose up --build
```
*   **Frontend**: http://localhost:80
*   **Backend/API**: http://localhost:5000
*   **Swagger API Docs**: http://localhost:5000/swagger-ui/index.html

## Manual Setup

### Clone the Repository
```
git clone <repository-url>
```

### Server Setup
```
cd server
npm install
npm run dev &
```

### Client Setup
```
cd client
npm install
npm run dev &
```

---

# 📄 API Documentation
The project includes automatic Swagger documentation. Once the server is running, navigate to:
`http://localhost:5000/swagger-ui/index.html`

A Postman collection is also included in the repository root (`postman_collection.json`) covering standard API interactions.

---

# 🔒 Security Audit Checklist
✔ Passwords are BCrypt hashed
✔ JWT expiration configured
✔ CORS restricted appropriately
✔ Role-based authorization works correctly
✔ No privilege escalation paths via registration

---

# 📌 Future Enhancements
* Multi-Tenant Support
* Refresh Tokens Implementation
* Export Reports (PDF/CSV)
* Automated E2E testing with Cypress or Playwright
* Kafka/Redis Integration for enterprise event streaming

---

# 📄 License
This project is licensed under the MIT License.
