# 🚀 PartnerSync ERP

A modern, multi-tenant ERP (Enterprise Resource Planning) system designed to manage product catalogs and orders between Admins and Partners. Built with a focus on **Data Isolation**, **Security**, and **Scalability**.

## ✨ Key Features

- 🔐 **JWT Authentication**: Secure, stateless login/logout system with token-based session management.
- 👥 **Role-Based Access Control (RBAC)**: Strict separation of Admin and Partner routes and functionalities.
- 💾 **Persistent Data Storage**: Custom file-based JSON storage ensuring data survives server restarts (easily migratable to PostgreSQL/MongoDB).
- 🛡️ **Multi-tenant Data Isolation**: Partners can only view and order products explicitly assigned to them by the Admin.

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router DOM

**Backend:**
- Node.js + Express
- TypeScript
- JSON Web Token (JWT)
- Node File System (`fs`) for persistent storage

## 📂 Project Structure

```text
partnersync-erp/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── context/   # Auth Context & State Management
│   │   ├── pages/     # Admin & Partner Dashboards
│   │   └── App.tsx    # Protected Routes Configuration
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/ # Business Logic (Auth, Products, Orders)
│   │   ├── middlewares/ # JWT Verification & Role Checks
│   │   ├── routes/      # API Endpoints
│   │   └── server.ts    # Entry Point
│   └── data.json      # Persistent JSON Database
└── .gitignore