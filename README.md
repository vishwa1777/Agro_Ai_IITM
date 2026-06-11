# AgroAI 🌿

> An AI-Powered Agricultural Analytics & Field Operations Management Platform.

AgroAI is an enterprise-grade web application built to streamline agricultural distribution networks, track field-agent activities, analyze crop production hazards, and display predictive revenue and regional yield metrics.

---

## 🏗️ Architecture Overview

The platform is structured as a decoupled monorepo managed under a unified workspace:

- **Frontend**: Single Page Application built with **React 19**, **Vite**, and an elegant minimalist UI architecture engineered for dense dashboards and data representation via **Recharts**.
- **Backend**: Distributed REST API managed using **Node.js (ES Modules)**, **Express**, and mapped cleanly through **Mongoose ODM** schemas to a **MongoDB** database.

### Project Workspace Tree

```text
AgroAI (Root Workspace)
├── backend/            # Express REST API, Seeding Pipelines & Mongoose Schemas
├── frontend/           # Vite + React Dashboard UI Application
└── package.json        # Unified process orchestration manager
```

---

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have:

- Node.js (v18+ recommended)
- MongoDB running locally

### 1. Repository Setup & Dependency Installation

Run the root-level setup script:

```bash
npm run install:all
```

### 2. Seed the Database

The project includes a robust mock data generation pipeline for Users, Retailers, Growers, Tasks, Visits, and Analytics.

```bash
# Standard incremental seed
npm run seed

# Drop all collections and rebuild fresh data
npm run seed:fresh
```

### 3. Launch the Development Environment

Start both the backend API and frontend application simultaneously:

```bash
npm run dev
```

#### Default Endpoints

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🛠️ CLI Script Catalog

All platform operations can be executed from the workspace root directory.

| Command                  | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run install:all`    | Install dependencies across Root, Backend, and Frontend workspaces. |
| `npm run dev`            | Run backend and frontend concurrently.                              |
| `npm run backend`        | Start only the Express backend server.                              |
| `npm run frontend`       | Start only the Vite frontend application.                           |
| `npm run seed`           | Populate the database with mock operational data.                   |
| `npm run seed:fresh`     | Remove existing collections and generate fresh seed data.           |
| `npm run build:frontend` | Create an optimized production frontend build.                      |
| `npm run format`         | Run Prettier formatting across the codebase.                        |

---

## 🔑 Demo Credentials

To access the dashboard after seeding the database, use the default credentials:

| Field    | Value             |
| -------- | ----------------- |
| Email    | `amit@agroai.com` |
| Password | `password123`     |

---

## 🧱 Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Development Tools

- Nodemon
- Concurrently
- Prettier

---

## 📄 License

This project is intended for educational, demonstration, and internal enterprise development purposes.
