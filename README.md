# 🚗 Auto-Service Management System

This project is a backend API for managing an auto-service business. It supports multiple user roles like `Owner`, `Worker`, and `Client`, allowing for service bookings, vehicle tracking, employee management, and payment processing.

---

## 📦 Tech Stack

- **Node.js**
- **NestJS** - Modular architecture for backend
- **Prisma ORM** - Database interaction
- **PostgreSQL** - Relational database
- **JWT Auth** - Secure token-based authentication
- **Docker** (optional) - For containerization
- **Mailer Module** - Email confirmations

---

## ⚙️ Features

- 🔐 Authentication & Authorization
  - Register / Sign in for Owner, Worker, and Client
  - Role-based access control

- 🛠️ Service Management
  - Create, update, delete car services
  - Assign services to workers

- 🚗 Vehicle Tracking
  - Clients can register cars
  - View service history and status

- 👨‍🔧 Worker Dashboard
  - View assigned tasks
  - Update progress

- 💳 Payment System
  - Track service payments
  - Handle statuses (Pending, Paid, Failed)

- 📬 Email Notifications
  - Send email for activation links, password reset, etc.

---

## 🏗️ Project Structure
