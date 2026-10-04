# Full-Stack MERN CMS Platform

[![Internship Capstone](https://img.shields.io/badge/Internship_Project-Vidhema_Solutions-2563eb?style=for-the-badge&logo=google-classroom&logoColor=white)](https://github.com/NotYourBr0/75ways)
[![Role](https://img.shields.io/badge/Role-Full--Stack_Developer_Intern-059669?style=for-the-badge&logo=react&logoColor=white)](https://github.com/NotYourBr0/75ways)
[![Architecture](https://img.shields.io/badge/Architecture-Monorepo_MERN-d97706?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/NotYourBr0/75ways)
[![Author](https://img.shields.io/badge/Author-Kartik_Swami-7c3aed?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NotYourBr0)

> [!NOTE]
> ### 🎓 Industrial Training & Internship Capstone Project
> **Organization:** Vidhema Solutions  
> **Role:** Software Developer Trainee(Full-Stack)   
> **Author:** Kartik Swami ([@NotYourBr0](https://github.com/NotYourBr0))  
> 
> *This platform was designed, engineered, and presented as the final capstone project during my **Software Developer Trainee(Full-Stack) / Full-Stack Internship at Vidhema Solutions**. It delivers an end-to-end, production-grade content management system with role-based access control, interactive analytics, and multi-portal architecture.*

---

## 📌 Executive Summary

A complete, enterprise-grade Content Management System (CMS) and Agency Platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

Engineered from scratch to solve real-world agency workflows, the platform provides decoupled client and administrative experiences powered by a centralized REST API service:

* **Admin Control Panel (`frontend/admin-panel`)** — Executive administration suite with real-time analytics, CRUD workflows for blogs and services, tag/category taxonomies, and customer review moderation desk.
* **Client CMS Portal (`frontend/user-cms-dashboard`)** — High-performance, client-facing web application built with React 19, Vite, and Tailwind CSS for service discovery, blog exploration, and user feedback.
* **Backend REST API (`backend/`)** — Robust Express 5.x backend backed by MongoDB Atlas, stateless JWT authentication, bcrypt password hashing, and Cloudinary cloud media delivery.

---

## 🏢 Internship & Engineering Highlights

During my internship at **Vidhema Solutions**, I was responsible for the end-to-end design, development, and architectural decisions of this full-stack application:

| Focus Area | Engineering Implementation |
| :--- | :--- |
| **Monorepo Architecture** | Structured independent client, admin, and server services with decoupled dependency management. |
| **Authentication & RBAC** | Implemented stateless JWT auth with role verification ensuring administrative endpoints remain strictly protected. |
| **Media Pipeline** | Integrated Multer memory buffering and Cloudinary CDN for cloud-based media uploads and responsive delivery. |
| **Data Analytics** | Built interactive distribution charts and KPI summary widgets using Recharts for business metrics monitoring. |
| **Moderation Desk** | Created dynamic feedback review systems featuring unread-counter badges and status updates. |

---

## 📁 Repository Structure

```text
75ways/
├── backend/                        # Express 5 REST API & MongoDB Atlas models
│   ├── config/                     # Cloudinary & database connection
│   ├── controllers/                # Business logic for auth, blogs, reviews, etc.
│   ├── middleware/                 # JWT auth, role validation, file upload
│   ├── models/                     # Mongoose schemas (User, Blog, Review, etc.)
│   └── routes/                     # RESTful API route definitions
│
└── frontend/
    ├── admin-panel/                # React 18 Admin CMS Suite
    │   ├── src/components/         # Recharts analytics, navigation, modals
    │   ├── src/pages/              # Dashboard, Blog, Review moderation pages
    │   └── src/context/            # Admin state and auth context
    │
    └── user-cms-dashboard/         # React 19 + Vite + Tailwind Client Portal
        ├── src/components/         # Navbar, hero, testimonials, service cards
        ├── src/pages/              # Blog list, article views, contact forms
        └── src/context/            # Client auth and cart/wishlist context
```

| Service | Directory | Port | Key Technologies |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `backend/` | `5000` | Node.js, Express 5, MongoDB Atlas, JWT, Cloudinary |
| **Admin Control Panel** | `frontend/admin-panel/` | `3000` | React 18, Recharts, Custom CSS, React Router v7 |
| **Client CMS Portal** | `frontend/user-cms-dashboard/` | `5173` | React 19, Vite, Tailwind CSS, Context API |

---

##  Quick Start (Local Setup)

### Prerequisites
* **Node.js** (v18.x or v20.x)
* **npm** (v9.x or later)
* **MongoDB Atlas URI** (or local MongoDB)

---

### 1. Backend REST API
```bash
cd backend
npm install
cp .env.example .env
npm start
```
*Server runs on:* `http://localhost:5000`

---

### 2. Admin Control Panel
```bash
cd frontend/admin-panel
npm install
npm start
```
*Admin application runs on:* `http://localhost:3000`

---

### 3. Client CMS Portal
```bash
cd frontend/user-cms-dashboard
npm install
npm run dev
```
*Client application runs on:* `http://localhost:5173`

---

##  Demo Credentials

| Portal | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin Panel** | `ks@gmail.com` | `123456` | Full Administrator Privileges |
| **Client Portal** | `ks@gmail.com` | `123456` | Client / Registered User Access |

*(New user self-registration is also available directly through the Client Portal).*

---

## 🛠️ Tech Stack Matrix

| Domain | Technology |
| :--- | :--- |
| **Frontend - Admin** | React 18, React Router v7, Recharts, React Icons, Axios |
| **Frontend - Client** | React 19, Vite, Tailwind CSS, PostCSS, Lucide Icons |
| **Backend Framework** | Node.js, Express.js (v5), Mongoose (v8) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Media Delivery** | Cloudinary CDN, Multer multipart handler |

---

##  Core API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/login` | Authenticate user credentials and return signed JWT |
| `POST` | `/api/users/register` | Register new account with hashed password |
| `GET` | `/api/users` | List all system users (admin restricted) |
| `PUT` | `/api/user/:id` | Update profile information |
| `GET` | `/api/blogs` | Fetch published blogs with category/tag metadata |
| `POST` | `/api/blogs/create` | Create and publish a blog article |
| `DELETE` | `/api/blogs/delete/:id` | Delete blog article by ID |
| `GET` | `/api/categories` | Retrieve category taxonomies |
| `GET` | `/api/tags` | Retrieve tag taxonomies |
| `GET` | `/api/services` | Retrieve agency service catalog |
| `GET` | `/api/interviews` | Retrieve interview spotlight posts |
| `GET` | `/api/reviews` | Retrieve customer reviews |
| `GET` | `/api/reviews/unread-count` | Retrieve badge counter of pending reviews |

---

##  Developer & Internship Verification

This project was built and submitted by **Kartik Swami** as the capstone evaluation project for industrial training:

* **Developer:** Kartik Swami
* **Role:** Software Developer Trainee(Full-Stack) 
* **Organization:** Vidhema Solutions
* **Education:** B.Tech Computer Science & Engineering (AIET Jaipur / RTU Kota)
* **GitHub:** [@NotYourBr0](https://github.com/NotYourBr0)
* **Email:** ks806425@gmail.com
