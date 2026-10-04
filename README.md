# 75way - Full-Stack MERN CMS Platform

A production-grade, full-stack Content Management System (CMS) and Agency Web Platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

This project was engineered by **Kartik Swami** during his **Industrial Training / Full-Stack Internship at Vidhema Solutions**, designed to deliver an end-to-end content management workflow with role-based access control, interactive analytics, and multi-portal architecture.

---

## Project Overview

The platform consists of three decoupled, independently runnable services:

1. **Admin Control Panel (rontend/admin-panel)**  
   A dedicated administrative suite featuring live analytics, interactive charts, content publishing (blogs, interviews, services), tag/category taxonomy management, and user review moderation.
2. **Client CMS Portal (rontend/user-cms-dashboard)**  
   A modern, public-facing portal built with React 19, Vite, and Tailwind CSS for client discovery, service browsing, blog reading, and user feedback submission.
3. **Backend REST API (ackend/)**  
   A scalable Express 5.x server with MongoDB Atlas integration, JWT-based authentication, bcrypt encryption, and Cloudinary media processing.

---

## Repository Structure

| Directory | Role | Key Technologies |
| :--- | :--- | :--- |
| **ackend/** | REST API, Database Models & Controllers | Node.js, Express, MongoDB Atlas, JWT, Cloudinary |
| **rontend/admin-panel/** | Central Administrative Dashboard | React 18, Recharts, Custom CSS, React Router |
| **rontend/user-cms-dashboard/** | Client & Public Web Application | React 19, Vite, Tailwind CSS, Context API |

---

## Key Features

### Admin Control Panel (rontend/admin-panel)
* **Interactive Dashboard**: Real-time stats widgets and dynamic Recharts visual distributions.
* **Content Publishing**: Full CRUD workflows for Blogs, Interviews, Categories, and Tags.
* **Service Catalog**: Manage agency service categories, detailed offerings, and uploaded imagery.
* **Moderation Desk**: Review customer reviews with unread count badges and status controls.
* **Admin Profile**: Clean, focused user account card with role indicators and session logout.
* **Pinned Responsive Layout**: Fixed sidebar navigation with isolated, smooth content scrolling.

### Client CMS Portal (rontend/user-cms-dashboard)
* **Modern & Fast**: Built with Vite and Tailwind CSS for instant load times and responsive design.
* **Public Content Showcase**: Dynamic blog feed with search, category filtering, and reading views.
* **Service & Portfolio Hub**: Detailed breakdowns of agency services and client spotlights.
* **User Accounts & Reviews**: Secure registration, login, and authenticated review submissions.

### Backend REST API (ackend/)
* **Modular MVC Architecture**: Clean separation between Routes, Controllers, and Mongoose Models.
* **Stateless Auth**: JWT authentication with bcrypt password hashing and route protection.
* **Cloud Storage**: Integrated Multer and Cloudinary pipelines for media management.
* **Robust CRUD Endpoints**: Complete APIs for Blogs, Services, Categories, Tags, Users, and Reviews.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend - Admin** | React 18, React Router v7, Recharts, React Icons, Axios |
| **Frontend - Client** | React 19, Vite, Tailwind CSS, PostCSS, React Icons |
| **Backend** | Node.js, Express.js (v5), Mongoose (v8), JWT, Bcrypt.js, CORS |
| **Database** | MongoDB Atlas |
| **Media Delivery** | Cloudinary & Multer |

---

## Quick Start (Local Setup)

### Prerequisites
* **Node.js** (v18.x or v20.x)
* **npm** (v9.x or later)
* **MongoDB Atlas URI** (or local MongoDB instance)

---

### 1. Backend Setup
`ash
cd backend
npm install
cp .env.example .env
npm start
`
*Backend runs on: http://localhost:5000*

---

### 2. Admin Panel Setup
`ash
cd frontend/admin-panel
npm install
npm start
`
*Admin Panel runs on: http://localhost:3000*

---

### 3. Client Dashboard Setup
`ash
cd frontend/user-cms-dashboard
npm install
npm run dev
`
*Client Portal runs on: http://localhost:5173*

---

## Demo Credentials

| Portal | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin Panel** | ks@gmail.com | 123456 | Full Administrator Access |
| **Client Portal** | Register a new account or use admin credentials | Standard User Access |

---

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/users/login | Authenticate user & return JWT token |
| POST | /api/users/register | Register a new user |
| GET | /api/users | List all registered users |
| PUT | /api/user/:id | Update profile information |
| GET | /api/blogs | Fetch all published blog articles |
| POST | /api/blogs/create | Publish a new blog post |
| DELETE | /api/blogs/delete/:id | Remove a blog post |
| GET | /api/categories | Retrieve content category taxonomy |
| GET | /api/tags | Retrieve tag taxonomy |
| GET | /api/services | Retrieve agency service catalog |
| GET | /api/interviews | Retrieve interview spotlight items |
| GET | /api/reviews | Retrieve client reviews |
| GET | /api/reviews/unread-count | Retrieve count of pending unread reviews |

---

## Background & Credits

Developed by **Kartik Swami** as a core milestone project during **Industrial Training / Internship** at **Vidhema Solutions**.

* **Author**: Kartik Swami  
* **GitHub**: [@NotYourBr0](https://github.com/NotYourBr0)  
* **Contact**: ks806425@gmail.com
