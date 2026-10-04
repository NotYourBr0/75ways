# 75ways - Enterprise Content Management & Agency Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248.svg)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A scalable, production-ready full-stack web platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). This platform provides a comprehensive content management solution featuring:

1. **Admin Control Panel** (rontend/admin-panel) - An administrative dashboard with real-time analytics, content publishing, taxonomy management, user moderation, and review approvals.
2. **Client CMS Portal** (rontend/user-cms-dashboard) - A modern client/public-facing website built with Vite and Tailwind CSS for showcasing services, blogs, interviews, and user feedback.
3. **Scalable REST API** (ackend/) - A secure, modular Express server integrated with MongoDB Atlas, JWT authentication, and Cloudinary media processing.

---

## Architecture & Monorepo Structure

`
75ways/
├── backend/                        # Express.js REST API
│   ├── src/
│   │   ├── controller/             # Business logic & request handlers
│   │   ├── routes/                 # Express API route declarations
│   │   ├── schema/                 # Mongoose data models
│   │   └── uploads/                # Local asset fallback storage
│   ├── .env.example                # Backend environment template
│   ├── package.json
│   └── server.js                   # Application entry point
│
├── frontend/
│   ├── admin-panel/                # React.js Admin Management Suite
│   │   ├── public/                 # Static assets & HTML template
│   │   ├── src/
│   │   │   ├── components/         # Modular dashboard screens & layouts
│   │   │   │   ├── Screens/        # Category, Tags, Blog, Services, FAQs, Profile
│   │   │   │   └── Styles/         # Component & layout stylesheets
│   │   │   ├── context/            # React AuthContext & ReviewsContext
│   │   │   ├── App.js              # Application routing & route protection
│   │   │   └── index.css           # Global layout & viewport locking
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── user-cms-dashboard/         # Vite + React + Tailwind Client App
│       ├── public/                 # Public assets & brand icons
│       ├── src/
│       │   ├── components/         # Reusable UI cards, navigation, footer
│       │   ├── context/            # Client Authentication state
│       │   ├── pages/              # Home, Blogs, Services, Interviews, Login
│       │   ├── App.jsx             # React Router v7 routes
│       │   └── main.jsx            # Vite DOM mount
│       ├── .env.example
│       ├── tailwind.config.js      # Custom theme & utility configurations
│       ├── vite.config.js          # Vite build configuration
│       └── package.json
│
├── .gitignore                      # Universal git exclusions (node_modules, .env)
└── README.md                       # Comprehensive project documentation
`

---

## Key Features

### 1. Admin Control Panel (rontend/admin-panel)
* **Live Analytics & Charts**: Visual data visualization using Recharts (interactive distributions) and summary counter widgets.
* **Content Publishing CMS**: Rich text authoring for blogs, articles, and announcements with categories and tag tagging.
* **Service Catalog**: Manage agency service offerings, hierarchical categories, and uploaded promotional graphics.
* **Interview Showcase**: Publish client spotlights, candidate profiles, and executive interviews.
* **User & Review Moderation**: Real-time moderation desk with unread badges, approval queues, and user privilege controls.
* **Refined Account Profile**: Clean account details, administrator badge, and instant session management.
* **Modern Responsive Design**: Pinned sidebar navigation, hidden scrollbars, and isolated content scrolling.

### 2. Client / User CMS Dashboard (rontend/user-cms-dashboard)
* **Blazing Fast Frontend**: Built with Vite and React 19 for instant page transitions and hot module replacement.
* **Tailwind CSS Styling**: Utility-first, mobile-first design with polished typography and dark accents.
* **Public Content Portal**: Dynamic blog directory, detailed article reader, and service portfolio.
* **Client Authentication**: User registration, login, and secure authenticated reviews.

### 3. Backend REST API (ackend/)
* **Modular MVC Structure**: Clear separation between routes, controllers, and Mongoose schemas.
* **Authentication & Security**: JSON Web Token (JWT) stateless auth, bcrypt password hashing, and CORS protection.
* **Media Handling**: Multer middleware paired with Cloudinary integration for scalable image assets.
* **REST Endpoints**: Comprehensive CRUD for Users, Blogs, Categories, Tags, Services, Interviews, and Reviews.

---

## Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js (v5.x), Mongoose (v8.x), JWT, Bcrypt.js, Cors, Dotenv |
| **Admin Panel** | React (v18), React Router (v7), Recharts, React Icons, Axios, SweetAlert2, React Toastify |
| **Client CMS** | React (v19), Vite (v7), Tailwind CSS (v3), PostCSS, React Icons |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Media & Storage** | Cloudinary & Multer Storage |
| **Hosting Targets** | **Render** (Backend API), **Vercel** (Frontends) |

---

## Local Development Setup

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **npm** (v9.x or later)
* **MongoDB** (Local instance or MongoDB Atlas connection URI)

---

### Step 1: Clone the Repository
`ash
git clone git@github.com:NotYourBr0/75ways.git
cd 75ways
`

---

### Step 2: Configure & Start Backend
1. Navigate to the backend folder:
   `ash
   cd backend
   `
2. Install dependencies:
   `ash
   npm install
   `
3. Create your .env file from the template:
   `ash
   cp .env.example .env
   `
4. Update .env with your MongoDB connection string and JWT secret:
   `env
   PORT=5000
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   `
5. Start the server:
   `ash
   npm start
   `
   *Backend will run at: http://localhost:5000*

---

### Step 3: Configure & Start Admin Panel
1. Open a new terminal and navigate to the admin panel:
   `ash
   cd frontend/admin-panel
   `
2. Install dependencies:
   `ash
   npm install
   `
3. Create .env (optional for local, defaults to port 5000):
   `env
   REACT_APP_API_URL=http://localhost:5000
   `
4. Start the development server:
   `ash
   npm start
   `
   *Admin Panel will run at: http://localhost:3000*

---

### Step 4: Configure & Start User CMS Dashboard
1. Open a third terminal and navigate to the user dashboard:
   `ash
   cd frontend/user-cms-dashboard
   `
2. Install dependencies:
   `ash
   npm install
   `
3. Create .env:
   `env
   VITE_API_URL=http://localhost:5000
   `
4. Start the Vite dev server:
   `ash
   npm run dev
   `
   *Client CMS will run at: http://localhost:5173*

---

## Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | ks@gmail.com | kartik123 |
| **Standard User** | Register any new account via Client Sign Up | Custom |

---

## Deployment Guide

### 1. Deploy Backend on Render
1. Create a **New Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository: NotYourBr0/75ways.
3. Configure settings:
   * **Root Directory**: ackend
   * **Environment**: Node
   * **Build Command**: 
pm install
   * **Start Command**: 
ode server.js
4. In **Environment Variables**, add:
   * MONGO_URL = <Your MongoDB Atlas URI>
   * JWT_SECRET = <Your JWT Secret>
   * PORT = 10000 (Render will map this automatically)

---

### 2. Deploy Admin Panel on Vercel
1. Import project in [Vercel](https://vercel.com/).
2. Select your 75ways repo.
3. In **Root Directory**, choose rontend/admin-panel.
4. Framework Preset: **Create React App**.
5. Add Environment Variable:
   * REACT_APP_API_URL = https://<your-render-backend-url>.onrender.com
6. Click **Deploy**.

---

### 3. Deploy User CMS Dashboard on Vercel
1. Add a **New Project** in Vercel.
2. Select your 75ways repo.
3. In **Root Directory**, choose rontend/user-cms-dashboard.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   * VITE_API_URL = https://<your-render-backend-url>.onrender.com
6. Click **Deploy**.

---

## REST API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/users/register | Register a new user account |
| POST | /api/users/login | Authenticate user & return JWT token |
| GET | /api/users | List registered users |
| PUT | /api/user/:id | Update profile information |
| GET | /api/blogs | Retrieve all published blog posts |
| POST | /api/blogs/create | Publish a new blog post |
| DELETE | /api/blogs/delete/:id| Remove a blog post |
| GET | /api/categories | Fetch category taxonomy |
| POST | /api/categories | Create a new category |
| GET | /api/tags | Fetch tag taxonomy |
| POST | /api/tags | Create a new tag |
| GET | /api/services | Retrieve agency services |
| POST | /api/addService | Create a new service entry |
| GET | /api/servicecategories | Retrieve service categories |
| GET | /api/interviews | List interview spotlight entries |
| POST | /api/addInterview | Create interview spotlight with media |
| GET | /api/reviews | Retrieve customer reviews |
| GET | /api/reviews/unread-count | Counter of pending unread reviews |
| GET | /api/faqs | List published FAQs |

---

## Author

**Kartik Swami**  
Full Stack Developer Candidate  
GitHub: [@NotYourBr0](https://github.com/NotYourBr0)
